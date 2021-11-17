/*

levelManager that handles different levels - 
handles different platforms, number of balls etc.

*/
"use strict";

var levelManager = {


    _levels: [],
    _levelID: 0,
    _time: 0,
    _timeLeft: 0,
    _score: 0,
    

    nextLevel: function () {
        entityManager.clearPlatforms();
        entityManager.clearBalls();
        levels.level[this._levelID].isFinished = true;
        this._levelID++;
        this.addTimerToScore();
        this.initLevel();
    },

    initLevel : function() {
        this.generatePlatforms();
        this.generateBalls();
        this.initTimer();
    },

    generatePlatforms: function() {
        for(var i=0; i< levels.level[this._levelID].platforms.length; i++) {
            entityManager.generatePlatform({
                cx: levels.level[this._levelID].platforms[i].cx,
                cy: levels.level[this._levelID].platforms[i].cy
            })
        }
    },

    generateBalls: function () {
       // debugger;
        for (var i = 0; i < levels.level[this._levelID].balls.length; i++) {
            entityManager.generateBall({
                cx: levels.level[this._levelID].balls[i].cx,
                cy: levels.level[this._levelID].balls[i].cy
            })
        }
    },

    initTimer: function () {
        this._time = levels.level[this._levelID].time;
        this._timeLeft = this._time;
        
        setInterval(() => {
            this._timeLeft -= 200;
        }, 200);
    },

    addTimerToScore: function () {
        debugger;
        var timerScore = this._timeLeft / 10;
        this._score += timerScore;
    },

    gameOver: function () {
        g_gameOver = true;
    },

    update: function () {
        if (this._timeLeft <= 0) this.gameOver();
    },

    render: function (ctx) {
        ctx.font = "60px VT323"
        ctx.fillText(this._score.toString(), 50, 50);
        var timeFillRatio = this._timeLeft / this._time;
        util.fillBox(ctx, 0, g_canvas.height - 20, timeFillRatio * g_canvas.width, 20, "white");
    },

    renderStart: function (ctx) {
        // For now a shitty mock up starting page
        util.fillBox(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, "teal");
        ctx.fillStyle="black";
        ctx.font ="40px VT323";
        var txt="Press S to start";

        g_sprites.frontpage = new Sprite(g_images.frontpage);
        // Render player 1
        g_sprites.frontpage.drawCentredAt(
            ctx, ctx.canvas.width/2, ctx.canvas.height/20);

        ctx.fillText(txt,g_canvas.width/2- ctx.measureText(txt).width/2,g_canvas.height-40);
        // Render player 2
       // g_sprites.player2.drawCentredAt(
            //ctx, ctx.canvas.width / 2 + 10, ctx.canvas.height / 2);
    }

}

