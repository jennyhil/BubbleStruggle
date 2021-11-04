function Level(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.level = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 1]
    ]
}
//Level.prototype = new Entity();

Level.prototype.width = 100;
Level.prototype.height = 30;

Level.prototype.row = 17;
Level.prototype.col = 10;

Level.prototype.render = function (ctx) {

    for (i = 0; i < this.row; i++) {
        for (j = 0; j < this.col; j++) {
            if (this.level[i][j] === 1) {
                this.cx=j*this.width;
                this.cy=i*this.height;
                util.fillBox(ctx,
                    (this.cx),
                    (this.cy),
                    this.width,
                    this.height);
            }
        }
    }
};

