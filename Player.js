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
    this._scale = 0.8;
    this._isWarping = false;
    this.lives = 3;
}

Player.prototype = new Entity();
Player.prototype.name = "player";

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Player.prototype.KEY_JUMP = 'W'.charCodeAt(0);
Player.prototype.KEY_LEFT = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT = 'D'.charCodeAt(0);

Player.prototype.KEY_FIRE = ' '.charCodeAt(0);
Player.prototype.KEY_ONE = '1'.charCodeAt(0); // Regular bullet
Player.prototype.KEY_TWO = '2'.charCodeAt(0); // Rope bullet
Player.prototype.KEY_THREE = '3'.charCodeAt(0); // Shield

// Initial, inheritable, default values
Player.prototype.rotation = 0;
Player.prototype.cx = 200;
Player.prototype.cy = 200;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.launchVel = 4;
Player.prototype.numSubSteps = 1;
Player.prototype.weaponType = 1;
Player.prototype.shieldActive = false;
Player.prototype.isImmune = false;

// HACKED-IN AUDIO (no preloading)
/*Player.prototype.warpSound = new Audio(
    "sounds/PlayerWarp.ogg");
*/
Player.prototype.warp = function () {

    this._isWarping = true;
    this._scaleDirn = -1;
    //this.warpSound.play();

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
        this.cy = g_canvas.height - 30;

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

Player.prototype.isGameOver = function () {
    if (entityManager._players.length == 1) {
        if (entityManager._players[0]._isDeadNow) return true;
    }
    else if (entityManager._players[0]._isDeadNow && entityManager._players[1]._isDeadNow) return true;
    else return false;
}
/* TODO: Þarf að finpussa, skores hja player 2 færist í player 1 þegar deyr 
Player.prototype.showLives = function () {
    var oldStyle = ctx.fillStyle;
    g_ctx.fillStyle = "white";
    g_ctx.font = "16px Arial";
    // Gætum viljað gert hnitin f. scores meira mathematically staðsett með offset t.d.
    g_ctx.fillText("Lives: " + entityManager._players[0].lives, 10, 570);
    if (entityManager._players.length > 1) {
        g_ctx.fillText("Lives: " + entityManager._players[1].lives, 940, 550);
    }
    ctx.fillStyle = oldStyle;
}*/

// Changes direction of sprite image
Player.prototype.changeDirection = function () {
    var isPlayerOne = this.sprite.image.name === "player" || this.sprite.image.name === "playerright" || this.sprite.image === "playerleft";
    var isPlayerTwo = this.sprite.image.name === "player2" || this.sprite.image.name === "player2right" || this.sprite.image === "player2left";

    if (isPlayerOne) {
        if (keys[this.KEY_LEFT]) this.sprite = new Sprite(g_images.playerleft);
        else this.sprite = new Sprite(g_images.playerright);
        return this.sprite;
    }
    if (isPlayerTwo) {
        if (keys[this.KEY_LEFT]) this.sprite = new Sprite(g_images.player2left);
        else this.sprite = new Sprite(g_images.player2right);
        return this.sprite;
    }
    return this.sprite;
}

Player.prototype.update = function (du) {
    if (this.sprite.image.name === "playerleft" ||
        this.sprite.image.name === "playerright") this.sprite = new Sprite(g_images.player);
    else if (this.sprite.image.name === "player2left"
        || this.sprite.image.name === "player2right") this.sprite = new Sprite(g_images.player2)

    if (this.lives <= 0) this.kill();

    var nextX = this.cx;
    var nextY = this.cy;

    if (keys[this.KEY_RIGHT]) {
        this.changeDirection();
        if (this.notOnGround()) nextX += 2 * du;
        else nextX += 4 * du;
    } else if (keys[this.KEY_LEFT]) {
        this.changeDirection();
        if (this.notOnGround()) nextX -= 2 * du;
        else nextX -= 4 * du;
    }
    this.cx = nextX
    this.cy = nextY;

    if (keys[this.KEY_ONE]) this.weaponType = 1;
    if (keys[this.KEY_TWO]) this.weaponType = 2;
    if (eatKey(this.KEY_THREE)) this.shieldActive = !this.shieldActive;

    //platform trampolin collision!
    var hitEntity = this.findHitEntity();
    if (hitEntity && hitEntity.name === "platform") {
        this.velY *= -1.2;
    }

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
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }
    // Handle firing
    this.maybeFireBullet();

    // TODO: YOUR STUFF HERE! --- Warp if isColliding, otherwise Register √
    var isColliding = this.isCollidingWithBall();
    if (isColliding) {
        if (this.shieldActive) {
            // TODO: Make it fade or put hit animation
            setTimeout(() => {
                this.shieldActive = false;
            }, 1000);
        }
        else if (!this.isImmune) {
            this.lives--;
            this.warp();
            this.isImmune = true;
            setTimeout(() => {
                this.isImmune = false;
            }, 2000);
        }
    }
    else spatialManager.register(this);
};

