import { Canvas } from "./canvas.js";
import { Sprite } from "./sprite.js";

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.gg = {}));
}(this, (function (exports) {
    'use strict';

    // using for debug ****************************
    let canvas = new Canvas(document.getElementById("canvas"));
    window.addEventListener("resize", function() {canvas.render()});

    let sprite = new Sprite("test.png");
    MutationEvent= 0;
    var lastFPS = 0;
    var fps_div = document.getElementById("fps");

    function loop(delta) {
        requestAnimationFrame(loop);
        var perSec = delta / 1000;


        // DO STUFF


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

    exports.canvas = canvas;
    // **********************************************

    function load(URL) { };
    function save() { };

    exports.load = load;
    exports.save = save;

    Object.defineProperty(exports, '__esModule', { value: true });
})));