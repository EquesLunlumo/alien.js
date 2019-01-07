/**
 * Scroll interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Device } from '../util/Device.js';
import { Component } from '../util/Component.js';
import { Interaction } from '../util/Interaction.js';
import { Mouse } from '../util/Mouse.js';

class Scroll extends Component {

    constructor(object, params) {

        if (!object || !object.element) {
            params = object;
            object = null;
        }
        if (!params) params = {};

        super();
        const self = this;
        const callbacks = [],
            scrollTarget = {
                x: 0,
                y: 0
            },
            scrollInertia = {
                x: 0,
                y: 0
            };
        let axes = ['x', 'y'];

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
        this.enabled = true;

        initParameters();
        addListeners();
        this.startRender(loop);

        function initParameters() {
            self.object = object;
            self.hitObject = params.hitObject || self.object;
            self.max.y = params.height || 0;
            self.max.x = params.width || 0;
            self.drag = (() => {
                if (typeof params.drag !== 'undefined') return params.drag;
                return Device.mobile;
            })();
            self.mouseWheel = params.mouseWheel !== false;
            self.limit = params.limit !== false;
            if (Array.isArray(params.axes)) axes = params.axes;
            if (self.object) self.object.css({ overflow: 'auto' });
        }

        function addListeners() {
            if (!Device.mobile) window.addEventListener('wheel', scroll);
            if (self.drag) {
                if (self.hitObject) self.hitObject.bind('touchstart', e => e.preventDefault());
                const input = self.hitObject ? self.initClass(Interaction, self.hitObject) : Mouse.input;
                self.events.add(input, Interaction.START, down);
                self.events.add(input, Interaction.DRAG, drag);
            }
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function stopInertia() {
            axes.forEach(axis => {
                scrollInertia[axis] = 0;
            });
            clearTween(scrollTarget);
        }

        function scroll(e) {
            if (!self.enabled) return;
            if (!self.mouseWheel) return;
            stopInertia();
            axes.forEach(axis => {
                const delta = 'delta' + axis.toUpperCase();
                scrollTarget[axis] += e[delta];
                scrollInertia[axis] = e[delta];
            });
        }

        function down() {
            if (!self.enabled) return;
            stopInertia();
        }

        function drag() {
            if (!self.enabled) return;
            axes.forEach(axis => {
                scrollTarget[axis] += -Mouse.input.delta[axis];
                scrollInertia[axis] = -Mouse.input.delta[axis];
            });
        }

        function resize() {
            if (!self.enabled) return;
            stopInertia();
            if (!self.object) return;
            const progress = {};
            if (Device.mobile) axes.forEach(axis => progress[axis] = self.max[axis] ? scrollTarget[axis] / self.max[axis] : 0);
            if (typeof params.height === 'undefined') self.max.y = self.object.element.scrollHeight - self.object.element.clientHeight;
            if (typeof params.width === 'undefined') self.max.x = self.object.element.scrollWidth - self.object.element.clientWidth;
            if (Device.mobile) axes.forEach(axis => self[axis] = scrollTarget[axis] = progress[axis] * self.max[axis]);
        }

        function loop() {
            axes.forEach(axis => {
                if (scrollInertia[axis] !== 0) {
                    scrollInertia[axis] *= 0.9;
                    if (Math.abs(scrollInertia[axis]) < 0.001) scrollInertia[axis] = 0;
                    scrollTarget[axis] += scrollInertia[axis];
                }
                if (self.limit) scrollTarget[axis] = Math.clamp(scrollTarget[axis], 0, self.max[axis]);
                self.delta[axis] = scrollTarget[axis] - self[axis];
                self[axis] += self.delta[axis];
                self[axis] = Math.round(self[axis] * 100) / 100;
            });
            if (self.object) {
                self.object.element.scrollLeft = self.x;
                self.object.element.scrollTop = self.y;
            }
            callback(self.delta);
        }

        function callback(delta) {
            for (let i = 0; i < callbacks.length; i++) callbacks[i](delta);
        }

        this.link = callback => {
            callbacks.push(callback);
        };

        this.unlink = callback => {
            callbacks.remove(callback);
        };

        this.stopInertia = stopInertia;

        this.destroy = () => {
            window.removeEventListener('wheel', scroll);
            return super.destroy();
        };
    }
}

export { Scroll };
