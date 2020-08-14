/**
 * TODO: create a new repository in Github for a standalone
 * interaction model.
 */
let me = {
    selected: [],
    pointer: {},
    downKeys: {},
    start: function (canvas) {
        me.canvas = canvas;
        me.selected = [];
        canvas.elm.addEventListener('touchstart', startHandler, { passive: false });
        canvas.elm.addEventListener('mousedown', startHandler, { passive: false });
        window.addEventListener('keydown', keydownHandler, { passive: false });
        window.addEventListener('keyup', keyupHandler);
        window.addEventListener('wheel', wheelHandler);
        window.addEventListener('blur', blurHandler);
    },
    stop: function () {
        me.selected = [];
        canvas.elm.removeEventListener('touchstart', startHandler);
        canvas.elm.removeEventListener('mousedown', startHandler);
        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keyup', keyupHandler);
        window.removeEventListener('wheel', wheelHandler);
        window.removeEventListener('blur', blurHandler);
    }
};

let _longPressDelay = 200; // delay (ms) before long press
let _start = 0; // touch down start time
let _moving = false;
let _selectbox = false;
let _onItem = false;
// https://keycode.info/
let _keys = {
    Shift: 16,
    Control: 17,
    Alt: 18,
    Meta: 91,
    Escape: 27,
    Space: 32,
    A: 65,
    R: 82,
    S: 83,
    F5: 116,
    Right: 39,
    Left: 37,
    Up: 38,
    Down: 40,
    PageDown: 34,
    PageUp: 33,
};

function blurHandler(e) {
    me.downKeys = {};
}


let zoomIntensity = 0.1;
let originx = 0;
let originy = 0;
let scale = 1;
function wheelHandler(event) {

    //event.preventDefault();
    // Get mouse offset.
    let mousex = event.clientX - me.canvas.elm.offsetLeft;
    let mousey = event.clientY - me.canvas.elm.offsetTop;
    // Normalize wheel to +1 or -1.
    let wheel = event.deltaY < 0 ? 1 : -1;

    // Compute zoom factor.
    let zoom = Math.exp(wheel*zoomIntensity);
    
    // Translate so the visible origin is at the context's origin.
    me.canvas.ctx.translate(originx, originy);
  
    // Compute the new visible origin. Original ly the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    originx -= mousex/(scale*zoom) - mousex/scale;
    originy -= mousey/(scale*zoom) - mousey/scale;
    
    // Scale it (centered around the origin due to the trasnslate above).
    me.canvas.ctx.scale(zoom, zoom);
    // Offset the visible origin to it's proper position.
    me.canvas.ctx.translate(-originx, -originy);

    // Update scale and others.
    scale *= zoom;
    //visibleWidth = width / scale;
    //visibleHeight = height / scale;
}

function keydownHandler(e) {
    // include to prevent key events while composing text
    if (e.isComposing || e.keyCode === 229) { return; }

    // add key code to downKeys[]
    me.downKeys[e.keyCode] = true;

    // Ctrl + A
    if (e.keyCode == _keys.A && me.downKeys[_keys.Control]) {
        console.log("Ctrl + A");
    }

    // Ctrl + S
    else if (e.keyCode == _keys.S && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        console.log("Interupted page save");
        e.preventDefault();
    }

    // F5 or Ctrl + R
    else if (e.keyCode == _keys.F5 ||
        (e.keyCode == _keys.R && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))) {
        console.log("Interupted page reload");
        e.preventDefault();
    }

    // Space
    else if (e.keyCode == _keys.Space) { }

    // Right
    else if (e.keyCode == _keys.Right) {
        me.canvas.ctx.translate(-10,0);
    }

    // Left
    else if (e.keyCode == _keys.Left) {
        me.canvas.ctx.translate(10,0);
    }

    // Up
    else if (e.keyCode == _keys.Up) {
        me.canvas.ctx.translate(0,10);
    }

    // Down
    else if (e.keyCode == _keys.Down) {
        me.canvas.ctx.translate(0,-10);
    }

    // PageUp                         
    else if (e.keyCode == _keys.PageUp) { }

    // PageDown
    else if (e.keyCode == _keys.PageDown) { }
}

