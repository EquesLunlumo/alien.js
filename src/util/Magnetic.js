/**
 * Magnetic interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Component } from './Component.js';

class Magnetic extends Component {

    constructor(object, params = {}) {
        super();
        const self = this;

        this.enabled = true;

        initParameters();
        addListeners();

        function initParameters() {
            self.object = object;
            self.object.willChange('transform');
            self.threshold = params.threshold || 30;
        }

        function addListeners() {
            window.addEventListener('mousemove', move);
        }

        function move(e) {
            if (!self.enabled) return;
            const bounds = self.object.element.getBoundingClientRect(),
                x = e.clientX - (bounds.left + bounds.width / 2),
                y = e.clientY - (bounds.top + bounds.height / 2),
                distance = Math.sqrt(x * x + y * y);
            if (distance < (bounds.width + bounds.height) / 2 + self.threshold) {
                self.object.tween({ x: x * 0.5, y: y * 0.5, rotation: x * 0.05, skewX: x * 0.125, skewY: 0, scale: 1.1 }, 500, 'easeOutCubic');
                self.hoveredIn = true;
            } else if (self.hoveredIn) {
                self.object.tween({ x: 0, y: 0, rotation: 0, skewX: 0, skewY: 0, scale: 1, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic');
                self.hoveredIn = false;
            }
        }

        this.destroy = () => {
            window.removeEventListener('mousemove', move);
            return super.destroy();
        };
    }
}

export { Magnetic };
