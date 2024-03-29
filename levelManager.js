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
        //debugger;
        g_levelWon = true;
        levels.level[this._levelID].isFinished = true;
        this._levelID++;
        this.addTimerToScore();
        this.clearLevel();

        if (levels.level[this._levelID]) {
            setTimeout(() => {
                if (levelManager._levelID == 0 && entityManager._balls.length < 1) this.initLevel();
                else if (levelManager._levelID != 0) this.initLevel();
            }, 2000);
        }
        else {
            this.gameWon();
        }



    },

    initLevel: function () {
        //debugger;
        var gameOverDiv = document.getElementById("gameOver");
        gameOverDiv.style.visibility = "hidden";

        g_levelWon = false;
        this.generatePlatforms();
        this.generateBalls();

        this.initTimer();
    },

    resetLevel: function () {

        this._score = 0;
        g_gameOver = false;
        g_sprites.bullet = new Sprite(g_images.fireball);
        g_sprites.bullet.scale = 0.25;
        if (entityManager._players.length == 0) createInitialPlayer();
        this.clearLevel();
        gameStarted = true;
        this.initLevel();


    },

    clearLevel: function () {
        entityManager.clearPlatforms();
        entityManager.clearBalls();
    },

    playFinishedLevel: function (id) {
        //debugger;
        this._levelID = id;
        resetLevel();
    },

    generatePlatforms: function () {
        var levelPlatforms = levels.level[this._levelID].platforms;
        for (var i = 0; i < levelPlatforms.length; i++) {
            entityManager.generatePlatform({
                cx: levelPlatforms[i].cx,
                cy: levelPlatforms[i].cy
            })
        }
    },

    generateBalls: function () {
        var currentLevelBalls = levels.level[this._levelID].balls;
        var ballScale = 2;
        for (var i = 0; i < currentLevelBalls.length; i++) {
            if (currentLevelBalls[i].scale) ballScale = currentLevelBalls[i].scale;
            entityManager.generateBall({
                cx: currentLevelBalls[i].cx,
                cy: currentLevelBalls[i].cy,
                color: currentLevelBalls[i].color,
                scale: ballScale
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

    setUpLevels: function () {
        var allLevels = levels.level;
        var levelDiv = document.getElementById("levels");
        for (let i = 0; i < allLevels.length; i++) {
            var level = document.createElement('button');
            level.id = i;
            level.innerHTML = i + 1;
            level.disabled = !allLevels[i].isFinished;
            level.onclick = this.clickLevel;
            levelDiv.appendChild(level);

            this._levels[i] = level;

        }

    },

    updateLevels: function () {
        var allLevels = levels.level;
        var levelDiv = document.getElementById("levels");
        //debugger;
        for (let i = 0; i < allLevels.length; i++) {
            var level = levelDiv.children[i];
            level.disabled = !allLevels[i].isFinished;
        }
    },

    gameOver: function () {
        g_gameOver = true;
    },

    gameWon: function () {
        console.log("game won");
        g_gameWon = true;
    },

    update: function () {
        if (this._timeLeft <= 0 && !g_levelWon) this.gameOver();
    },

    render: function (ctx) {
        g_sprites.background[this._levelID].drawCentredAt(
            ctx, ctx.canvas.width / 2, ctx.canvas.height / 20);
        ctx.font = "60px VT323"
        ctx.fillText(this._score.toString(), 50, 50);

        var timeFillRatio = this._timeLeft / this._time;
        var timerHeight = 10;
        util.fillBox(ctx, 0, g_canvas.height - timerHeight, timeFillRatio * g_canvas.width, timerHeight, "red");

        if (g_levelWon) {

            if (g_gameWon) {
                ctx.font = "60px VT323"
                ctx.fillText("YOU WON!", 350, 300);
                var gameOverDiv = document.getElementById("gameOver");
                gameOverDiv.style.visibility = "visible";
            } else {
                ctx.font = "60px VT323"
                ctx.fillText("LEVEL COMPLETE", 350, 300);
            }
        }
    },

    renderStart: function (ctx) {
        g_sprites.frontpage = new Sprite(g_images.frontpage);
        // Render player 1
        g_sprites.frontpage.drawCentredAt(
            ctx, ctx.canvas.width / 2, ctx.canvas.height / 20);
    }

}

