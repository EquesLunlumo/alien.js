/**
 * Canvas noise.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Interface } from '../util/Interface.js';

class CanvasNoise extends Component {

    constructor(params) {
        super();
        const self = this;
        let object, canvas, context, tile, tilecontext;

        this.enabled = true;

        initParameters();
        createElement();
        if (!params.width && !params.height) addListeners();

        function initParameters() {
            const defaults = {
                monochrome: true,
                tileSize: 250
            };
            params = Object.assign(defaults, params);
        }

        function createElement() {
            canvas = document.createElement('canvas');
            canvas.width = self.width = params.width || window.innerWidth;
            canvas.height = self.height = params.height || window.innerHeight;
            context = canvas.getContext('2d');
            tile = document.createElement('canvas');
            tile.width = params.tileSize;
            tile.height = params.tileSize;
            tilecontext = tile.getContext('2d');

            self.element = canvas;
            object = new Interface(canvas);
            self.object = object;
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
        }

        function resize() {
            if (!self.enabled) return;
            canvas.width = self.width = window.innerWidth;
            canvas.height = self.height = window.innerHeight;
        }

        this.render = () => {
            if (!this.enabled) return;
            const pixels = new ImageData(params.tileSize, params.tileSize);
            for (let i = 0; i < pixels.data.length; i += 4) {
                const rand = 255 * Math.random();
                pixels.data[i] = params.monochrome ? rand : 255 * Math.random();
                pixels.data[i + 1] = params.monochrome ? rand : 255 * Math.random();
                pixels.data[i + 2] = params.monochrome ? rand : 255 * Math.random();
                pixels.data[i + 3] = 255;
            }
            tilecontext.putImageData(pixels, 0, 0);
            const width = canvas.width / params.tileSize + 1,
                height = canvas.height / params.tileSize;
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    context.drawImage(tile, x * params.tileSize - (y % 2 === 0 ? params.tileSize / 2 : 0), y * params.tileSize, params.tileSize, params.tileSize);
                }
            }
        };

        this.size = (width, height) => {
            canvas.width = this.width = width;
            canvas.height = this.height = height;
        };

        this.destroy = () => {
            object.destroy();
            return super.destroy();
        };
    }
}

export { CanvasNoise };
