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
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
 }
  
 Platform.prototype.sideHit = function (posX, posY, width) {
    if ((posX + width > 5+this.cx && posX-width < this.cx && !this.collidesWith(posX,posY,width,width*2)&& (!(posY + width < this.cy) && !(posY - width > this.cy + this.height))) || this.sideHitRight(posX,posY,width)) {
        console.log("sidehitLeft")
       // console.log(posX + width > this.cx, posY + width <= this.cy, posY - width <= this.cy + this.height)
       // console.log("POSYBALL: ", posY + width, "thisCY: ", this.cy)
        return true;
    }
    return false
 }
  
 Platform.prototype.sideHitRight = function (posX, posY, width) {
    //console.log(posX+width,this.cx+this.width)
    //console.log(posX - width < this.cx+this.width, posX+width > this.cx+this.width,!(posY - width > this.cy),!(posY + width < this.cy + this.height))
    if (posX - width < this.cx+this.width && posX+width > this.cx+this.width && !this.collidesWith(posX,posY,width,width*2) && (!(posY + width < this.cy) && !(posY - width > this.cy + this.height))) {
        console.log("sidehitRight")
        return true;
    }
    return false
 }

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

 Platform.prototype.collidesWith = function (posX, posY, width, height) {
    var halfWidth = width / 2;
    var halfHeight = height / 2;
  
    if ((posY + halfHeight > this.cy && posX - halfWidth < this.cx + this.width
        && posX + halfWidth > this.cx && posY - halfHeight < this.cy + this.height)) {
            //console.log("tophit")
        return true;
    }
     return false;
 }
 Platform.prototype.render = function (ctx) {
    var platform;
    platform = g_images.platform1;
    ctx.drawImage(platform, this.cx, this.cy, this.width, this.height);
 };
 
 