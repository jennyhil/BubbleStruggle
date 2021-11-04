function Platform(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.platform = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [1,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,0,0,1]
    ]
}
//Platform.prototype = new Entity();

Platform.prototype.width = 100;
Platform.prototype.height = 30;

Platform.prototype.row = 17;
Platform.prototype.col = 10;

Platform.prototype.render = function (ctx) {

    for (i=0; i<this.row; i++){
        for(j=0; j < this.col; j++) {
            if(this.platform[i][j] === 1) {
                util.fillBox(ctx,
                    (j*(this.width)),
                    (i*(this.height)),
                    this.width,
                    this.height);
            }
        }
    }
};
 
Platform.prototype.collidesWith = function (nextX, nextY) {

    var rowNr = Math.floor(nextY / this.height);
    var colNr = Math.floor(nextX / this.width);

    if ( nextY < this.row * this.height && rowNr >= 0 && colNr >= 0 && this.platform[rowNr][colNr] === 1) {
        //this.platform[rowNr][colNr] = 0;
        return true;
    }
    return false;

};
