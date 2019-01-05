/**
 * Canvas graphics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils.js';
import { CanvasObject } from './CanvasObject.js';

class CanvasGraphics extends CanvasObject {

    constructor(width = 0, height = width) {
        super();
        const self = this;
        let draw = [],
            mask;

        this.width = width;
        this.height = height;
        this.props = {};

        function setProperties(context) {
            for (let key in self.props) context[key] = self.props[key];
        }

        this.draw = override => {
            if (this.isMask() && !override) return false;
            const context = this.canvas.context;
            this.startDraw(this.px, this.py, override);
            setProperties(context);
            if (this.clipWidth && this.clipHeight) {
                context.beginPath();
                context.rect(this.clipX, this.clipY, this.clipWidth, this.clipHeight);
                context.clip();
            }
            for (let i = 0; i < draw.length; i++) {
                const cmd = draw[i];
                if (!cmd) continue;
                const fn = cmd.shift();
                context[fn].apply(context, cmd);
                cmd.unshift(fn);
            }
            this.endDraw();
            if (mask) {
                context.globalCompositeOperation = mask.blendMode;
                mask.render(true);
            }
        };

        this.clear = () => {
            for (let i = draw.length - 1; i >= 0; i--) draw[i].length = 0;
            draw.length = 0;
        };

        this.arc = (x = 0, y = 0, radius = this.radius || this.width / 2, startAngle = 0, endAngle = Math.PI * 2, anti = false) => {
            if (x && !y) {
                startAngle = Math.radians(-90),
                endAngle = x;
                x = 0;
                y = 0;
            }
            draw.push(['arc', x, y, radius, startAngle, endAngle, anti]);
        };

        this.quadraticCurveTo = (cpx, cpy, x, y) => {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        this.bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        this.fillRect = (x, y, width, height) => {
            draw.push(['fillRect', x, y, width, height]);
        };

        this.clearRect = (x, y, width, height) => {
            draw.push(['clearRect', x, y, width, height]);
        };

        this.strokeRect = (x, y, width, height) => {
            draw.push(['strokeRect', x, y, width, height]);
        };

        this.moveTo = (x, y) => {
            draw.push(['moveTo', x, y]);
        };

        this.lineTo = (x, y) => {
            draw.push(['lineTo', x, y]);
        };

        this.stroke = () => {
            draw.push(['stroke']);
        };

        this.fill = () => {
            if (!mask) draw.push(['fill']);
        };

        this.beginPath = () => {
            draw.push(['beginPath']);
        };

        this.closePath = () => {
            draw.push(['closePath']);
        };

        this.fillText = (text, x = 0, y = 0) => {
            draw.push(['fillText', text, x, y]);
        };

        this.strokeText = (text, x = 0, y = 0) => {
            draw.push(['strokeText', text, x, y]);
        };

        this.setLineDash = value => {
            draw.push(['setLineDash', value]);
        };

        this.drawImage = (img, sx = 0, sy = 0, sWidth = img.width, sHeight = img.height, dx = 0, dy = 0, dWidth = img.width, dHeight = img.height) => {
            draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx + -this.px, dy + -this.py, dWidth, dHeight]);
        };

        this.mask = object => {
            if (!object) return mask = null;
            mask = object;
            object.masked = this;
            for (let i = 0; i < draw.length; i++) {
                if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                    draw[i].length = 0;
                    draw.splice(i, 1);
                }
            }
        };

        this.clone = () => {
            const object = new CanvasGraphics(this.width, this.height);
            object.visible = this.visible;
            object.blendMode = this.blendMode;
            object.opacity = this.opacity;
            object.follow(this);
            object.props = Utils.cloneObject(this.props);
            object.setDraw(Utils.cloneArray(draw));
            return object;
        };

        this.setDraw = array => {
            draw = array;
        };
    }

    set strokeStyle(v) {
        this.props.strokeStyle = v;
    }

    get strokeStyle() {
        return this.props.strokeStyle;
    }

    set fillStyle(v) {
        this.props.fillStyle = v;
    }

    get fillStyle() {
        return this.props.fillStyle;
    }

    set lineWidth(v) {
        this.props.lineWidth = v;
    }

    get lineWidth() {
        return this.props.lineWidth;
    }

    set lineCap(v) {
        this.props.lineCap = v;
    }

    get lineCap() {
        return this.props.lineCap;
    }

    set lineDashOffset(v) {
        this.props.lineDashOffset = v;
    }

    get lineDashOffset() {
        return this.props.lineDashOffset;
    }

    set lineJoin(v) {
        this.props.lineJoin = v;
    }

    get lineJoin() {
        return this.props.lineJoin;
    }

    set miterLimit(v) {
        this.props.miterLimit = v;
    }

    get miterLimit() {
        return this.props.miterLimit;
    }

    set font(v) {
        this.props.font = v;
    }

    get font() {
        return this.props.font;
    }

    set textAlign(v) {
        this.props.textAlign = v;
    }

    get textAlign() {
        return this.props.textAlign;
    }

    set textBaseline(v) {
        this.props.textBaseline = v;
    }

    get textBaseline() {
        return this.props.textBaseline;
    }
}

export { CanvasGraphics };
