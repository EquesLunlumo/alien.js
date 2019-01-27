/**
 * SVG interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from '../util/Interface.js';

class SVG extends Interface {

    constructor(type = 'svg') {
        super(null, 'svg', type);

        this.start = 0;
        this.offset = 0;
        this.alpha = 0;
    }

    size(width, height = width) {
        this.attr('width', width);
        this.attr('height', height);
        return this;
    }

    line(offset = 0) {
        if (offset) this.offset = offset;
        const length = this.element.getTotalLength();
        let dash = length * this.alpha;
        dash = Math.round(dash * 100) / 100;
        let gap = length - dash;
        gap = Math.round(gap * 100) / 100;
        let dashoffset = -length * (this.start + this.offset);
        dashoffset = Math.round(dashoffset * 100) / 100;
        this.attr('stroke-dasharray', `${dash},${gap}`);
        this.attr('stroke-dashoffset', dashoffset);
        return this;
    }

    get length() {
        return this.alpha;
    }

    set length(alpha) {
        this.alpha = alpha;
        this.line();
    }
}

export { SVG };
