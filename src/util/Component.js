/**
 * Alien component.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenLite } from '../gsap/TweenLite.js';
import { Utils } from './Utils.js';
import { Render } from './Render.js';
import { Events } from './Events.js';

class Component {

    constructor() {
        this.events = new Events();
        this.classes = [];
        this.timers = [];
        this.loops = [];
    }

    initClass(object, ...params) {
        const child = new object(...params);
        this.add(child);
        return child;
    }

    add(child) {
        if (!this.classes) return;
        if (child.destroy) {
            this.classes.push(child);
            child.parent = this;
        }
    }

    delayedCall(callback, time = 0, ...params) {
        if (!this.timers) return;
        TweenLite.delayedCall(time * 0.001, callback, params);
        this.timers.push(callback);
        if (this.timers.length > 50) this.timers.shift();
        return callback;
    }

    clearTimeout(callback) {
        TweenLite.killDelayedCallsTo(callback);
    }

    clearTimers() {
        if (!this.timers) return;
        for (let i = this.timers.length - 1; i >= 0; i--) this.clearTimeout(this.timers[i]);
        this.timers.length = 0;
    }

    startRender(callback, fps) {
        if (!this.loops) return;
        this.loops.push(callback);
        Render.start(callback, fps);
    }

    stopRender(callback) {
        if (!this.loops) return;
        this.loops.remove(callback);
        Render.stop(callback);
    }

    clearRenders() {
        if (!this.loops) return;
        for (let i = this.loops.length - 1; i >= 0; i--) this.stopRender(this.loops[i]);
        this.loops.length = 0;
    }

    wait(time = 0) {
        const promise = Promise.create();
        this.delayedCall(promise.resolve, time);
        return promise;
    }

    destroy() {
        if (!this.classes) return;
        this.removed = true;
        const parent = this.parent;
        if (parent && !parent.removed && parent.remove) parent.remove(this);
        for (let i = this.classes.length - 1; i >= 0; i--) {
            const child = this.classes[i];
            if (child && child.destroy) child.destroy();
        }
        this.classes.length = 0;
        this.clearRenders();
        this.clearTimers();
        this.events.destroy();
        return Utils.nullObject(this);
    }

    remove(child) {
        if (!this.classes) return;
        this.classes.remove(child);
    }

    tween(props, time, ease, delay, complete, update) {
        return tween(this, props, time, ease, delay, complete, update);
    }

    clearTween() {
        clearTween(this);
        return this;
    }
}

export { Component };
