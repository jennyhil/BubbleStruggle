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

Platform.prototype.getRadius = function () {
    return this.height / 2;
}
Platform.prototype.getWidth = function () {
    return this.width;
}
Platform.prototype.update = function () {


}

Platform.prototype.collidesWith = function (posX, posY, width, height) {
    var halfWidth = width/2;
    var halfHeight = height / 2;
    var platformTop = this.cy;
    var platformBottom = this.cy + this.height;
    var platformLeft = this.cx;
    var platformRight = this.cx + this.width;
    var ballLeft = posX - width;
    var ballRight = posX + width / 2;
    var ballTop = posY - width / 2;
    var ballBottom = posY + width / 2;
    //console.log("platformCXLeft: ",this.cx+this.width," ballCX: ",posX-width," ballCY: ",posY);
    console.log("platformCXLeft: ", this.cx + this.width, " ballCX: ", posX - width, "platformBottom: ", this.cy + this.height, " ballCyTop: ", posY - width)
  /*if (posY + halfHeight > this.cy && posX - halfWidth < this.cx + this.width
        && posX + halfWidth > this.cx && posY - halfHeight < this.cy + this.height) {
            console.log("Regular HIT")
        return true;
    }*/
    var topLeftCornerX = this.cx;
    var topLeftCornerY =this.cy;
    var bottomLeftCornerX=this.cx;
    var bottomLeftCornerY=this.cy+this.height;
    var topRightCornerX=this.cx+this.width;
    var topRightCornerY=this.cy;
    var bottomRightCornerX=this.cx+this.width;
    var bottomRightCornerY=this.cy+this.height;
    // Check for collision on sides of platform
    // left side of platform
    if(topLeftCornerX > posX && topLeftCornerY > posY) console.log

}

Platform.prototype.render = function (ctx) {
    var platform;
    platform = g_images.platform1;
    ctx.drawImage(platform, this.cx, this.cy, this.width, this.height);
};
