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
    this.setPosition();
    this.setVelocity();

    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ball;
    this.scale = this.scale || 2;
};

var i=0;
Ball.prototype = new Entity();
Ball.prototype.lastJumpAt = 0;
Ball.prototype.maxJumpHeight = 400;
Ball.prototype.useGravity = false;

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

Ball.prototype.setPosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || g_canvas.width / 2;
    this.cy = this.cy || this.maxJumpHeight - 1;
};

Ball.prototype.setVelocity = function () {

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
    if (this.useGravity) {
        var ballRadius = g_sprites.ball.height / 2; // TODO: this might not be a sprite
        var minY = g_canvas.height - this.maxJumpHeight;
        var maxY = g_canvas.height - ballRadius;

        if (nextY > maxY || nextY < minY) {
            // Stay put on ground
           
            if (nextY > maxY) {
                this.useGravity = false;
                this.velY = 0;
                if (this.split) this.split = false;
            } else {
                this.velY = 0;
                this.cy += 2*du;
            }
            //this.velY *= -1;
            
            intervalVelY = this.velY;
        }
    }

    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Ball.prototype.computeGravity = function () {
    return this.useGravity ? 0.12 : 0;
};

Ball.prototype.computeThrustMag = function () {
    var thrust = 0;
    // Ef við erum ekki í miðju hoppi eða búin að ná max hæð þá eykst thrust
    if (this.cy > 560) { // TODO: Ná í hæð bolta
        // hér er boltinn að fara upp
        
        this.useGravity = false;
        thrust += 3; 
    } else {
        // Ef boltinn er í max hæð þá kickar gravity inn
        this.useGravity = true;
    }
    return thrust;
};


Ball.prototype.update = function (du) {
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;


    var thrust = this.computeThrustMag();
    // Apply thrust directionally, based on our rotation
    //var accelX = +Math.sin(this.rotation) * thrust;
    var accelX = 0;
    var accelY = -1 * thrust;

    accelY += this.computeGravity();
    this.applyAccel(accelX, accelY, du);

 /*   var minY = this.lastJumpAt;
    var maxY = g_canvas.height - minY;
    var nextX = this.cx += this.velX * du;
    var nextY = this.cy + this.velY * du;*/

   /* if (nextY > maxY || nextY < minY) {
        this.velY = 1 * -0.9;
    }
    if (this.velY < 0) this.velY /= 1.01;
    else if (this.velY > 0.05) this.velY *= 1.02
    else this.velY += 0.1;*/
    // this.cy += this.velY * du;

    // TODO: YOUR STUFF HERE! --- Unregister and check for death √
   

    //this.cx += this.velX * du;
    

    this.keepInbounds();
    // TODO: YOUR STUFF HERE! --- (Re-)Register
    spatialManager.register(this);

    var hitEntity = this.findHitEntity();
    if (hitEntity && hitEntity.name === "platform") {
        this.velY *= -1;
    }
/*
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
    var id = Math.floor(Math.random() * 4) + 1; // currently 4 powerups
    
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
        velY: this.velY,
        split: true,
        maxJumpHeight: 3*this.maxJumpHeight / 4
        
    });
};
            
Ball.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
};