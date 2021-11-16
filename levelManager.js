/*

levelManager that handles different levels - 
handles different platforms, number of balls etc.

*/
"use strict";
//debugger;

var levelManager = {


    _levels: [],
    _levelID: 0,
    _time: 0,
    _timeLeft: 0,
    

    nextLevel: function () {
        //debugger;
        levels.level[this._levelID].isFinished = true;
        this._levelID++;
        this.initLevel();
    },

    initLevel : function() {
        this.generatePlatforms();
        this.generateBalls();
        this.initTimer();
    },

    generatePlatforms: function () {
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
        setTimeout(() => {
            this.gameOver();
        }, this._time);
        setInterval(() => {
            this._timeLeft -= 500;
        }, 500);
    },

    gameOver: function () {
        g_gameOver = true;
    },

    update: function () {
        if (this._timeLeft <= 0) this.gameOver();
        //if (eatKey(this.KEY_NEXTLEVEL)) this.nextLevel();
    },

    renderStart: function (ctx) {
        // For now a shitty mock up starting page
        util.fillBox(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, "teal");
        ctx.fillStyle="black";
        ctx.font ="40px VT323";
        var txt="Press S to start";

        ctx.fillText(txt,g_canvas.width/2- ctx.measureText(txt).width/2,g_canvas.height-40);
        g_sprites.player = new Sprite(g_images.playerright);
        g_sprites.player2 = new Sprite(g_images.player2right);
        g_sprites.player.scale = 1.5;
        
        // Render player 1
        g_sprites.player.drawCentredAt(
            ctx, ctx.canvas.width / 2 - 80, ctx.canvas.height / 2);
        // Render player 2
        g_sprites.player2.drawCentredAt(
            ctx, ctx.canvas.width / 2 + 10, ctx.canvas.height / 2);
    }

}

