/*

levelManager that handles different levels - 
handles different platforms, number of balls etc.

*/
"use strict";

var levelManager = {


    _levels: [],
    

    initLevel : function() {
        this.generatePlatform();
    },

    generatePlatform: function() {
        
        },
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
}

