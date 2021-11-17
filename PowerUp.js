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
PowerUp.prototype.isOnFloor = false;

PowerUp.prototype.update = function (du) {
    spatialManager.unregister(this);
    // Remember my previous position
  
    var isColliding = this.isColliding();
    if (isColliding && isColliding.name == "player") {
        this.activate(this.type, isColliding);
    }
    if (this.cy > g_canvas.height - 60) {
        this.isOnFloor = true; // make not hardcoded if there is time
        setTimeout(() => {
            this.kill();
        }, 3000);
    }

    // *Actually* update my position 
    // ...using whatever velocity I've ended up with
    //
    if (!this.isOnFloor) this.cy += this.velY * du;
    
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    spatialManager.register(this);
};


PowerUp.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
<<<<<<< HEAD
    var image; 
    if (this.type == 1) image = g_images.fireball;
    else if (this.type == 2) image = g_images.rope;
    else if (this.type == 3) image = g_images.umbrella; //shield
    else image = g_images.klukka; //klukka
    // b�ta vi� 4 og 5 (aukat�mi og aukastig)
=======
    var image;
    switch (this.type) {
        case 1:
            image = g_images.pair;
            break;
        case 2:
            image = g_images.cherry; // breyta í fire
            break;
        case 3:
            image = g_images.umbrella;
            break;
        case 4:
            image = g_images.klukka;
            break;
        case 5:
            image = g_images.cherry;
            break;
        default:
            image = g_images.cherry;
            break;
    }
>>>>>>> a35ec3fbacac3f41dc07014dde4783d2beec7142
    ctx.drawImage(image,this.cx - this.halfWidth,this.cy - this.halfHeight);
};

PowerUp.prototype.activate = function (type, player) {
    this.isActive = true;
    switch (type) {
        case 1: // Normal bullet
            player.weaponType = 1;
            g_sprites.bullet = new Sprite(g_images.fireball);
            g_sprites.bullet.scale = 0.25;
            break;
        case 2: // Rope bullet
            player.weaponType = 2;
            g_sprites.bullet = new Sprite(g_images.rope);
            g_sprites.bullet.scale = 0.25;
            break;
        case 3: // Activate shield
            player.shieldActive = true;
            break;
        case 4: // 3 extra seconds (or more/less if we want)
            levelManager._timeLeft += 3000;
            break;
        case 5: // Extra score
            levelManager._score += 250;
            break;
        default:
            break;
    }
    this.kill();
}

