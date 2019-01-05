/**
 * Canvas texture.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Assets } from '../util/Assets.js';
import { CanvasObject } from './CanvasObject.js';

class CanvasTexture extends CanvasObject {

    constructor(texture, width = 0, height = width) {
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
            if (self.onload) self.onload();
            if (!self.width && !self.height) {
                self.width = self.texture.width;
                self.height = self.texture.height;
            }
        }

        this.draw = override => {
            if (this.isMask() && !override) return false;
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
