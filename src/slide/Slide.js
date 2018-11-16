/**
 * Slide interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Interaction } from '../util/Interaction.js';
import { Mouse } from '../util/Mouse.js';
import { TweenManager } from '../tween/TweenManager.js';
import { Interpolation } from '../tween/Interpolation.js';

class Slide extends Component {

    constructor(params = {}) {
        super();
        const self = this;
        const scrollTarget = {
                x: 0,
                y: 0
            },
            scrollInertia = {
                x: 0,
                y: 0
            },
            event = {};
        let axes = ['x', 'y'],
            slideIndex;

        this.x = 0;
        this.y = 0;
        this.max = {
            x: 0,
            y: 0
        };
        this.delta = {
            x: 0,
            y: 0
        };
        this.direction = {
            x: 0,
            y: 0
        };
        this.position = 0;
        this.progress = 0;
        this.floor = 0;
        this.ceil = 0;
        this.index = 0;
        this.enabled = true;

        initParameters();
        addListeners();
        this.startRender(loop);

        function initParameters() {
            self.num = params.num || 0;
            if (params.max) self.max = params.max;
            if (params.index) {
                self.index = params.index;
                self.x = scrollTarget.x = self.index * self.max.x;
                self.y = scrollTarget.y = self.index * self.max.y;
            }
            if (params.axes) axes = params.axes;
        }

        function addListeners() {
            window.addEventListener('wheel', scroll);
            self.events.add(Mouse.input, Interaction.START, down);
            self.events.add(Mouse.input, Interaction.DRAG, drag);
            self.events.add(Events.KEYBOARD_DOWN, keyDown);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function stopInertia() {
            TweenManager.clearTween(scrollTarget);
        }

        function scroll(e) {
            if (!self.enabled) return;
            stopInertia();
            axes.forEach(axis => {
                if (!self.max[axis]) return;
                scrollTarget[axis] += e['delta' + axis.toUpperCase()];
            });
        }

        function down() {
            if (!self.enabled) return;
            stopInertia();
        }

        function drag() {
            if (!self.enabled) return;
            axes.forEach(axis => {
                if (!self.max[axis]) return;
                scrollTarget[axis] += -Mouse.input.delta[axis] * 4;
                scrollInertia[axis] = -Mouse.input.delta[axis] * 4;
            });
        }

        function keyDown(e) {
            if (!self.enabled) return;
            if (e.keyCode === 40) self.next();      // Down
            else if (e.keyCode === 39) self.next(); // Right
            else if (e.keyCode === 38) self.prev(); // Up
            else if (e.keyCode === 37) self.prev(); // Left
        }

        function resize() {
            if (!self.enabled) return;
            stopInertia();
        }

        function loop() {
            axes.forEach(axis => {
                if (!self.max[axis]) return;
                const progress = self[axis] / self.max[axis],
                    slide = Math.round(progress);
                if (scrollTarget[axis] === slide * self.max[axis]) return;
                if (scrollInertia[axis] !== 0) {
                    scrollInertia[axis] *= 0.9;
                    if (Math.abs(scrollInertia[axis]) < 0.001) scrollInertia[axis] = 0;
                    scrollTarget[axis] += scrollInertia[axis];
                }
                const limit = self.max[axis] * 0.035;
                scrollTarget[axis] += Interpolation.Sine.Out(Math.round(self.progress) - self.progress) * limit;
                if (Math.abs(scrollTarget[axis] - self[axis]) > limit) scrollTarget[axis] -= (scrollTarget[axis] - self[axis]) * 0.5;
                else if (Math.abs(scrollTarget[axis] - self[axis]) < 0.001) scrollTarget[axis] = slide * self.max[axis];
                self.delta[axis] = scrollTarget[axis] - self[axis];
                self.delta[axis] = self.delta[axis] < 0 ? Math.max(self.delta[axis], -limit) : Math.min(self.delta[axis], limit);
                self[axis] += self.delta[axis];
            });
            self.position = (self.x + self.y) / (self.max.x + self.max.y) % self.num + self.num;
            self.progress = self.position % 1;
            self.floor = Math.floor(self.position) % self.num;
            self.ceil = Math.ceil(self.position) % self.num;
            self.index = Math.round(self.position) % self.num;
            if (slideIndex !== self.index) {
                slideIndex = self.index;
                self.direction.x = self.delta.x < 0 ? -1 : 1;
                self.direction.y = self.delta.y < 0 ? -1 : 1;
                event.index = self.index;
                event.direction = self.direction;
                self.events.fire(Events.UPDATE, event, true);
            }
        }

        this.moveTo = slide => {
            const obj = {};
            obj.x = slide * this.max.x;
            obj.y = slide * this.max.y;
            TweenManager.tween(scrollTarget, obj, 2500, 'easeOutQuint');
        };

        this.next = () => {
            const progress = (this.x + this.y) / (this.max.x + this.max.y),
                slide = Math.round(progress);
            this.moveTo(slide + 1);
        };

        this.prev = () => {
            const progress = (this.x + this.y) / (this.max.x + this.max.y),
                slide = Math.round(progress);
            this.moveTo(slide - 1);
        };

        this.destroy = () => {
            window.removeEventListener('wheel', scroll);
            return super.destroy();
        };
    }
}

export { Slide };
