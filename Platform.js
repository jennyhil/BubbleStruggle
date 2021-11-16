function Platform(descr) {
    this.setup(descr);

    spatialManager.register(this);
}
Platform.prototype = new Entity();
Platform.prototype.cx;
Platform.prototype.cy;
Platform.prototype.width = 150;
Platform.prototype.height = 15;

Platform.prototype.name = "platform";

Platform.prototype.getRadius = function() {
    return this.height / 2;
}
Platform.prototype.getWidth = function() {
    return this.width;
}
Platform.prototype.update = function() {
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
}
/*
Platform.prototype.collidesWith = function(posX, posY, width, height) {
    var halfWidth = width /2;
    var halfHeight = height/2;
    if (posY + halfHeight > this.cy && posX - halfWidth < this.cx + this.width
        && posX + halfWidth > this.cx && posY - halfHeight < this.cy + this.height) {
            return true;
        } else {
            return false;
        }
}
*/

Platform.prototype.collidesWithPlatform = function(posX,posY,radius) {
    var distX = Math.abs(posX - this.cx - this.width/2);
    var distY = Math.abs(posY - this.cy - this.height/2);
    var dx = distX - this.width/2;
    var dy = distY - this.height/2;

    if (distX > (this.width/2 + radius)) return false;
    if (distY > (this.height/2 + radius)) return false;

    if (distX <= this.width/2) return true;
    if (distY <= this.height/2) return true;
    if (dx*dx+dy*dy <= radius * radius) return true;
}

Platform.prototype.render = function (ctx) {
    var platform; 
    platform = g_images.platform1;
    ctx.drawImage(platform,this.cx,this.cy, this.width, this.height);
};