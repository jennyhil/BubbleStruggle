function Platform(descr) {
    this.setup(descr);

    spatialManager.register(this);
}
Platform.prototype = new Entity();
Platform.prototype.cx;
Platform.prototype.cy;
Platform.prototype.width = 150;
Platform.prototype.height = 30;

Platform.prototype.name = "platform";

Platform.prototype.getRadius = function() {
    return this.height / 2;
}
Platform.prototype.getWidth = function() {
    return this.width;
}
Platform.prototype.update = function() {
    
}
Platform.prototype.collidesWith = function(posX, posY, width, height) {
    var halfWidth = width /2;
    var halfHeight = height/2;
    if (posY + halfHeight > this.cy && posX - halfWidth < this.cx + this.width
        &&posX + halfWidth > this.cx && posY - halfHeight < this.cy + this.height) {
            return true;
        } else {
            return false;
        }
}
Platform.prototype.render = function (ctx) {
    var platform; 
    platform = g_images.platform1;
    ctx.drawImage(platform,this.cx,this.cy, this.width, this.height);
};