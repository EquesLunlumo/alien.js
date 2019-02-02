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
            if (this.isMask() && !override) return;
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

        this.arc = (x, y, radius, startAngle, endAngle, anticlockwise) => {
            if (typeof y !== 'number') {
                anticlockwise = false;
                endAngle = x;
                startAngle = Math.radians(-90);
                radius = this.radius || this.width / 2;
                y = 0;
                x = 0;
            }
            draw.push(['arc', x, y, radius, startAngle, endAngle, anticlockwise]);
        };

        this.arcTo = (x1, y1, x2, y2, radius) => {
            draw.push(['arcTo', x1, y1, x2, y2, radius]);
        };

        this.beginPath = () => {
            draw.push(['beginPath']);
        };

        this.bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        this.clearRect = (x, y, width, height) => {
            draw.push(['clearRect', x, y, width, height]);
        };

        this.closePath = () => {
            draw.push(['closePath']);
        };

        this.drawImage = (image, sx = 0, sy = 0, sWidth = image.width, sHeight = image.height, dx = 0, dy = 0, dWidth = image.width, dHeight = image.height) => {
            draw.push(['drawImage', image, sx, sy, sWidth, sHeight, dx + -this.px, dy + -this.py, dWidth, dHeight]);
        };

        this.ellipse = (x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) => {
            draw.push(['ellipse', x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise]);
        };

        this.fill = () => {
            if (!mask) draw.push(['fill']);
        };

        this.fillRect = (x, y, width, height) => {
            draw.push(['fillRect', x, y, width, height]);
        };

        this.fillText = (text, x, y, maxWidth) => {
            draw.push(['fillText', text, x, y, maxWidth]);
        };

        this.lineTo = (x, y) => {
            draw.push(['lineTo', x, y]);
        };

        this.moveTo = (x, y) => {
            draw.push(['moveTo', x, y]);
        };

        this.quadraticCurveTo = (cpx, cpy, x, y) => {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        this.rect = (x, y, width, height) => {
            draw.push(['rect', x, y, width, height]);
        };

        this.restore = () => {
            draw.push(['restore']);
        };

        this.save = () => {
            draw.push(['save']);
        };

        this.setLineDash = segments => {
            draw.push(['setLineDash', segments]);
        };

        this.stroke = () => {
            if (!mask) draw.push(['stroke']);
        };

        this.strokeRect = (x, y, width, height) => {
            draw.push(['strokeRect', x, y, width, height]);
        };

        this.strokeText = (text, x, y, maxWidth) => {
            draw.push(['strokeText', text, x, y, maxWidth]);
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

    get fillStyle() {
        return this.props.fillStyle;
    }

    set fillStyle(v) {
        this.props.fillStyle = v;
    }

    get font() {
        return this.props.font;
    }

    set font(v) {
        this.props.font = v;
    }

    get lineCap() {
        return this.props.lineCap;
    }

    set lineCap(v) {
        this.props.lineCap = v;
    }

    get lineDashOffset() {
        return this.props.lineDashOffset;
    }

    set lineDashOffset(v) {
        this.props.lineDashOffset = v;
    }

    get lineJoin() {
        return this.props.lineJoin;
    }

    set lineJoin(v) {
        this.props.lineJoin = v;
    }

    get lineWidth() {
        return this.props.lineWidth;
    }

    set lineWidth(v) {
        this.props.lineWidth = v;
    }

    get miterLimit() {
        return this.props.miterLimit;
    }

    set miterLimit(v) {
        this.props.miterLimit = v;
    }

    get shadowBlur() {
        return this.props.shadowBlur;
    }

    set shadowBlur(v) {
        this.props.shadowBlur = v;
    }

    get shadowColor() {
        return this.props.shadowColor;
    }

    set shadowColor(v) {
        this.props.shadowColor = v;
    }

    get shadowOffsetX() {
        return this.props.shadowOffsetX;
    }

    set shadowOffsetX(v) {
        this.props.shadowOffsetX = v;
    }

    get shadowOffsetY() {
        return this.props.shadowOffsetY;
    }

    set shadowOffsetY(v) {
        this.props.shadowOffsetY = v;
    }

    get strokeStyle() {
        return this.props.strokeStyle;
    }

    set strokeStyle(v) {
        this.props.strokeStyle = v;
    }

    get textAlign() {
        return this.props.textAlign;
    }

    set textAlign(v) {
        this.props.textAlign = v;
    }

    get textBaseline() {
        return this.props.textBaseline;
    }

    set textBaseline(v) {
        this.props.textBaseline = v;
    }
}

export { CanvasGraphics };
