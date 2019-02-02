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

        this.currentX = 0;
        this.currentY = 0;
        this.posX = 0;
        this.posY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.ease = 0.15;
        this.threshold = 10;
        this.vx = 0;
        this.vy = 0;
        this.theta = 0;
        this.velocity = 0;
        this.scale = 1;
        this.enabled = true;

        initParameters();
        addListeners();
        this.startRender(loop);

        function initParameters() {
            self.object = object;
            self.object.css({ opacity: 0 });
            self.outer = object.outer;
            self.outer.size();
            self.inner = object.inner;
            self.inner.size();
        }

        function addListeners() {
            window.addEventListener('mousemove', move);
        }

        function move(e) {
            if (!self.enabled) return;
            self.posX = e.clientX;
            self.posY = e.clientY;
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

        function loop() {
            if (!self.enabled) return;
            self.currentX += (self.posX - self.currentX) * self.ease;
            self.currentY += (self.posY - self.currentY) * self.ease;
            self.deltaX = self.currentX - self.lastX;
            self.deltaY = self.currentY - self.lastY;
            self.lastX = self.currentX;
            self.lastY = self.currentY;
            self.vx = Math.clamp(Math.abs(self.deltaX) / self.threshold, 0, 1);
            self.vy = Math.clamp(Math.abs(self.deltaY) / self.threshold, 0, 1);
            self.theta = Math.degrees(Math.atan2(self.deltaY, self.deltaX));
            self.velocity = (self.vx + self.vy) * 0.15;
            self.outer.css({ x: self.currentX.toFixed() - self.outer.width / 2, y: self.currentY.toFixed() - self.outer.height / 2, rotation: self.theta.toFixed(), scaleX: self.scale + self.velocity, scaleY: self.scale });
            self.inner.css({ x: self.posX - self.inner.width / 2, y: self.posY - self.inner.height / 2 });
        }

        this.hoverIn = () => {
            this.hoveredIn = true;
            this.tween({ scale: params.scale || 1.4, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic');
        };

        this.hoverOut = () => {
            this.hoveredIn = false;
            this.tween({ scale: 1 }, 750, 'easeOutExpo');
        };

        this.destroy = () => {
            window.removeEventListener('mousemove', move);
            return super.destroy();
        };
    }
}

export { ElasticCursor };
