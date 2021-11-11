function Platform(descr) {
    this.setup(descr);
/*
    this.platform = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,0,1]
    ]
  */
}
Platform.prototype = new Entity();
Platform.prototype.cx;
Platform.prototype.cy;
Platform.prototype.width = 150;
Platform.prototype.height = 30;

Platform.prototype.row = 17;
Platform.prototype.col = 10;

Platform.prototype.update = function() {
    
}
Platform.prototype.render = function (ctx) {
    ctx.fillStyle = "white";
    util.fillBox(ctx,this.cx,this.cy, this.width, this.height)
/*
    ctx.fillStyle = "white";
    for (i=0; i<this.row; i++){
        for(j=0; j < this.col; j++) {
            if(this.platform[i][j] === 1) {
                this.cx=j*this.width;
                this.cy=i*this.height;
                util.fillBox(ctx,
                    (j*(this.width)),
                    (i*(this.height)),
                    this.width,
                    this.height);
            }
        }
    }
*/
};
