// ==========
// PowerUp STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

function PowerUp(descr) {
    this.setup(descr);

    // TODO: Set sprite
};

PowerUp.prototype = new Entity();
PowerUp.prototype.name = "powerup";

PowerUp.prototype.halfWidth = 5;
PowerUp.prototype.halfHeight = 5;

PowerUp.prototype.update = function (du) {
    spatialManager.unregister(this);
    // Remember my previous position
    var x = this.cx;
    var prevY = this.cy;

    // Compute my provisional new position (barring collisions)
    var nextY = prevY + this.velY * du;

    var isColliding = this.isColliding();
    if (isColliding && isColliding.name == "player") {
        this.activate(this.type, isColliding);
    }

    // *Actually* update my position 
    // ...using whatever velocity I've ended up with
    //
    this.cy += this.velY * du;
    
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    spatialManager.register(this);
};


PowerUp.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    var image; 
    if (this.type == 1) image = g_images.pair;
    else if (this.type == 2) image = g_images.cherry;
    else image = g_images.banana;
    ctx.drawImage(image,this.cx - this.halfWidth,this.cy - this.halfHeight);
};

PowerUp.prototype.activate = function (type, player) {
    //debugger;
    this.isActive = true;
    switch (type) {
        case 1: // Normal bullet
            player.weaponType = 1;
            break;
        case 2:
            player.weaponType = 2;
            break;
        case 3:
            player.shieldActive = true;
            break;
        default:
            break;
    }
    this.kill();
}

