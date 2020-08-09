import { Layer } from "./layer.js";
import * as utils from "./utils.js";

export class Canvas {
    constructor(elm) {
        this.elm = elm;
        this._layers = [];
    }
    bringForward(layer) {
        for (var i = 0, len = this._layers.length; i < len; i++) {
            if (this._layers[i].ID == layer.ID) {
                this._layers.splice(i, 1);
                this._layers.push(layer);
                return true;
            }
        }
        return false;
    }
    sendBackward(layer) {
        for (var i = 0, len = this._layers.length; i < len; i++) {
            if (this._layers[i].ID == layer.ID) {
                this._layers.splice(i, 1);
                this._layers.unshift(layer);
                return true;
            }
        }
        return false;
    }
    createLayer() {
        let layer = new Layer();
        this._layers.push(layer);
        return layer;
    }
    destroyLayer() {
        for (var i = 0, len = this._layers.length; i < len; i++) {
            if (this._layers[i].ID == layer.ID) {
                this._layers[i].destroy;
                this._layers.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    render(p) {
        for (var i = 0, len = this._layers.length; i < len; i++) {
            this._layers[i].render(p);
        }
    }
}