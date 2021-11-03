/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

    // "PRIVATE" DATA

    _balls: [],
    _bullets: [],
    _players: [],

    _bShowBalls: true,

    // "PRIVATE" METHODS

    _generateBalls: function () {
        var i,
            NUM_Balls = 1;

        for (i = 0; i < NUM_Balls; ++i) {
            this.generateBall();
        }
    },

    _findNearestPlayer: function (posX, posY) {
        var closestPlayer = null,
            closestIndex = -1,
            closestSq = 1000 * 1000;

        for (var i = 0; i < this._players .length; ++i) {

            var thisPlayer = this._players [i];
            var PlayerPos = thisPlayer.getPos();
            var distSq = util.wrappedDistSq(
                PlayerPos.posX, PlayerPos.posY,
                posX, posY,
                g_canvas.width, g_canvas.height);

            if (distSq < closestSq) {
                closestPlayer = thisPlayer;
                closestIndex = i;
                closestSq = distSq;
            }
        }
        return {
            thePlayer: closestPlayer,
            theIndex: closestIndex
        };
    },

    _forEachOf: function (aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
            fn.call(aCategory[i]);
        }
    },

    // PUBLIC METHODS

    // A special return value, used by other objects,
    // to request the blessed release of death!
    //
    KILL_ME_NOW: -1,

    // Some things must be deferred until after initial construction
    // i.e. thing which need `this` to be defined.
    //
    deferredSetup: function () {
        this._categories = [this._balls, this._bullets, this._players ];
    },

    init: function () {
        this._generateBalls();
        //this._generatePlayer();
    },

    fireBullet: function (cx, cy, velX, velY, rotation) {
        this._bullets.push(new Bullet({
            cx: cx,
            cy: cy,
            velX: velX,
            velY: velY,

            rotation: rotation
        }));
    },

    generateBall: function (descr) {
        this._balls.push(new Ball(descr));
    },

    generatePlayer: function (descr) {
        this._players .push(new Player(descr));
    },

    killNearestPlayer: function (xPos, yPos) {
        var player = this._findNearestPlayer(xPos, yPos).player;
        if (player) {
            player.kill();
        }
    },

    yoinkNearestPlayer: function (xPos, yPos) {
        var player = this._findNearestPlayer(xPos, yPos).player;
        if (player) {
            player.setPos(xPos, yPos);
        }
    },

    resetPlayers: function () {
        this._forEachOf(this._players , Player.prototype.reset);
    },

    haltPlayers: function () {
        this._forEachOf(this._players , Player.prototype.halt);
    },

    toggleBalls: function () {
        this._bShowBalls = !this._bShowBalls;
    },

    update: function (du) {
        
        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];
            var i = 0;

            while (i < aCategory.length) {

                var status = aCategory[i].update(du);

                if (status === this.KILL_ME_NOW) {
                    // remove the dead guy, and shuffle the others down to
                    // prevent a confusing gap from appearing in the array
                    aCategory.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
        }

        if (this._balls.length === 0) this._generateBalls();

    },

    render: function (ctx) {

        var debugX = 10, debugY = 100;

        for (var c = 0; c < this._categories.length; ++c) {

            var aCategory = this._categories[c];

            if (!this._bShowBalls &&
                aCategory == this._balls)
                continue;

            for (var i = 0; i < aCategory.length; ++i) {

                aCategory[i].render(ctx);
                //debug.text(".", debugX + i * 10, debugY);

            }
            debugY += 10;
        }
    }

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
