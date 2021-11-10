function Platform(descr) {
    this.setup(descr);

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
<<<<<<< HEAD
    //spatialManager.register();
    
=======
  
>>>>>>> b1fda6fd5923fb96546f7d5f41139a95ae304f29
}
Platform.prototype = new Entity();
Platform.prototype.cx;
Platform.prototype.cy;
Platform.prototype.width = 100;
Platform.prototype.height = 30;

Platform.prototype.row = 17;
Platform.prototype.col = 10;


Platform.prototype.render = function (ctx) {

<<<<<<< HEAD
    //util.fillBox(ctx,this.x,this.y,this.width,this.height);
    
=======
    ctx.fillStyle = "white";
>>>>>>> b1fda6fd5923fb96546f7d5f41139a95ae304f29
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
};
 
<<<<<<< HEAD
Platform.prototype.update = function() {

}

Platform.prototype.collidesWith = function (nextX, nextY) {

=======
Platform.prototype.collidesWith = function (nextX, nextY,r) {
    //console.log(nextY)
>>>>>>> b1fda6fd5923fb96546f7d5f41139a95ae304f29
    var rowNr = Math.floor(nextY / this.height);
    var colNr = Math.floor(nextX / this.width);
    
    if (  rowNr >= 0 && colNr >= 0 && this.platform[rowNr][colNr] === 1) {
        //this.platform[rowNr][colNr] = 0;
<<<<<<< HEAD
        
=======
       // console.log(rowNr)
>>>>>>> b1fda6fd5923fb96546f7d5f41139a95ae304f29
        return true;
    }
    return false;

};