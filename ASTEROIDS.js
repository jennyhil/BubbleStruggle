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

    if (twoPlayer) {
        entityManager.generatePlayer({
            cx: 700,
            cy: 570,
            KEY_LEFT: 'J'.charCodeAt(0),
            KEY_RIGHT: 'L'.charCodeAt(0),
            KEY_FIRE: 'K'.charCodeAt(0),
            KEY_JUMP: 'I'.charCodeAt(0),
            sprite: g_sprites.player2
        });
    }

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
var KEY_NEXT_LEVEL = keyCode('N');
var KEY_START = keyCode('S')
var KEY_NEXTLVL = keyCode('N');

var twoPlayer = false;
var gameStarted = false;
var g_levelWon = false;
var g_nextLevel = false;

var BTN_PLAYAGAIN = document.getElementById("playAgainBtn");

function processDiagnostics() {


    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if (eatKey(KEY_HALT)) entityManager.haltPlayer();

    if (eatKey(KEY_RESET)) entityManager.resetPlayer();

    if (eatKey(KEY_0)) entityManager.toggleBalls();
    if (eatKey(KEY_NEXTLVL)) levelManager.nextLevel();

    if (eatKey(KEY_START)) gameStarted = true;
    if(eatKey(KEY_NEXT_LEVEL)) g_nextLevel = true;

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
    
    levelManager.renderStart(ctx);
    if(gameStarted){
        ctx.drawImage(g_images.background, 0, 0);
        var gameOverDiv = document.getElementById("levels");
        gameOverDiv.style.visibility = "hidden";
        if (!g_gameOver) {
            entityManager.render(ctx);
            levelManager.render(ctx);

        } else if (g_levelWon) {
            ctx.font = "60px VT323"
            ctx.fillText("LEVEL COMPLETE", 400, 300);
        } else {
            ctx.font = "60px VT323"
            ctx.fillText("GAME OVER", 400, 300);
            var gameOverDiv = document.getElementById("gameOver");
            gameOverDiv.style.visibility = "visible";
        }
    if (g_renderSpatialDebug) spatialManager.render(ctx);
    }
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
        player: "img/rabbitsharkback.png",
        playerright: "img/rabbitsharkright.png",
        playerleft: "img/rabbitsharkleft.png",
        player2: "img/rabbitfitnessback.png",
        player2right: "img/rabbitfitnessright.png",
        player2left: "img/rabbitfitnessleft.png",
        fireball: "img/fireball.png",
        fireballpwr: "img/fireballpwr.png",
        redball: "img/redball.png",
        ball: "img/bolti.png",
        blueball: "img/blueball.png",
        greenball: "img/greenball.png",
        background: "img/grassy.png",
        background2: "img/background2.png",
        background3: "img/background3.png",
        frontpage: "img/frontpage.png",
        rope : "img/rope.png",
        pair: "img/pair.png",
        fire: "img/fire.png",
        cherry: "img/cherry.png",
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
    g_sprites.redball = new Sprite(g_images.redball);
    g_sprites.blueball = new Sprite(g_images.blueball);
    g_sprites.ball = new Sprite(g_images.ball);
    g_sprites.pair = new Sprite(g_images.pair);
    g_sprites.fire = new Sprite(g_images.fire);
    g_sprites.cherry = new Sprite(g_images.cherry);
    g_sprites.greenball = new Sprite(g_images.greenball);
    g_sprites.playericon = new Sprite(g_images.playericon);
    g_sprites.player2icon = new Sprite(g_images.player2icon);
    g_sprites.frontpage = new Sprite(g_images.frontpage);

    g_sprites.bullet = new Sprite(g_images.fireball);
    g_sprites.bullet.scale = 0.25;
   /* g_sprites.bullet = new Sprite(g_images.rope);
    g_sprites.bullet.scale = 0.25;*/

    entityManager.init();
    createInitialPlayer();
    levelManager.setUpLevels();
    levelManager.initLevel();
    
    BTN_PLAYAGAIN.onclick = resetLevel;
    levelManager._levels.forEach(level => {
        
        level.onclick = clickLevel;
    });

    main.init();
}

function resetLevel() {
    levelManager.resetLevel();
}

function clickLevel(e) {
    var id = parseInt(this.id);
    levelManager.playFinishedLevel(id);
    console.log(id);
    
}

// Kick it off
requestPreloads();