import { Canvas } from "./canvas.js";
import { Layer } from "./layer.js";
import { Sprite } from "./sprite.js";
import { Toolbar } from "./toolbar.js";
import { keys } from "./keys.js";
import { pointer } from "./pointer.js";


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';

    // Create test canvas and toolbar
    let toolbar = new Toolbar(document.getElementById("toolbar"), true);
    let canvas = new Canvas(document.getElementById("canvas"));
    let layer = new Layer();
    let sprite = new Sprite("/img/fireball.png");

    // resizing canvas
    window.addEventListener("resize", function () { canvas.resize() });
    canvas.addLayer(layer);
    layer.addEntity(sprite);

    // keyboard detection
    console.log(keys);
    keys.on('17 82', function(e){
        e.preventDefault();
        console.log('Prevented reload!');
    });
    keys.start();

    // pointer detection
    pointer.on('tap', function(point) {
        console.log('tap', point);
    });
    pointer.on('longPress', function(point) {
        console.log('longPress', point);
    });
    pointer.start(canvas.elm);


    // ************ app loop **************
    var FPS = 0;
    var ticks = 0;
    var lastFPS = 0;
    var fps_div = document.getElementById("fps");

    function loop(delta) {
        requestAnimationFrame(loop);
        var perSec = delta / 1000;

        // DO STUFF
        canvas.render();
        sprite.frame_x = Math.floor(10 * perSec % 6);

        // FPS counter
        var now = Date.now();
        if (now - lastFPS >= 1000) {
            lastFPS = now;
            FPS = ticks;
            ticks = 0;
        }
        ticks++;
        fps_div.innerHTML = FPS;
    }
    requestAnimationFrame(loop);
    // ************************************

    // Global exports
    exports.canvas = canvas;

    Object.defineProperty(exports, '__esModule', { value: true });
})));