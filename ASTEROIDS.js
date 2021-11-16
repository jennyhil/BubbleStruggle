// =========
// ASTEROIDS
// =========
/*
A sort-of-playable version of the classic arcade game.
HOMEWORK INSTRUCTIONS:
You have some "TODO"s to fill in again, particularly in:
spatialManager.js
But also, to a lesser extent, in:
Rock.js
Bullet.js
Player.js
...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Player to register (and unregister)
with it correctly, so that they can participate in collisions.
Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");




/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL Player
// ====================

function createInitialPlayer() {

    entityManager.generatePlayer({
        cx: g_canvas.width / 2,
        cy: g_canvas.height - 30

    });

}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();
    entityManager.update(du);
    levelManager.update(); // checks if time is finished

    // Prevent perpetual firing!
    eatKey(Player.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;
var g_bulletType = 1;
var g_gameOver = false;
var KEY_MIXED = keyCode('M');;
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_TWO_PLAYER = keyCode('T');
//var KEY_K = keyCode('K');
var twoPlayer = false;

function processDiagnostics() {


    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltPlayer();

    if (eatKey(KEY_RESET)) entityManager.resetPlayer();

    if (eatKey(KEY_0)) entityManager.toggleBalls();

    /*if (eatKey(KEY_2)) entityManager.generatePlayer({
        cx: g_mouseX,
        cy: g_mouseY,
        sprite: g_sprites.player2
    });*/
    if (eatKey(KEY_TWO_PLAYER) && !twoPlayer) {
        entityManager.generatePlayer({
            cx: 700,
            cy: 570,
            KEY_LEFT: 'J'.charCodeAt(0),
            KEY_RIGHT: 'L'.charCodeAt(0),
            KEY_FIRE: 'K'.charCodeAt(0),
            KEY_JUMP: 'I'.charCodeAt(0),
            sprite: g_sprites.player2
        });
        twoPlayer = true;
    }


    /*if (eatKey(KEY_K)) entityManager.killNearestPlayer(
        g_mouseX, g_mouseY);*/
}

// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING


function renderSimulation(ctx) {
    ctx.drawImage(g_images.background,0,0);
    if(!g_gameOver){
        entityManager.render(ctx);
       var timeFillRatio = levelManager._timeLeft / levelManager._time;
       util.fillBox(ctx, 0, g_canvas.height - 20, timeFillRatio * g_canvas.width, 20, "white");
        }else {
            ctx.font ="60px VT323"
            ctx.fillText("GAME OVER",400,300);
        }
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    // Ath. eigum vi� a� s�kja myndir af netinu e�a hafa ��r inn� ehv folder..
    var requiredImages = {
        //player:"ship.png",
        //player2:"ship.png",
        player: "https://notendur.hi.is/sbm11/assets/rabbidssharkback100.png",
        playerright: "https://notendur.hi.is/sbm11/assets/hakarlhlid100.png",
        playerleft: "https://notendur.hi.is/sbm11/assets/hakarlhlidvinstri100.png",
        player2: "https://notendur.hi.is/sbm11/assets/rabbidfitnesback100.png",
        player2right: "https://notendur.hi.is/sbm11/assets/rabbidfitnesside100.png",
        player2left: "https://notendur.hi.is/sbm11/assets/rabbidfitnessidevinstri.png",
        fireball: "img/fireball.png",
        fireballpwr: "img/fireballpwr.png",
        ball: "img/bolti.png",
        background: "img/grassy.png",
        rope : "img/rope.png",
        umbrella : "img/umbrella.png",
        klukka : "img/klukka.png",
        platform1 : "img/platform1.png",
        playericon : "img/sharklitillhaus.png",
        player2icon : "img/sportylitillhaus.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.player = new Sprite(g_images.player);
    g_sprites.player2 = new Sprite(g_images.player2);
    g_sprites.ball = new Sprite(g_images.ball);
    g_sprites.playericon = new Sprite(g_images.playericon);
    g_sprites.player2icon = new Sprite(g_images.player2icon);

    g_sprites.bullet = new Sprite(g_images.fireball);
    g_sprites.bullet.scale = 0.25;
    g_sprites.bullet = new Sprite(g_images.rope);
    g_sprites.bullet.scale = 0.25;

    entityManager.init();
    createInitialPlayer();
    levelManager.initLevel();
    main.init();
}

// Kick it off
requestPreloads();