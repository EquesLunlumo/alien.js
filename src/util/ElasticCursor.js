/**
 * Elastic cursor.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Component } from './Component.js';

class ElasticCursor extends Component {

    constructor(object, params = {}) {
        super();
        const self = this;

        this.enabled = true;

        initParameters();
        addListeners();

        function initParameters() {
            self.object = object;
            self.object.css({ opacity: 0 });
            self.outer = object.outer;
            self.outer.size();
            self.inner = object.inner;
            self.inner.size();
            self.scale = params.scale || 1.4;
        }

        function addListeners() {
            window.addEventListener('mousemove', move);
        }

        function move(e) {
            if (!self.enabled) return;
            self.outer.tween({ x: e.clientX - self.outer.width / 2, y: e.clientY - self.outer.height / 2 }, 1000, 'easeOutExpo');
            self.inner.css({ x: e.clientX - self.inner.width / 2, y: e.clientY - self.inner.height / 2 });
            if (e.target.tagName.toLowerCase() === 'a' || e.target.className === 'hit' || self.isHover) {
                if (!self.hoveredIn) {
                    self.hoverIn();
                }
            } else if (self.hoveredIn) {
                self.hoverOut();
            }
            if (!self.animatedIn) {
                self.animatedIn = true;
                self.object.tween({ opacity: 1 }, 1600, 'easeInOutSine', () => {
                    self.object.clearOpacity();
                });
            }
        }

        this.hoverIn = () => {
            this.outer.tween({ scale: this.scale, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic');
            this.hoveredIn = true;
        };

        this.hoverOut = () => {
            this.outer.tween({ scale: 1 }, 750, 'easeOutExpo');
            this.hoveredIn = false;
        };

        this.destroy = () => {
            window.removeEventListener('mousemove', move);
            return super.destroy();
        };
    }
}

export { ElasticCursor };
