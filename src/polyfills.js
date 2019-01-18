/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenLite, globals } from './gsap/TweenLite.js';
import { Interpolation } from './util/Interpolation.js';

Promise.create = function () {
    let resolve, reject;
    const promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

Math.sign = function (x) {
    x = +x;
    if (x === 0 || isNaN(x)) return Number(x);
    return x > 0 ? 1 : -1;
};

Math.degrees = function (radians) {
    return radians * (180 / Math.PI);
};

Math.radians = function (degrees) {
    return degrees * (Math.PI / 180);
};

Math.clamp = function (value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

Math.range = function (value, oldMin, oldMax, newMin, newMax, isClamp) {
    const newValue = (value - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    if (isClamp) return Math.clamp(newValue, newMin, newMax);
    return newValue;
};

Math.mix = function (a, b, alpha) {
    return a * (1 - alpha) + b * alpha;
};

Math.step = function (edge, value) {
    return value < edge ? 0 : 1;
};

Math.smoothStep = function (min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

Math.fract = function (value) {
    return value - Math.floor(value);
};

Math.mod = function (value, n) {
    return (value % n + n) % n;
};

Array.prototype.shuffle = function () {
    let i = this.length,
        temp, r;
    while (i !== 0) {
        r = Math.floor(Math.random() * i);
        i -= 1;
        temp = this[i];
        this[i] = this[r];
        this[r] = temp;
    }
    return this;
};

Array.prototype.random = function (range) {
    let value = Math.floor(Math.random() * this.length);
    if (range && !this.randomStore) this.randomStore = [];
    if (!this.randomStore) return this[value];
    if (range > this.length) range = this.length;
    if (range > 1) {
        while (~this.randomStore.indexOf(value)) if (++value > this.length - 1) value = 0;
        this.randomStore.push(value);
        if (this.randomStore.length >= range) this.randomStore.shift();
    }
    return this[value];
};

Array.prototype.remove = function (element) {
    const index = this.indexOf(element);
    if (~index) return this.splice(index, 1);
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

String.prototype.includes = function (str) {
    if (!Array.isArray(str)) return ~this.indexOf(str);
    for (let i = 0; i < str.length; i++) if (~this.indexOf(str[i])) return true;
    return false;
};

String.prototype.clip = function (num, end) {
    return this.length > num ? this.slice(0, num) + end : this;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function (find, replace) {
    return this.split(find).join(replace);
};

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

window.get = function (url, options = {}) {
    const promise = Promise.create();
    options.method = 'GET';
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(function (text) {
            if (text.charAt(0).includes(['[', '{'])) {
                try {
                    promise.resolve(JSON.parse(text));
                } catch (err) {
                    promise.resolve(text);
                }
            } else {
                promise.resolve(text);
            }
        });
    }
    return promise;
};

window.post = function (url, body, options = {}) {
    const promise = Promise.create();
    options.method = 'POST';
    options.body = JSON.stringify(body);
    window.fetch(url, options).then(handleResponse).catch(promise.reject);

    function handleResponse(e) {
        if (!e.ok) return promise.reject(e);
        e.text().then(function (text) {
            if (text.charAt(0).includes(['[', '{'])) {
                try {
                    promise.resolve(JSON.parse(text));
                } catch (err) {
                    promise.resolve(text);
                }
            } else {
                promise.resolve(text);
            }
        });
    }
    return promise;
};

window.defer = function (callback) {
    if (!callback) {
        const promise = Promise.create();
        TweenLite.delayedCall(0.001, promise.resolve);
        return promise;
    }
    TweenLite.delayedCall(0.001, callback);
};

window.tween = function (object, props, time, ease, delay, complete, update) {
    if (typeof delay !== 'number') {
        update = complete;
        complete = delay;
        delay = 0;
    }
    const promise = Promise.create();
    if (complete) promise.then(complete);
    complete = promise.resolve;
    const CustomEase = globals.CustomEase;
    props.ease = typeof ease === 'object' ? ease : (CustomEase && CustomEase.get(ease)) || Interpolation.get(ease);
    if (props.spring || props.damping) props.ease = props.ease.config(props.spring || 1, props.damping || 0.3);
    props.delay = delay * 0.001;
    props.onComplete = complete;
    props.onUpdate = update;
    TweenLite.to(object, time * 0.001, props);
    return promise;
};

window.clearTween = function (object) {
    TweenLite.killTweensOf(object);
};

if (!window.Config) window.Config = {};
if (!window.Global) window.Global = {};
