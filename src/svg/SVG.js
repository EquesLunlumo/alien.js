/**
 * SVG interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from '../util/Interface.js';

class SVG extends Interface {

    constructor(name = '.svg', type = 'svg') {
        super(name, 'svg', type);

        this.x = 0;
        this.y = 0;
        this.px = 0;
        this.py = 0;
        this.width = 0;
        this.height = 0;
    }

    size(w, h = w) {
        this.width = w;
        this.height = h;
        this.element.setAttribute('width', w);
        this.element.setAttribute('height', h);
        return this;
    }

    transform(props) {
        for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        let transforms = '';
        if (this.x || this.y) transforms += 'translate(' + (this.x + this.px) + ' ' + (this.y + this.py) + ')';
        if (typeof this.scale !== 'undefined') {
            transforms += 'scale(' + this.scale + ')';
        } else if (typeof this.scaleX !== 'undefined' || typeof this.scaleY !== 'undefined') {
            const scaleX = this.scaleX || 1,
                scaleY = this.scaleY || 1;
            let scale = '';
            scale += scaleX + ' ';
            scale += scaleY;
            transforms += 'scale(' + scale + ')';
        }
        if (typeof this.rotation !== 'undefined') transforms += 'rotate(' + this.rotation + ')';
        if (this.x || this.y) transforms += 'translate(-' + (this.x + this.px) + ' -' + (this.y + this.py) + ')';
        this.element.setAttribute('transform', transforms);
        return this;
    }

    transformPoint(x, y) {
        this.px = typeof x === 'number' ? x : this.width * (parseFloat(x) / 100);
        this.py = typeof y === 'number' ? y : this.height * (parseFloat(y) / 100);
        return this;
    }

    attr(props, value) {
        if (typeof props !== 'object') {
            this[props] = value;
            return super.attr(props, value);
        }
        for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        return super.attr(props, value);
    }
}

export { SVG };
