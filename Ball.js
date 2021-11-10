// ====
// ROCK
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Ball(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.randomisePosition();
    //this.randomiseVelocity();
    this.setVelocity();

    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ball;
    this.scale = this.scale || 2;

    /*
        // Diagnostics to check inheritance stuff
        this._rockProperty = true;
        console.dir(this);
    */

};
var i=0;
Ball.prototype = new Entity();
Ball.prototype.lastJumpAt = 0;

Ball.prototype.keepInbounds = function () {
    // Bounce off top and bottom edges
    if (this.cy - this.radius < 0) {    // top edge
        this.velY *= -1;
    }
    if (this.cy + this.radius > g_canvas.height) {               // bottom edge
        this.velY *= -1;
    }
    // Bounce off left and right edges
    if (this.cx - this.radius < 0 || // left edge
        this.cx + this.radius > g_canvas.width) { // right edge
        this.velX *= -1
    }
}

Ball.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
};

Ball.prototype.setVelocity = function () {

    //var MIN_SPEED = 20,
    /* var MAX_SPEED = 70;
  
  var speed = MAX_SPEED / SECS_TO_NOMINALS;
  var dirn = Math.random() * consts.FULL_CIRCLE;
  */
    if (i % 2 === 0) {
        this.velX = 2;
        this.velY = 4;
        i++;
    }
    else {
        this.velX = -2;
        this.velY = 4;
        i++;
    }

    if (this.split) this.velY *= -1;
    /*
    var MIN_ROT_SPEED = 0.5,
        MAX_ROT_SPEED = 2.5;
    
    this.velRot = this.velRot ||
        util.randRange(MIN_ROT_SPEED, MAX_ROT_SPEED) / SECS_TO_NOMINALS;
    */

};
/*Ball.prototype.setVelocity = function () {
    this.velX = 4;
    this.velY =4;
};*/

Ball.prototype.applyAccel = function (accelX, accelY, du) {

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


Ball.prototype.update = function (du) {

    var minY = this.lastJumpAt;
    var maxY = g_canvas.height - minY;

    var nextX = this.cx += this.velX * du;
    var nextY = this.cy + this.velY * du;

   /* if (nextY > maxY || nextY < minY) {
        this.velY = 1 * -0.9;
    }
    if (this.velY < 0) this.velY /= 1.01;
    else if (this.velY > 0.05) this.velY *= 1.02
    else this.velY += 0.1;*/
    this.cy += this.velY * du;

    // TODO: YOUR STUFF HERE! --- Unregister and check for death √
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    //this.cx += this.velX * du;
    

    this.keepInbounds();
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);
<<<<<<< HEAD
    /*
=======
/*
>>>>>>> b1fda6fd5923fb96546f7d5f41139a95ae304f29
    if(_level.collidesWith(nextX,nextY)){
        this.velY *= -1;
        this.lastJumpAt = this.cy;
        console.log("collision!");
    }*/

};

Ball.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

// HACKED-IN AUDIO (no preloading)
Ball.prototype.splitSound = new Audio(
    "sounds/rockSplit.ogg");
Ball.prototype.evaporateSound = new Audio(
    "sounds/rockEvaporate.ogg");

Ball.prototype.takeBulletHit = function () {
    this.kill();

    if (this.scale > 0.25) {
        this._spawnFragment();
        this._spawnFragment();

        this.splitSound.play();
    } else {
        this.evaporateSound.play();
    }

    if (Math.random() < 0.4) {
        this._spawnPowerup();
    }
};

Ball.prototype._spawnPowerup = function () {
    var id = Math.floor(Math.random() * 3) + 1; // currently 3 powerups
    
    entityManager.generatePowerup({
        cx: this.cx,
        cy: this.cy,
        velY: 3,
        type: id,
        isActive: false

    });
}

Ball.prototype._spawnFragment = function () {
    entityManager.generateBall({
        cx: this.cx,
        cy: this.cy,
        scale: this.scale / 2,
        split: true
        
    });
};

Ball.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};