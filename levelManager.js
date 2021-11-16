/*

levelManager that handles different levels - 
handles different platforms, number of balls etc.

*/
"use strict";
debugger;

var levelManager = {


    _levels: [],
    _levelID: 0,
    _time: 0,
    _timeLeft: 0,
    

    nextLevel: function () {
        debugger;
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
        /*setTimeout(() => {
            this.gameOver();
        }, this._time);*/
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


/*
    render: function(ctx) {
        for (var c = 0; c < this._levels.length; ++c) {
            var aLevel = this._levels[c];
            for (var i = 0; i < aLevel.length; ++i) {
                aLevel[i].render(ctx);
                //debug.text(".", debugX + i * 10, debugY);

            }
            //debugY += 10;
        }
    }
*/
}