function keyupHandler(e) { me.downKeys[e.keyCode] = false; /* Do something */ }

// PRIVATE FUNCTIONS
function startHandler(e) {
    if (e.which === 3) return; // prevent right click dragging

    _start = Date.now();
    _moving = false;
    _selectbox = false;
    _onItem = false;

    if (e.type === 'mousedown') {
        window.addEventListener('mousemove', moveHandler, { passive: false });
        window.addEventListener('mouseup', endHandler);
        me.pointer = { x: e.clientX, y: e.clientY };
    } else {
        window.addEventListener('touchmove', moveHandler, { passive: false });
        window.addEventListener('touchend', endHandler);
        window.addEventListener('touchcancel', endHandler);
        me.pointer = copyTouch(e.targetTouches[0]);
    }
    e.preventDefault();
    e.stopPropagation();

    // ***** if pointer is on a selected object *****
    // this._onItem = true
}

function moveHandler(e) {
    if (e.type == 'mousemove') {
        me.pointer = { x: e.clientX, y: e.clientY };
        if (_onItem) {
            // ***** dragging items *****
            // move items
            console.log("moving item");
        } else if (_selectbox || (!_moving && (me.downKeys[_keys.Shift] || me.downKeys[_keys.Control]))) {
            _selectbox = true;
            // ***** shift(ctrl) + drag start *****
            // TODO: draw selectbox
            // - save canvas
            // - reset transforms
            // - draw select box
            // - restore canvas


            console.log("drawing selectbox");
        } else {
            // ***** drag start *****
            // pan
            console.log("panning");
        }
    } else {
        me.pointer = copyTouch(e.targetTouches[0]);
        e.preventDefault();
        e.stopPropagation();
        /////////////////////////
        //handle touch drag
        /////////////////////////
    }
    _moving = true;
}

function endHandler(e) {
    if (e.type === 'mouseup') {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', endHandler);
        if (_selectbox) {
            // ***** shift(ctrl) + drag release *****
            // add items in selectbox to selected
            console.log("selecting items in selectbox");
        } else if (!_moving) {
            if (!(me.downKeys[_keys.Shift] || me.downKeys[_keys.Control])) {
                // ***** click *****
                me.selected = [];
                //console.log("clearing selected");

            }
            // ***** click or shift(ctrl) + click *****
            // add item to selected
            //console.log("checking to add item to selected");
            // check intersection
        }
    } else if (e.targetTouches.length == 0 || e.targetTouches[0].identifier != me.pointer.identifier) {
        window.removeEventListener('touchmove', moveHandler);
        window.removeEventListener('touchend', endHandler);
        window.removeEventListener('touchcancel', endHandler);
        /////////////////////////
        //handle touch end
        /////////////////////////
    }
}

/**
 * TODO: interactions
 * Panning
 * Selection
 */

function copyTouch(touch) {
    return {
        identifier: touch.identifier,
        x: touch.clientX,
        y: touch.clientY
    };
}

// TODO:
// - draw select box on a UI layer
let starting_x = 0,
    starting_y = 0;
function drawSelectBox(x,y) {

};

/**
 * Returns the position of x and y relative to the canvas
 */
function getCanvasPos(x,y) {
    let rect = me.canvas.elm.getBoundingClientRect();
    return {
      x: x - rect.left,
      y: y - rect.top
    };
}

/**
 * CONSTANTS
 * - tap_delay
 * 
 * ACTIONS
 * Add to selected TRIVIAL
 * draw select box (ax,ay,bx,by)
 * copy
 * paste
 * select all 
 * save
 * open search
 * clear selection TRIVIAL
 * pan(dx,dy)
 * zoom(amount)
*/

export { me as interact };