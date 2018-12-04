/**
 * Magnetic interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Component } from '../util/Component.js';

class Magnetic extends Component {

    constructor(object, params = {}) {
        super();
        const self = this;
        let bounds, distance;

        this.x = 0;
        this.y = 0;
        this.enabled = true;

        initParameters();
        addListeners();

        function initParameters() {
            self.object = object;
            self.threshold = params.threshold || 30;
            self.object.size().willChange('transform');
        }

        function addListeners() {
            window.addEventListener('mousemove', move);
        }

        function move(e) {
            if (!self.enabled) return;
            bounds = self.object.element.getBoundingClientRect();
            self.x = e.clientX - (bounds.left + self.object.width / 2);
            self.y = e.clientY - (bounds.top + self.object.height / 2);
            distance = Math.sqrt(self.x * self.x + self.y * self.y);
            self.isHover = distance < (self.object.width + self.object.height) / 2 + self.threshold;
            if (self.isHover) {
                self.object.tween({ x: self.x * 0.5, y: self.y * 0.5, rotation: self.x * 0.05, skewX: self.x * 0.125, skewY: 0, scale: 1.1 }, 500, 'easeOutCubic');
                self.animatedIn = true;
            } else if (self.animatedIn && !self.isHover) {
                self.object.tween({ x: 0, y: 0, rotation: 0, skewX: 0, skewY: 0, scale: 1, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic');
                self.animatedIn = false;
            }
        }

        this.destroy = () => {
            window.removeEventListener('mousemove', move);
            return super.destroy();
        };
    }
}

export { Magnetic };
