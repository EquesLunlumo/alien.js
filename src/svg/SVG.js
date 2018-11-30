/**
 * SVG interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interface } from '../util/Interface.js';

class SVG extends Interface {

    constructor(type = 'svg') {
        super(null, 'svg', type);
    }

    size(w, h = w) {
        this.attr('width', w);
        this.attr('height', h);
        return this;
    }
}

export { SVG };
