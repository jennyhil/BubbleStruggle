// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Make a noise when I am created (i.e. fired)
    this.fireSound.play();
    
/*
    // Diagnostics to check inheritance stuff
    this._bulletProperty = true;
    console.dir(this);
*/

}

Bullet.prototype = new Entity();
Bullet.prototype.name = "bullet";

// HACKED-IN AUDIO (no preloading)
Bullet.prototype.fireSound = new Audio(
    "sounds/bulletFire.ogg");
Bullet.prototype.zappedSound = new Audio(
    "sounds/bulletZapped.ogg");
    
// Initial, inheritable, default values
Bullet.prototype.rotation = 0;
Bullet.prototype.cx = 200;
Bullet.prototype.cy = 200;
Bullet.prototype.velX = 4;
Bullet.prototype.velY = 5;

// Convert times from milliseconds to "nominal" time units.
Bullet.prototype.lifeSpan = 2200 / NOMINAL_UPDATE_INTERVAL;
Bullet.prototype.isOnCeiling = false;
Bullet.prototype.hasFired = false;

Bullet.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death √
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    

    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

    this.cx += this.velX *du;
    this.cy += this.velY *du;

    this.rotation += 1 * du;
    this.rotation = util.wrapRange(this.rotation,
        0, consts.FULL_CIRCLE);

    this.wrapPosition();
    
    // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
    //
    // Handle collisions
    //
    var hitEntity = this.findHitEntity();
    if (hitEntity && hitEntity.name != "player") {
        console.log("bullet hit ", hitEntity);
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        if (this.type == 2) {
            if (hitEntity.name == "platform") entityManager._bullets[0].isOnCeiling = true;
            else entityManager.resetBullets();
        }
        return entityManager.KILL_ME_NOW;
    }

    if (this.cy > g_canvas.height - 5) {
        if (this.type == 2) {
            entityManager._bullets[0].isOnCeiling = true;
            this.cy -= this.velY * du; //hackedyhack svo kúlan haldist kyrr
        }
        else return entityManager.KILL_ME_NOW;
    }

    // handle types
    if (this.type == 2) {
        if (!this.hasFired && !entityManager._bullets[0].isOnCeiling) {
            entityManager.fireBullet(this.cx, this.cy, this.velX, this.velY, this.rotation, 2);
            this.hasFired = true;
        }
        this.cy -= this.velY * du;
    }
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register √
    spatialManager.register(this);

};

Bullet.prototype.getRadius = function () {
    return 4;
};

Bullet.prototype.takeBulletHit = function () {
    this.kill();
    // Make a noise when I am zapped by another bullet
    this.zappedSound.play();
};

Bullet.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.bullet.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};