Player.prototype.isCollidingWithBall = function () {
    var entityInRange = null;
    for (var e in entityManager._balls) {
        var ball = entityManager._balls[e];
        var distSq = util.wrappedDistSq(
            ball.posX, ball.posY,
            this.cx, this.cy,
            g_canvas.width, g_canvas.height);

        if (distSq < util.square(this.radius + ball.radius) &&
            (this.cx != ball.posX && this.cy != ball.posY)) {
            if (ball.posY > 100) entityInRange = e;
        }
    }
    return entityInRange;
}

Player.prototype.computeSubStep = function (du) {
    var thrust = this.computeThrustMag();
    // Apply thrust directionally, based on our rotation
    var accelX = +Math.sin(this.rotation) * thrust;
    var accelY = -Math.cos(this.rotation) * thrust;
    accelY += this.computeGravity();
    this.applyAccel(accelX, accelY, du);
    this.wrapPosition();
};

// Spurning hvað við viljum að gravity sé, hækkaði í 0.15 úr 0.12
var NOMINAL_GRAVITY = 0.15;

Player.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};

var NOMINAL_THRUST = +8;
var maxJumpHeight = 500;

// Hjálparfall til að ath hvort sprite sé á jörðinni/lentur eftir hoppið
Player.prototype.notOnGround = function () {

    return (this.cy + this.getRadius() <= 590);
}

// Sér um hoppið og passar að það sé ekki hægt að hoppa tvisvar
Player.prototype.computeThrustMag = function () {
    var thrust = 0;
    // Ef ýtt er á Jump (w) og við erum ekki í miðju hoppi eða búin að ná max hæð þá eykst thrust
    if (eatKey(this.KEY_JUMP) && this.cy > maxJumpHeight && !this.notOnGround()) {
        // hér erum við í stökkinu
        thrust += NOMINAL_THRUST;
    } else {
        // Ef við erum búin að ná max hæð í stökkinu þá kickar gravity inn
        g_useGravity = true;
    }
    return thrust;
};

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

        if (nextY > maxY || nextY < minY) {
            // Stay put on ground
            this.velY = 0;
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

        var launchX = this.cx + dX * launchDist;
        var launchY = this.cy + dY * launchDist;

        if (this.weaponType == 2) {
            launchY += launchDist;
            var bullets = entityManager._bullets;
            if (bullets.length > 0) entityManager.resetBullets();
        }
        entityManager.fireBullet(
            launchX, launchY,
            this.velX + relVelX, this.velY + relVelY,
            this.rotation, this.weaponType);

    }

};

Player.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
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
Player.prototype.drawLives = function (ctx) {

    for (var i = 0; i < this.lives; i++) {
        g_sprites.playericon.scale = this._scale - 0.5;
        g_sprites.player2icon.scale = this._scale - 0.5;
        if (this.sprite.image.name === "player" || this.sprite.image.name === "playerleft" ||
            this.sprite.image.name === "playerright") {

            g_sprites.playericon.drawCentredAt(
                ctx, 50 + i * 25, 550, this.rotation
            );
        } else g_sprites.player2icon.drawCentredAt(
            ctx, (g_canvas.width - 90) + i * 25, 550, this.rotation
        );
    }
}

Player.prototype.render = function (ctx) {
    if (this.lives > 0) this.drawLives(ctx);
    if (this.isGameOver()) g_gameOver = true;
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.drawLives(ctx);
    this.sprite.scale = this._scale;
    // 60 is a weird little margin so the sprites will be drawn in the right pos
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy - 60, this.rotation
    );
    this.sprite.scale = origScale;

    if (this.shieldActive) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        util.strokeCircle(ctx, this.cx, this.cy-50, 60); // TODO: find dynamic radius value
    }
};