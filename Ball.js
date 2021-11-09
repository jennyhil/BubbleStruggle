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

var i = 0;
Ball.prototype = new Entity();

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
};

Ball.prototype.update = function (du) {
    var nextX = this.cx += this.velX * du;
    var nextY = this.cy += this.velY * du;
    // TODO: YOUR STUFF HERE! --- Unregister and check for death √
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    //this.cx += this.velX * du;
    //this.cy += this.velY * du;

    this.keepInbounds();
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

    if(_level.collidesWith(nextX,nextY,this.getRadius())){
        this.velY *= -1;
        console.log("collision!");
    }

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
};

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
