/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

    // "PRIVATE" DATA

    _nextSpatialID: 1, // make all valid IDs non-falsey (i.e. don't start at 0)

    _entities: [],

    // "PRIVATE" METHODS
    //
    // <none yet>


    // PUBLIC METHODS

    getNewSpatialID: function () {

        // TODO: YOUR STUFF HERE!
        return this._nextSpatialID++;

    },

    register: function (entity) {
        var pos = entity.getPos();
        var spatialID = entity.getSpatialID();
        // Save position
        entity.posX = pos.posX;
        entity.posY = pos.posY;
        entity.radius = entity.getRadius();
        
        

        // TODO: YOUR STUFF HERE! 
        this._entities[spatialID] = entity
    },

    unregister: function (entity) {
        var spatialID = entity.getSpatialID();

        // TODO: YOUR STUFF HERE! 
       delete this._entities[spatialID];
    
    },
    findEntityInRange: function (posX, posY, radius) {
       
        // TODO: YOUR STUFF HERE! 
        var entityInRange = null;
        for (var ID in this._entities) {
            var e = this._entities[ID];
            if(e.name != "platform") {
                var distSq = util.wrappedDistSq(
                e.posX, e.posY, 
                posX, posY, 
                g_canvas.width, g_canvas.height);

                if (distSq < util.square(radius + e.radius) && 
                (posX!=e.posX && posY !=e.posY) ) {
                    entityInRange = e;
            }
            } else {
                if(e.collidesWith(posX,posY,radius,radius*2)) entityInRange = e;
            }

        }
        return entityInRange;
    },

    
    render: function (ctx) {
        var oldStyle = ctx.strokeStyle;
        ctx.strokeStyle = "red";

        for (var ID in this._entities) {
            var e = this._entities[ID];
            if(e.name != "platform") {
                util.strokeCircle(ctx, e.posX, e.posY, e.radius);
            } else {
                
                ctx.strokeRect(e.posX,e.posY,e.width, e.height);
            }
            
        }
        ctx.strokeStyle = oldStyle;
    }

}