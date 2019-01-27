/**
 * Canvas texture.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Assets } from '../util/Assets.js';
import { CanvasObject } from './CanvasObject.js';

class CanvasTexture extends CanvasObject {

    constructor(texture, width, height, store) {

        if (typeof height !== 'number') {
            store = height;
            height = width;
        }
        if (typeof width !== 'number') {
            store = width;
            height = 0;
            width = 0;
        }

        super();
        const self = this;
        let mask;

        this.width = width;
        this.height = height;

        initTexture();

        function initTexture() {
            if (typeof texture === 'string') {
                Assets.loadImage(texture).then(image => {
                    self.texture = image;
                    setDimensions();
                });
            } else {
                self.texture = texture;
                setDimensions();
            }
        }

        function setDimensions() {
            if (!self.width && !self.height) {
                self.width = self.texture.width;
                self.height = self.texture.height;
            }
            if (store) {
                const canvas = document.createElement('canvas');
                canvas.width = self.width;
                canvas.height = self.height;
                const context = canvas.getContext('2d');
                context.drawImage(self.texture, 0, 0, canvas.width, canvas.height);
                self.texture = canvas;
            }
            if (self.onload) self.onload();
        }

        this.draw = override => {
            if (this.isMask() && !override) return;
            const context = this.canvas.context;
            if (this.texture) {
                this.startDraw(this.px, this.py, override);
                context.drawImage(this.texture, -this.px, -this.py, this.width, this.height);
                this.endDraw();
            }
            if (mask) {
                context.globalCompositeOperation = 'source-in';
                mask.render(true);
                context.globalCompositeOperation = 'source-over';
            }
        };

        this.mask = object => {
            if (!object) return mask = null;
            mask = object;
            object.masked = this;
        };
    }
}

export { CanvasTexture };
