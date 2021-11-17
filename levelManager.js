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
        levels.level[this._levelID].isFinished = true;
        this._levelID++;

        this.clearLevel();
        this.addTimerToScore();
        setTimeout(() => {
            this.initLevel();
        }, 2000);
        
    },

    initLevel: function () {
        var gameOverDiv = document.getElementById("gameOver");
        gameOverDiv.style.visibility = "hidden";

        g_levelWon = false;
        this.generatePlatforms();
        this.generateBalls();
        this.initTimer();
    },

    resetLevel: function () {
        debugger;
        this._score = 0;
        g_gameOver = false;
        createInitialPlayer();
        this.clearLevel();
        this.initLevel();
    },

    clearLevel: function () {
        entityManager.clearPlatforms();
        entityManager.clearBalls();
    },

    generatePlatforms: function () {
        var levelPlatforms = levels.level[this._levelID].platforms;
        for(var i=0; i< levelPlatforms.length; i++) {
            entityManager.generatePlatform({
                cx: levelPlatforms[i].cx,
                cy: levelPlatforms[i].cy
            })
        }
    },

    generateBalls: function () {
       debugger;
        var currentLevelBalls = levels.level[this._levelID].balls;
        for (var i = 0; i < currentLevelBalls.length; i++) {
            entityManager.generateBall({
                cx: currentLevelBalls[i].cx,
                cy: currentLevelBalls[i].cy,
                color: currentLevelBalls[i].color
            })
        }
    },

    initTimer: function () {
        this._time = levels.level[this._levelID].time;
        this._timeLeft = this._time;
        
        setInterval(() => {
            if (!g_levelWon) this._timeLeft -= 50;
        }, 50);
    },

    addTimerToScore: function () {
        var timerScore = this._timeLeft / 10;
        var scoreInterval = timerScore / 10;

        var interval = setInterval(() => {
            this._score += scoreInterval;
            this._timeLeft -= scoreInterval * 10;
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
        }, 2000);

        /*var timeInterval = 10;
        var timeout = this._timeLeft / timeInterval;
        var scoreInterval = timeout / timeInterval;
        
        var interval = setInterval(() => {
            this._score += scoreInterval;
            this._timeLeft -= scoreInterval*timeInterval;
        }, timeInterval);

        setTimeout(() => {
            clearInterval(interval);
        }, timeout);

        return timeout;*/
    },

    gameOver: function () {
        g_gameOver = true;
    },

    update: function () {
        if (this._timeLeft <= 0 && !g_levelWon) this.gameOver();
    },

    render: function (ctx) {
        ctx.font = "60px VT323"
        ctx.fillText(this._score.toString(), 50, 50);

        var timeFillRatio = this._timeLeft / this._time;
        var timerHeight = 10;
        util.fillBox(ctx, 0, g_canvas.height - timerHeight, timeFillRatio * g_canvas.width, timerHeight, "red");
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

