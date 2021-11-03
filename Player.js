// ==========
// Player STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.player;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isWarping = false;
}

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Player.prototype.KEY_JUMP = 'W'.charCodeAt(0);
//Player.prototype.KEY_RETRO = 'S'.charCodeAt(0);
Player.prototype.KEY_LEFT = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT = 'D'.charCodeAt(0);

Player.prototype.KEY_FIRE = ' '.charCodeAt(0);

// Initial, inheritable, default values
Player.prototype.rotation = 0;
Player.prototype.cx = 200;
Player.prototype.cy = 200;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.launchVel = 2;
Player.prototype.numSubSteps = 1;

// HACKED-IN AUDIO (no preloading)
Player.prototype.warpSound = new Audio(
    "sounds/PlayerWarp.ogg");

Player.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    this.warpSound.play();

    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Player.prototype._updateWarp = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;

    if (this._scale < 0.2) {

        this._moveToASafePlace();
        this.halt();
        this._scaleDirn = 1;

    } else if (this._scale > 1) {

        this._scale = 1;
        this._isWarping = false;

        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);

    }
};

Player.prototype._moveToASafePlace = function () {
    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {

        var warpDistance = 100 + Math.random() * g_canvas.width / 2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;

        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = g_canvas.height-30;

        this.wrapPosition();

        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;

    }
};
var GRAVITY = 2;
Player.prototype.update = function (du) {
    var nextX = this.cx;
    var nextY = this.cy;

    if (this.cy+g_sprites.player.height/2  < 600) {
        nextY += GRAVITY;
    }

    if (keys[this.KEY_RIGHT]) {
            nextX += 5 * du;
    } else if (keys[this.KEY_LEFT]) {
            nextX -= 5 * du;
    } else if (eatKey(this.KEY_JUMP)) {
        nextY -= 100 * du;
    }
    this.cx = nextX
    this.cy = nextY;

    // Handle warping
    if (this._isWarping) {
        this._updateWarp(du);
        return;
    }
    this.wrapPosition();

    // TODO: YOUR STUFF HERE! --- Unregister and check for death √
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    // Perform movement substeps
   /* var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }*/

    // Handle firing
    this.maybeFireBullet();

    // TODO: YOUR STUFF HERE! --- Warp if isColliding, otherwise Register √
    if (this.isColliding()) this.warp();
    else spatialManager.register(this);

};

/*Player.prototype.computeSubStep = function (du) {
    var thrust = this.computeThrustMag();
    // Apply thrust directionally, based on our rotation
    var accelX = +Math.sin(this.rotation) * thrust;
    var accelY = -Math.cos(this.rotation) * thrust;
    accelY += this.computeGravity();
    this.applyAccel(accelX, accelY, du);
    this.wrapPosition();
    if (thrust === 0 || g_allowMixedActions) {
        this.updateRotation(du);
    }
};*/

var NOMINAL_GRAVITY = 0.12;

Player.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};

//var NOMINAL_THRUST = 30;
var NOMINAL_RETRO = -0.1;

/*Player.prototype.computeThrustMag = function () {
    var thrust = 0;
    if (eatKey(this.KEY_THRUST)) {
        this.cy -= 100;
    }
    return thrust;
};
*/
Player.prototype.applyAccel = function (accelX, accelY, du) {

    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;

    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du;

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;

    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;

    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;

    // bounce
    if (g_useGravity) {
    
        var minY = g_sprites.player.height / 2;
        var maxY = g_canvas.height - minY;
/*
        // Ignore the bounce if the Player is already in
        // the "border zone" (to avoid trapping them there)
        if (this.cy > maxY || this.cy < minY) {
            // do nothing
        } else if (nextY > maxY || nextY < minY) {
            this.velY = oldVelY * -0.9;
            intervalVelY = this.velY;
        }*/
        if (nextY > maxY || nextY < minY) {
            this.velY = 1 * -0.9;
            intervalVelY = this.velY;
        }
    }

    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Player.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE]) {

        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;

        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;

        entityManager.fireBullet(
            this.cx + dX * launchDist, this.cy + dY * launchDist,
            this.velX + relVelX, this.velY + relVelY,
            this.rotation);

    }

};

Player.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Player.prototype.takeBulletHit = function () {
    this.warp();
};

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

Player.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_ROTATE_RATE = 0.1;
// Modified from asteroids below
/*Player.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) {
        this.rotation -= NOMINAL_ROTATE_RATE * du;
    }
    if (keys[this.KEY_RIGHT]) {
        this.rotation += NOMINAL_ROTATE_RATE * du;
    }
}; */
Player.prototype.updateRotation = function (du) {
    if (keys[this.KEY_LEFT]) {
        this.cx -= 2*du;
    }
    if (keys[this.KEY_RIGHT]) {
        this.cx +=2* du;
    }
    
};

Player.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};