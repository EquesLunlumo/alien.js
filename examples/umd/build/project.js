(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Project = factory());
}(this, (function () { 'use strict';

/**
 * @author Patrick Schroen / https://github.com/pschroen
 */

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

Array.storeRandom = function (arr) {
    arr.randomStore = [];
};

Array.prototype.random = function (range) {
    let value = Math.floor(Math.random() * this.length);
    if (range && !this.randomStore) Array.storeRandom(this);
    if (!this.randomStore) return this[value];
    if (range > this.length - 1) range = this.length;
    if (range > 1) {
        while (~this.randomStore.indexOf(value)) if (value++ > this.length - 1) value = 0;
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

window.getURL = function (url, target = '_blank') {
    window.open(url, target);
};

if (!window.Config) window.Config = {};
if (!window.Global) window.Global = {};

/**
 * Alien utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Utils {

    static random(min, max, precision = 0) {
        if (typeof min === 'undefined') return Math.random();
        if (min === max) return min;
        min = min || 0;
        max = max || 1;
        const p = Math.pow(10, precision);
        return Math.round((min + Math.random() * (max - min)) * p) / p;
    }

    static headsTails(heads, tails) {
        return this.random(0, 1) ? tails : heads;
    }

    static queryString(key) {
        const str = decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[.+*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
        if (!str.length || str === '0' || str === 'false') return false;
        return str;
    }

    static getConstructorName(object) {
        return object.constructor.name || object.constructor.toString().match(/function ([^(]+)/)[1];
    }

    static nullObject(object) {
        for (let key in object) if (typeof object[key] !== 'undefined') object[key] = null;
        return null;
    }

    static cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    static mergeObject(...objects) {
        const object = {};
        for (let obj of objects) for (let key in obj) object[key] = obj[key];
        return object;
    }

    static toArray(object) {
        return Object.keys(object).map(key => {
            return object[key];
        });
    }

    static cloneArray(array) {
        return array.slice(0);
    }

    static basename(path, ext) {
        const name = path.split('/').last();
        return !ext ? name.split('.')[0] : name;
    }

    static extension(path) {
        return path.split('.').last().split('?')[0].toLowerCase();
    }

    static base64(str) {
        return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));
    }

    static date(str) {
        const split = str.split(/[^0-9]/);
        return new Date(split[0], split[1] - 1, split[2], split[3], split[4], split[5]);
    }

    static timestamp() {
        return (Date.now() + this.random(0, 99999)).toString();
    }

    static pad(number) {
        return number < 10 ? '0' + number : number;
    }

    static get hash() {
        return window.location.hash.slice(1);
    }
}

/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Render {

    static init() {
        const self = this;
        const render = [],
            skipLimit = 200;
        let last = performance.now();

        requestAnimationFrame(step);

        function step(t) {
            const delta = Math.min(skipLimit, t - last);
            last = t;
            self.TIME = t;
            self.DELTA = delta;
            for (let i = render.length - 1; i >= 0; i--) {
                const callback = render[i];
                if (!callback) {
                    render.remove(callback);
                    continue;
                }
                if (callback.fps) {
                    if (t - callback.last < 1000 / callback.fps) continue;
                    callback(++callback.frame);
                    callback.last = t;
                    continue;
                }
                callback(t, delta);
            }
            if (!self.paused) requestAnimationFrame(step);
        }

        this.start = (callback, fps) => {
            if (fps) {
                callback.fps = fps;
                callback.last = -Infinity;
                callback.frame = -1;
            }
            if (!~render.indexOf(callback)) render.unshift(callback);
        };

        this.stop = callback => {
            render.remove(callback);
        };

        this.tick = () => {
            this.TIME = performance.now();
            step(this.TIME);
        };

        this.pause = () => {
            this.paused = true;
        };

        this.resume = () => {
            if (!this.paused) return;
            this.paused = false;
            requestAnimationFrame(step);
        };
    }
}

Render.init();

/**
 * Timer helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Timer {

    static init() {
        const callbacks = [],
            discard = [];

        Render.start(loop);

        function loop(t, delta) {
            for (let i = 0; i < discard.length; i++) {
                const obj = discard[i];
                obj.callback = null;
                callbacks.remove(obj);
            }
            if (discard.length) discard.length = 0;
            for (let i = 0; i < callbacks.length; i++) {
                const obj = callbacks[i];
                if (!obj) {
                    callbacks.remove(obj);
                    continue;
                }
                if ((obj.current += delta) >= obj.time) {
                    if (obj.callback) obj.callback(...obj.args);
                    discard.push(obj);
                }
            }
        }

        function find(ref) {
            for (let i = 0; i < callbacks.length; i++) if (callbacks[i].ref === ref) return callbacks[i];
            return null;
        }

        this.clearTimeout = ref => {
            const obj = find(ref);
            if (!obj) return false;
            obj.callback = null;
            callbacks.remove(obj);
            return true;
        };

        this.create = (callback, time = 1, ...args) => {
            const obj = {
                time: Math.max(1, time),
                current: 0,
                ref: Utils.timestamp(),
                callback,
                args
            };
            callbacks.push(obj);
            return obj.ref;
        };

        window.defer = this.defer = callback => this.create(callback, 1);
    }
}

Timer.init();

/**
 * Event helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Events {

    constructor() {

        class Emitter {

            constructor() {
                this.events = [];
                this.links = [];
            }

            add(event, callback, object) {
                this.events.push({ event, callback, object });
            }

            remove(event, callback) {
                for (let i = this.events.length - 1; i >= 0; i--) {
                    if (this.events[i].event === event && this.events[i].callback === callback) {
                        this.events[i].removed = true;
                        this.events.splice(i, 1)[0] = null;
                    }
                }
            }

            fire(event, object = {}) {
                let called = false;
                const clone = Utils.cloneArray(this.events);
                for (let i = 0; i < clone.length; i++) {
                    if (clone[i].event === event && !clone[i].removed) {
                        clone[i].callback(object);
                        called = true;
                    }
                }
                return called;
            }

            destroy(object) {
                for (let i = this.events.length - 1; i >= 0; i--) if (this.events[i].object === object) this.events.splice(i, 1)[0] = null;
            }

            link(object) {
                if (!~this.links.indexOf(object)) this.links.push(object);
            }
        }

        if (!Events.initialized) {
            Events.emitter        = new Emitter();
            Events.VISIBILITY     = 'visibility';
            Events.KEYBOARD_PRESS = 'keyboard_press';
            Events.KEYBOARD_DOWN  = 'keyboard_down';
            Events.KEYBOARD_UP    = 'keyboard_up';
            Events.RESIZE         = 'resize';
            Events.COMPLETE       = 'complete';
            Events.PROGRESS       = 'progress';
            Events.UPDATE         = 'update';
            Events.LOADED         = 'loaded';
            Events.ERROR          = 'error';
            Events.READY          = 'ready';
            Events.HOVER          = 'hover';
            Events.CLICK          = 'click';

            Events.initialized = true;
        }

        const linked = [];

        this.emitter = new Emitter();

        this.add = (object, event, callback) => {
            if (typeof object !== 'object') {
                callback = event;
                event = object;
                object = null;
            }
            if (!object) {
                Events.emitter.add(event, callback, this);
            } else {
                const emitter = object.events.emitter;
                emitter.add(event, callback, this);
                emitter.link(this);
                linked.push(emitter);
            }
        };

        this.remove = (object, event, callback) => {
            if (typeof object !== 'object') {
                callback = event;
                event = object;
                object = null;
            }
            if (!object) Events.emitter.remove(event, callback);
            else object.events.emitter.remove(event, callback);
        };

        this.fire = (event, object = {}, local) => {
            if (this.emitter.fire(event, object)) return;
            if (local) return;
            Events.emitter.fire(event, object);
        };

        this.bubble = (object, event) => {
            this.add(object, event, e => this.fire(event, e));
        };

        this.destroy = () => {
            Events.emitter.destroy(this);
            linked.forEach(emitter => emitter.destroy(this));
            this.emitter.links.forEach(object => {
                if (object.unlink) object.unlink(this.emitter);
            });
            return Utils.nullObject(this);
        };

        this.unlink = emitter => {
            linked.remove(emitter);
        };
    }
}

/**
 * Browser detection and helper functions.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Device {

    static init() {
        this.agent = navigator.userAgent.toLowerCase();
        this.pixelRatio = window.devicePixelRatio;
        this.webcam = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        this.language = navigator.userLanguage || navigator.language;
        this.webaudio = !!window.AudioContext;
        this.os = (() => {
            if (this.detect(['iphone', 'ipad'])) return 'ios';
            if (this.detect(['android'])) return 'android';
            if (this.detect(['blackberry'])) return 'blackberry';
            if (this.detect(['mac os'])) return 'mac';
            if (this.detect(['windows'])) return 'windows';
            if (this.detect(['linux'])) return 'linux';
            return 'unknown';
        })();
        this.browser = (() => {
            if (this.os === 'ios') {
                if (this.detect(['safari'])) return 'safari';
                return 'unknown';
            }
            if (this.os === 'android') {
                if (this.detect(['chrome'])) return 'chrome';
                if (this.detect(['firefox'])) return 'firefox';
                return 'browser';
            }
            if (this.detect(['msie'])) return 'ie';
            if (this.detect(['trident']) && this.detect(['rv:'])) return 'ie';
            if (this.detect(['windows']) && this.detect(['edge'])) return 'ie';
            if (this.detect(['chrome'])) return 'chrome';
            if (this.detect(['safari'])) return 'safari';
            if (this.detect(['firefox'])) return 'firefox';
            return 'unknown';
        })();
        this.mobile = this.detect(['iphone', 'ipad', 'android', 'blackberry']);
        this.tablet = Math.max(window.screen ? screen.width : window.innerWidth, window.screen ? screen.height : window.innerHeight) > 1000;
        this.phone = !this.tablet;
        this.webgl = (() => {
            try {
                const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'],
                    canvas = document.createElement('canvas');
                let gl;
                for (let i = 0; i < names.length; i++) {
                    gl = canvas.getContext(names[i]);
                    if (gl) break;
                }
                const info = gl.getExtension('WEBGL_debug_renderer_info'),
                    output = {};
                if (info) output.gpu = gl.getParameter(info.UNMASKED_RENDERER_WEBGL).toLowerCase();
                output.renderer = gl.getParameter(gl.RENDERER).toLowerCase();
                output.version = gl.getParameter(gl.VERSION).toLowerCase();
                output.glsl = gl.getParameter(gl.SHADING_LANGUAGE_VERSION).toLowerCase();
                output.extensions = gl.getSupportedExtensions();
                output.detect = matches => {
                    if (output.gpu && output.gpu.includes(matches)) return true;
                    if (output.version && output.version.includes(matches)) return true;
                    for (let i = 0; i < output.extensions.length; i++) if (output.extensions[i].toLowerCase().includes(matches)) return true;
                    return false;
                };
                return output;
            } catch (e) {
                return false;
            }
        })();
    }

    static detect(matches) {
        return this.agent.includes(matches);
    }

    static vibrate(time) {
        if (navigator.vibrate) navigator.vibrate(time);
    }
}

Device.init();

/**
 * Alien component.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
        if (child.destroy) {
            this.classes.push(child);
            child.parent = this;
        }
        return this;
    }

    delayedCall(callback, time = 0, ...params) {
        if (!this.timers) return;
        const timer = Timer.create(() => {
            if (callback) callback(...params);
        }, time);
        this.timers.push(timer);
        if (this.timers.length > 50) this.timers.shift();
        return timer;
    }

    clearTimers() {
        for (let i = this.timers.length - 1; i >= 0; i--) Timer.clearTimeout(this.timers[i]);
        this.timers.length = 0;
    }

    startRender(callback, fps) {
        this.loops.push(callback);
        Render.start(callback, fps);
    }

    stopRender(callback) {
        this.loops.remove(callback);
        Render.stop(callback);
    }

    clearRenders() {
        for (let i = this.loops.length - 1; i >= 0; i--) this.stopRender(this.loops[i]);
        this.loops.length = 0;
    }

    destroy() {
        if (this.classes) {
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
        }
        return Utils.nullObject(this);
    }

    remove(child) {
        this.classes.remove(child);
    }
}

/**
 * Assets helper class with image promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Assets {

    static init() {
        const images = {},
            json = {};

        this.CDN = '';
        this.CORS = null;

        this.getPath = path => {
            if (~path.indexOf('//')) return path;
            if (this.CDN && !~path.indexOf(this.CDN)) path = this.CDN + path;
            return path;
        };

        this.createImage = (path, store, callback) => {
            if (typeof store !== 'boolean') {
                callback = store;
                store = null;
            }
            const img = new Image();
            img.crossOrigin = this.CORS;
            img.onload = callback;
            img.onerror = callback;
            img.src = this.getPath(path);
            if (store) images[path] = img;
            return img;
        };

        this.getImage = path => {
            return images[path];
        };

        this.storeData = (name, data) => {
            json[name] = data;
            return json[name];
        };

        this.getData = name => {
            return json[name];
        };
    }

    static loadImage(img) {
        if (typeof img === 'string') img = this.createImage(img);
        const promise = Promise.create();
        img.onload = () => promise.resolve(img);
        img.onerror = () => promise.resolve(img);
        return promise;
    }
}

Assets.init();

/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Interpolation {

    static init() {

        function calculateBezier(aT, aA1, aA2) {
            return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
        }

        function getTForX(aX, mX1, mX2) {
            let aGuessT = aX;
            for (let i = 0; i < 4; i++) {
                const currentSlope = getSlope(aGuessT, mX1, mX2);
                if (currentSlope === 0) return aGuessT;
                const currentX = calculateBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }
            return aGuessT;
        }

        function getSlope(aT, aA1, aA2) {
            return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
        }

        function A(aA1, aA2) {
            return 1 - 3 * aA2 + 3 * aA1;
        }

        function B(aA1, aA2) {
            return 3 * aA2 - 6 * aA1;
        }

        function C(aA1) {
            return 3 * aA1;
        }

        this.convertEase = ease => {
            return (() => {
                let fn;
                switch (ease) {
                    case 'easeInQuad':
                        fn = this.Quad.In;
                        break;
                    case 'easeInCubic':
                        fn = this.Cubic.In;
                        break;
                    case 'easeInQuart':
                        fn = this.Quart.In;
                        break;
                    case 'easeInQuint':
                        fn = this.Quint.In;
                        break;
                    case 'easeInSine':
                        fn = this.Sine.In;
                        break;
                    case 'easeInExpo':
                        fn = this.Expo.In;
                        break;
                    case 'easeInCirc':
                        fn = this.Circ.In;
                        break;
                    case 'easeInElastic':
                        fn = this.Elastic.In;
                        break;
                    case 'easeInBack':
                        fn = this.Back.In;
                        break;
                    case 'easeInBounce':
                        fn = this.Bounce.In;
                        break;
                    case 'easeOutQuad':
                        fn = this.Quad.Out;
                        break;
                    case 'easeOutCubic':
                        fn = this.Cubic.Out;
                        break;
                    case 'easeOutQuart':
                        fn = this.Quart.Out;
                        break;
                    case 'easeOutQuint':
                        fn = this.Quint.Out;
                        break;
                    case 'easeOutSine':
                        fn = this.Sine.Out;
                        break;
                    case 'easeOutExpo':
                        fn = this.Expo.Out;
                        break;
                    case 'easeOutCirc':
                        fn = this.Circ.Out;
                        break;
                    case 'easeOutElastic':
                        fn = this.Elastic.Out;
                        break;
                    case 'easeOutBack':
                        fn = this.Back.Out;
                        break;
                    case 'easeOutBounce':
                        fn = this.Bounce.Out;
                        break;
                    case 'easeInOutQuad':
                        fn = this.Quad.InOut;
                        break;
                    case 'easeInOutCubic':
                        fn = this.Cubic.InOut;
                        break;
                    case 'easeInOutQuart':
                        fn = this.Quart.InOut;
                        break;
                    case 'easeInOutQuint':
                        fn = this.Quint.InOut;
                        break;
                    case 'easeInOutSine':
                        fn = this.Sine.InOut;
                        break;
                    case 'easeInOutExpo':
                        fn = this.Expo.InOut;
                        break;
                    case 'easeInOutCirc':
                        fn = this.Circ.InOut;
                        break;
                    case 'easeInOutElastic':
                        fn = this.Elastic.InOut;
                        break;
                    case 'easeInOutBack':
                        fn = this.Back.InOut;
                        break;
                    case 'easeInOutBounce':
                        fn = this.Bounce.InOut;
                        break;
                    case 'linear':
                        fn = this.Linear.None;
                        break;
                }
                if (!fn) {
                    const curve = TweenManager.getEase(ease);
                    if (curve) {
                        const values = curve.split('(')[1].slice(0, -1).split(',');
                        for (let i = 0; i < values.length; i++) values[i] = parseFloat(values[i]);
                        fn = values;
                    } else {
                        fn = this.Cubic.Out;
                    }
                }
                return fn;
            })();
        };

        this.solve = (values, elapsed) => {
            if (values[0] === values[1] && values[2] === values[3]) return elapsed;
            return calculateBezier(getTForX(elapsed, values[0], values[2]), values[1], values[3]);
        };

        this.Linear = {
            None(k) {
                return k;
            }
        };

        this.Quad = {
            In(k) {
                return k * k;
            },
            Out(k) {
                return k * (2 - k);
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k;
                return -0.5 * (--k * (k - 2) - 1);
            }
        };

        this.Cubic = {
            In(k) {
                return k * k * k;
            },
            Out(k) {
                return --k * k * k + 1;
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k;
                return 0.5 * ((k -= 2) * k * k + 2);
            }
        };

        this.Quart = {
            In(k) {
                return k * k * k * k;
            },
            Out(k) {
                return 1 - --k * k * k * k;
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k;
                return -0.5 * ((k -= 2) * k * k * k - 2);
            }
        };

        this.Quint = {
            In(k) {
                return k * k * k * k * k;
            },
            Out(k) {
                return --k * k * k * k * k + 1;
            },
            InOut(k) {
                if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
                return 0.5 * ((k -= 2) * k * k * k * k + 2);
            }
        };

        this.Sine = {
            In(k) {
                return 1 - Math.cos(k * Math.PI / 2);
            },
            Out(k) {
                return Math.sin(k * Math.PI / 2);
            },
            InOut(k) {
                return 0.5 * (1 - Math.cos(Math.PI * k));
            }
        };

        this.Expo = {
            In(k) {
                return k === 0 ? 0 : Math.pow(1024, k - 1);
            },
            Out(k) {
                return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
            },
            InOut(k) {
                if (k === 0) return 0;
                if (k === 1) return 1;
                if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
                return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
            }
        };

        this.Circ = {
            In(k) {
                return 1 - Math.sqrt(1 - k * k);
            },
            Out(k) {
                return Math.sqrt(1 - --k * k);
            },
            InOut(k) {
                if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
            }
        };

        this.Elastic = {
            In(k, a = 1, p = 0.4) {
                let s;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            },
            Out(k, a = 1, p = 0.4) {
                let s;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
            },
            InOut(k, a = 1, p = 0.4) {
                let s;
                if (k === 0) return 0;
                if (k === 1) return 1;
                if (!a || a < 1) {
                    a = 1;
                    s = p / 4;
                } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
            }
        };

        this.Back = {
            In(k) {
                const s = 1.70158;
                return k * k * ((s + 1) * k - s);
            },
            Out(k) {
                const s = 1.70158;
                return --k * k * ((s + 1) * k + s) + 1;
            },
            InOut(k) {
                const s = 1.70158 * 1.525;
                if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
            }
        };

        this.Bounce = {
            In(k) {
                return 1 - Interpolation.Bounce.Out(1 - k);
            },
            Out(k) {
                if (k < 1 / 2.75) return 7.5625 * k * k;
                if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
                if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            },
            InOut(k) {
                if (k < 0.5) return Interpolation.Bounce.In(k * 2) * 0.5;
                return Interpolation.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
            }
        };
    }
}

Interpolation.init();

/**
 * Mathematical.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class MathTween {

    constructor(object, props, time, ease, delay, update, callback) {
        const self = this;
        let startTime, startValues, endValues, easeFunction, paused, spring, damping, elapsed;

        initMathTween();

        function initMathTween() {
            if (!object.multiTween && object.mathTween) TweenManager.clearTween(object);
            TweenManager.addMathTween(self);
            object.mathTween = self;
            if (object.multiTween) {
                if (!object.mathTweens) object.mathTweens = [];
                object.mathTweens.push(self);
            }
            ease = Interpolation.convertEase(ease);
            easeFunction = typeof ease === 'function';
            startTime = performance.now();
            startTime += delay;
            endValues = props;
            startValues = {};
            if (props.spring) spring = props.spring;
            if (props.damping) damping = props.damping;
            for (let prop in endValues) if (typeof object[prop] === 'number') startValues[prop] = object[prop];
        }

        function clear() {
            if (!object && !props) return false;
            object.mathTween = null;
            TweenManager.removeMathTween(self);
            Utils.nullObject(self);
            if (object.mathTweens) object.mathTweens.remove(self);
        }

        this.update = t => {
            if (paused || t < startTime) return;
            elapsed = (t - startTime) / time;
            elapsed = elapsed > 1 ? 1 : elapsed;
            const delta = this.interpolate(elapsed);
            if (update) update(delta);
            if (elapsed === 1) {
                if (callback) callback();
                clear();
            }
        };

        this.stop = () => {
            clear();
        };

        this.pause = () => {
            paused = true;
        };

        this.resume = () => {
            paused = false;
            startTime = performance.now() - elapsed * time;
        };

        this.interpolate = elapsed => {
            const delta = easeFunction ? ease(elapsed, spring, damping) : Interpolation.solve(ease, elapsed);
            for (let prop in startValues) {
                if (typeof startValues[prop] === 'number' && typeof endValues[prop] === 'number') {
                    const start = startValues[prop],
                        end = endValues[prop];
                    object[prop] = start + (end - start) * delta;
                }
            }
            return delta;
        };
    }
}

/**
 * Tween helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class TweenManager {

    static init() {
        const self = this;
        const tweens = [];

        this.TRANSFORMS = ['x', 'y', 'z', 'scale', 'scaleX', 'scaleY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'skewX', 'skewY', 'perspective'];
        this.CSS_EASES = {
            easeOutCubic:   'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            easeOutQuad:    'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
            easeOutQuart:   'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
            easeOutQuint:   'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
            easeOutSine:    'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
            easeOutExpo:    'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
            easeOutCirc:    'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
            easeOutBack:    'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
            easeInCubic:    'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
            easeInQuad:     'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
            easeInQuart:    'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
            easeInQuint:    'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
            easeInSine:     'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
            easeInCirc:     'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
            easeInBack:     'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
            easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
            easeInOutQuad:  'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
            easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
            easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
            easeInOutSine:  'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
            easeInOutExpo:  'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
            easeInOutCirc:  'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
            easeInOutBack:  'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
            easeInOut:      'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
            linear:         'linear'
        };

        Render.start(updateTweens);

        function updateTweens(t) {
            for (let i = tweens.length - 1; i >= 0; i--) {
                const tween = tweens[i];
                if (tween.update) tween.update(t);
                else self.removeMathTween(tween);
            }
        }

        this.addMathTween = tween => {
            tweens.push(tween);
        };

        this.removeMathTween = tween => {
            tweens.remove(tween);
        };

        this.tween = (object, props, time, ease, delay, callback, update) => {
            if (typeof delay !== 'number') {
                update = callback;
                callback = delay;
                delay = 0;
            }
            let promise = null;
            if (typeof Promise !== 'undefined') {
                promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
            }
            const tween = new MathTween(object, props, time, ease, delay, update, callback);
            return promise || tween;
        };

        this.clearTween = object => {
            if (object.mathTween) object.mathTween.stop();
            if (object.mathTweens) {
                const tweens = object.mathTweens;
                for (let i = tweens.length - 1; i >= 0; i--) {
                    const tween = tweens[i];
                    if (tween) tween.stop();
                }
                object.mathTweens = null;
            }
        };

        this.isTransform = key => {
            return ~this.TRANSFORMS.indexOf(key);
        };

        this.getEase = name => {
            return this.CSS_EASES[name] || this.CSS_EASES.easeOutCubic;
        };

        this.getAllTransforms = object => {
            const obj = {};
            for (let i = 0; i < this.TRANSFORMS.length; i++) {
                const key = this.TRANSFORMS[i],
                    val = object[key];
                if (val !== 0 && typeof val === 'number') obj[key] = val;
            }
            return obj;
        };

        this.parseTransform = props => {
            let transforms = '';
            if (typeof props.x !== 'undefined' || typeof props.y !== 'undefined' || typeof props.z !== 'undefined') {
                const x = props.x || 0,
                    y = props.y || 0,
                    z = props.z || 0;
                let translate = '';
                translate += x + 'px, ';
                translate += y + 'px, ';
                translate += z + 'px';
                transforms += 'translate3d(' + translate + ')';
            }
            if (typeof props.scale !== 'undefined') {
                transforms += 'scale(' + props.scale + ')';
            } else {
                if (typeof props.scaleX !== 'undefined') transforms += 'scaleX(' + props.scaleX + ')';
                if (typeof props.scaleY !== 'undefined') transforms += 'scaleY(' + props.scaleY + ')';
            }
            if (typeof props.rotation !== 'undefined') transforms += 'rotate(' + props.rotation + 'deg)';
            if (typeof props.rotationX !== 'undefined') transforms += 'rotateX(' + props.rotationX + 'deg)';
            if (typeof props.rotationY !== 'undefined') transforms += 'rotateY(' + props.rotationY + 'deg)';
            if (typeof props.rotationZ !== 'undefined') transforms += 'rotateZ(' + props.rotationZ + 'deg)';
            if (typeof props.skewX !== 'undefined') transforms += 'skewX(' + props.skewX + 'deg)';
            if (typeof props.skewY !== 'undefined') transforms += 'skewY(' + props.skewY + 'deg)';
            if (typeof props.perspective !== 'undefined') transforms += 'perspective(' + props.perspective + 'px)';
            return transforms;
        };

        this.interpolate = (num, alpha, ease) => {
            const fn = Interpolation.convertEase(ease);
            return num * (typeof fn === 'function' ? fn(alpha) : Interpolation.solve(fn, alpha));
        };

        this.interpolateValues = (start, end, alpha, ease) => {
            const fn = Interpolation.convertEase(ease);
            return start + (end - start) * (typeof fn === 'function' ? fn(alpha) : Interpolation.solve(fn, alpha));
        };
    }
}

TweenManager.init();

/**
 * CSS3 transition animation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CSSTransition {

    constructor(object, props, time, ease, delay, callback) {
        const self = this;
        let transformProps, transitionProps;

        initProperties();
        initCSSTween();

        function killed() {
            return !self || self.kill || !object || !object.element;
        }

        function initProperties() {
            const transform = TweenManager.getAllTransforms(object),
                properties = [];
            for (let key in props) {
                if (TweenManager.isTransform(key)) {
                    transform.use = true;
                    transform[key] = props[key];
                    delete props[key];
                } else if (typeof props[key] === 'number' || ~key.indexOf('-')) {
                    properties.push(key);
                }
            }
            if (transform.use) {
                properties.push('transform');
                delete transform.use;
            }
            transformProps = transform;
            transitionProps = properties;
        }

        function initCSSTween() {
            if (killed()) return;
            if (object.cssTween) object.cssTween.stop();
            object.cssTween = self;
            const strings = buildStrings(time, ease, delay);
            object.willChange(strings.props);
            Timer.create(() => {
                if (killed()) return;
                object.element.style.transition = strings.transition;
                object.css(props);
                object.transform(transformProps);
                Timer.create(() => {
                    if (killed()) return;
                    clearCSSTween();
                    if (callback) callback();
                }, time + delay);
            }, 35);
        }

        function buildStrings(time, ease, delay) {
            let props = '',
                transition = '';
            for (let i = 0; i < transitionProps.length; i++) {
                const transitionProp = transitionProps[i];
                props += (props.length ? ', ' : '') + transitionProp;
                transition += (transition.length ? ', ' : '') + transitionProp + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
            }
            return {
                props,
                transition
            };
        }

        function clearCSSTween() {
            if (killed()) return;
            self.kill = true;
            object.element.style.transition = '';
            object.willChange(null);
            object.cssTween = null;
            object = props = null;
            Utils.nullObject(self);
        }

        this.stop = clearCSSTween;
    }
}

/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Interface {

    constructor(name, type = 'div', detached) {
        this.events = new Events();
        this.classes = [];
        this.timers = [];
        this.loops = [];
        if (typeof name !== 'undefined') {
            if (typeof name === 'string') {
                this.name = name;
                this.type = type;
                if (type === 'svg') {
                    const qualifiedName = detached || 'svg';
                    detached = true;
                    this.element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
                    this.element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
                } else {
                    this.element = document.createElement(type);
                    if (name.charAt(0) !== '.') this.element.id = name;
                    else this.element.className = name.substr(1);
                }
                this.element.style.position = 'absolute';
                if (!detached) document.body.appendChild(this.element);
            } else {
                this.element = name;
            }
            this.element.object = this;
        }
    }

    initClass(object, ...params) {
        const child = new object(...params);
        this.add(child);
        return child;
    }

    add(child) {
        if (child.destroy) {
            this.classes.push(child);
            child.parent = this;
        }
        if (child.element) this.element.appendChild(child.element);
        else if (child.nodeName) this.element.appendChild(child);
        return this;
    }

    delayedCall(callback, time = 0, ...params) {
        if (!this.timers) return;
        const timer = Timer.create(() => {
            if (callback) callback(...params);
        }, time);
        this.timers.push(timer);
        if (this.timers.length > 50) this.timers.shift();
        return timer;
    }

    clearTimers() {
        for (let i = this.timers.length - 1; i >= 0; i--) Timer.clearTimeout(this.timers[i]);
        this.timers.length = 0;
    }

    startRender(callback, fps) {
        this.loops.push(callback);
        Render.start(callback, fps);
    }

    stopRender(callback) {
        this.loops.remove(callback);
        Render.stop(callback);
    }

    clearRenders() {
        for (let i = this.loops.length - 1; i >= 0; i--) this.stopRender(this.loops[i]);
        this.loops.length = 0;
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
        this.element.object = null;
        this.clearRenders();
        this.clearTimers();
        this.events.destroy();
        return Utils.nullObject(this);
    }

    remove(child) {
        if (child.element) child.element.parentNode.removeChild(child.element);
        else if (child.nodeName) child.parentNode.removeChild(child);
        this.classes.remove(child);
    }

    create(name, type) {
        const child = new Interface(name, type);
        this.add(child);
        return child;
    }

    clone() {
        return new Interface(this.element.cloneNode(true));
    }

    empty() {
        this.element.innerHTML = '';
        return this;
    }

    text(text) {
        if (typeof text === 'undefined') return this.element.textContent;
        else this.element.textContent = text;
        return this;
    }

    html(text) {
        if (typeof text === 'undefined') return this.element.innerHTML;
        else this.element.innerHTML = text;
        return this;
    }

    hide() {
        this.element.style.display = 'none';
        return this;
    }

    show() {
        this.element.style.display = '';
        return this;
    }

    visible() {
        this.element.style.visibility = 'visible';
        return this;
    }

    invisible() {
        this.element.style.visibility = 'hidden';
        return this;
    }

    setZ(z) {
        this.element.style.zIndex = z;
        return this;
    }

    clearOpacity() {
        this.element.style.opacity = '';
        return this;
    }

    size(w, h = w, noScale) {
        if (typeof h === 'boolean') {
            noScale = h;
            h = w;
        }
        if (typeof w !== 'undefined') {
            if (typeof w === 'string' || typeof h === 'string') {
                if (typeof w !== 'string') w = w + 'px';
                if (typeof h !== 'string') h = h + 'px';
                this.element.style.width = w;
                this.element.style.height = h;
            } else {
                this.element.style.width = w + 'px';
                this.element.style.height = h + 'px';
                if (!noScale) this.element.style.backgroundSize = w + 'px ' + h + 'px';
            }
        }
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        return this;
    }

    mouseEnabled(bool) {
        this.element.style.pointerEvents = bool ? 'auto' : 'none';
        return this;
    }

    fontStyle(fontFamily, fontSize, color, fontStyle) {
        this.css({ fontFamily, fontSize, color, fontStyle });
        return this;
    }

    bg(src, x, y, repeat) {
        if (~src.indexOf('.')) src = Assets.getPath(src);
        if (src.includes(['data:', '.'])) this.element.style.backgroundImage = 'url(' + src + ')';
        else this.element.style.backgroundColor = src;
        if (typeof x !== 'undefined') {
            x = typeof x === 'number' ? x + 'px' : x;
            y = typeof y === 'number' ? y + 'px' : y;
            this.element.style.backgroundPosition = x + ' ' + y;
        }
        if (repeat) {
            this.element.style.backgroundSize = '';
            this.element.style.backgroundRepeat = repeat;
        }
        if (x === 'cover' || x === 'contain') {
            repeat = typeof repeat === 'number' ? repeat + 'px' : repeat;
            this.element.style.backgroundSize = x;
            this.element.style.backgroundRepeat = 'no-repeat';
            this.element.style.backgroundPosition = typeof y !== 'undefined' ? y + ' ' + repeat : 'center';
        }
        return this;
    }

    center(x, y, noPos) {
        const css = {};
        if (typeof x === 'undefined') {
            css.left = '50%';
            css.top = '50%';
            css.marginLeft = -this.width / 2;
            css.marginTop = -this.height / 2;
        } else {
            if (x) {
                css.left = '50%';
                css.marginLeft = -this.width / 2;
            }
            if (y) {
                css.top = '50%';
                css.marginTop = -this.height / 2;
            }
        }
        if (noPos) {
            delete css.left;
            delete css.top;
        }
        this.css(css);
        return this;
    }

    mask(src) {
        this.element.style.mask = (~src.indexOf('.') ? 'url(' + src + ')' : src) + ' no-repeat';
        this.element.style.maskSize = 'contain';
        return this;
    }

    blendMode(mode, bg) {
        this.element.style[bg ? 'background-blend-mode' : 'mix-blend-mode'] = mode;
        return this;
    }

    css(props, value) {
        if (typeof props !== 'object') {
            if (!value) {
                let style = this.element.style[props];
                if (typeof style !== 'number') {
                    if (~style.indexOf('px')) style = Number(style.slice(0, -2));
                    if (props === 'opacity') style = !isNaN(Number(this.element.style.opacity)) ? Number(this.element.style.opacity) : 1;
                }
                return style || 0;
            } else {
                this.element.style[props] = value;
                return this;
            }
        }
        for (let key in props) {
            let val = props[key];
            if (!(typeof val === 'string' || typeof val === 'number')) continue;
            if (typeof val !== 'string' && key !== 'opacity' && key !== 'zIndex') val += 'px';
            this.element.style[key] = val;
        }
        return this;
    }

    transform(props) {
        if (!props) props = this;
        else for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        this.element.style.transform = TweenManager.parseTransform(props);
        return this;
    }

    willChange(props) {
        const string = typeof props === 'string';
        if (props) this.element.style.willChange = string ? props : 'transform, opacity';
        else this.element.style.willChange = '';
    }

    backfaceVisibility(visible) {
        if (visible) this.element.style.backfaceVisibility = 'visible';
        else this.element.style.backfaceVisibility = 'hidden';
        return this;
    }

    enable3D(perspective, x, y) {
        this.element.style.transformStyle = 'preserve-3d';
        if (perspective) this.element.style.perspective = perspective + 'px';
        if (typeof x !== 'undefined') {
            x = typeof x === 'number' ? x + 'px' : x;
            y = typeof y === 'number' ? y + 'px' : y;
            this.element.style.perspectiveOrigin = x + ' ' + y;
        }
        return this;
    }

    disable3D() {
        this.element.style.transformStyle = '';
        this.element.style.perspective = '';
        return this;
    }

    transformPoint(x, y, z) {
        let origin = '';
        if (typeof x !== 'undefined') origin += typeof x === 'number' ? x + 'px' : x;
        if (typeof y !== 'undefined') origin += typeof y === 'number' ? ' ' + y + 'px' : ' ' + y;
        if (typeof z !== 'undefined') origin += typeof z === 'number' ? ' ' + z + 'px' : ' ' + z;
        this.element.style.transformOrigin = origin;
        return this;
    }

    tween(props, time, ease, delay, callback) {
        if (typeof delay !== 'number') {
            callback = delay;
            delay = 0;
        }
        let promise = null;
        if (typeof Promise !== 'undefined') {
            promise = Promise.create();
            if (callback) promise.then(callback);
            callback = promise.resolve;
        }
        const tween = new CSSTransition(this, props, time, ease, delay, callback);
        return promise || tween;
    }

    clearTransform() {
        if (typeof this.x === 'number') this.x = 0;
        if (typeof this.y === 'number') this.y = 0;
        if (typeof this.z === 'number') this.z = 0;
        if (typeof this.scale === 'number') this.scale = 1;
        if (typeof this.scaleX === 'number') this.scaleX = 1;
        if (typeof this.scaleY === 'number') this.scaleY = 1;
        if (typeof this.rotation === 'number') this.rotation = 0;
        if (typeof this.rotationX === 'number') this.rotationX = 0;
        if (typeof this.rotationY === 'number') this.rotationY = 0;
        if (typeof this.rotationZ === 'number') this.rotationZ = 0;
        if (typeof this.skewX === 'number') this.skewX = 0;
        if (typeof this.skewY === 'number') this.skewY = 0;
        this.element.style.transform = '';
        return this;
    }

    clearTween() {
        if (this.cssTween) this.cssTween.stop();
        if (this.mathTween) this.mathTween.stop();
        return this;
    }

    attr(attr, value) {
        if (typeof value === 'undefined') return this.element.getAttribute(attr);
        if (value === '') this.element.removeAttribute(attr);
        else this.element.setAttribute(attr, value);
        return this;
    }

    convertTouchEvent(e) {
        const touch = {};
        touch.x = 0;
        touch.y = 0;
        if (!e) return touch;
        if (e.touches || e.changedTouches) {
            if (e.touches.length) {
                touch.x = e.touches[0].pageX;
                touch.y = e.touches[0].pageY;
            } else {
                touch.x = e.changedTouches[0].pageX;
                touch.y = e.changedTouches[0].pageY;
            }
        } else {
            touch.x = e.pageX;
            touch.y = e.pageY;
        }
        return touch;
    }

    click(callback) {
        const click = e => {
            if (!this.element) return false;
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'click';
            if (callback) callback(e);
        };
        this.element.addEventListener('click', click, true);
        this.element.style.cursor = 'pointer';
        return this;
    }

    hover(callback) {
        const hover = e => {
            if (!this.element) return false;
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = e.type === 'mouseout' ? 'out' : 'over';
            if (callback) callback(e);
        };
        this.element.addEventListener('mouseover', hover, true);
        this.element.addEventListener('mouseout', hover, true);
        return this;
    }

    bind(event, callback) {
        if (event === 'touchstart' && !Device.mobile) event = 'mousedown';
        else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';
        else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
        if (!this.events['bind_' + event]) this.events['bind_' + event] = [];
        const events = this.events['bind_' + event];
        events.push({ target: this.element, callback });

        const touchEvent = e => {
            const touch = this.convertTouchEvent(e);
            if (!(e instanceof MouseEvent)) {
                e.x = touch.x;
                e.y = touch.y;
            }
            events.forEach(event => {
                if (event.target === e.currentTarget) event.callback(e);
            });
        };

        if (!this.events['fn_' + event]) {
            this.events['fn_' + event] = touchEvent;
            this.element.addEventListener(event, touchEvent, true);
        }
        return this;
    }

    unbind(event, callback) {
        if (event === 'touchstart' && !Device.mobile) event = 'mousedown';
        else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';
        else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
        const events = this.events['bind_' + event];
        if (!events) return this;
        events.forEach((event, i) => {
            if (event.callback === callback) events.splice(i, 1);
        });
        if (this.events['fn_' + event] && !events.length) {
            this.element.removeEventListener(event, this.events['fn_' + event], true);
            this.events['fn_' + event] = null;
        }
        return this;
    }

    interact(overCallback, clickCallback) {
        this.hit = this.create('.hit');
        this.hit.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 99999
        });
        if (Device.mobile) this.hit.touchClick(overCallback, clickCallback);
        else this.hit.hover(overCallback).click(clickCallback);
        return this;
    }

    touchClick(hover, click) {
        const start = {};
        let time, move, touch;

        const findDistance = (p1, p2) => {
            const dx = p2.x - p1.x,
                dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        const touchMove = e => {
            if (!this.element) return false;
            touch = this.convertTouchEvent(e);
            move = findDistance(start, touch) > 5;
        };

        const setTouch = e => {
            const touchEvent = this.convertTouchEvent(e);
            e.touchX = touchEvent.x;
            e.touchY = touchEvent.y;
            start.x = e.touchX;
            start.y = e.touchY;
        };

        const touchStart = e => {
            if (!this.element) return false;
            time = performance.now();
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'over';
            setTouch(e);
            if (hover && !move) hover(e);
        };

        const touchEnd = e => {
            if (!this.element) return false;
            const t = performance.now();
            e.object = this.element.className === 'hit' ? this.parent : this;
            setTouch(e);
            if (time && t - time < 750 && click && !move) {
                e.action = 'click';
                click(e);
            }
            if (hover) {
                e.action = 'out';
                hover(e);
            }
            move = false;
        };

        this.element.addEventListener('touchmove', touchMove, { passive: true });
        this.element.addEventListener('touchstart', touchStart, { passive: true });
        this.element.addEventListener('touchend', touchEnd, { passive: true });
        return this;
    }

    touchSwipe(callback, distance = 75) {
        const move = {};
        let startX, startY,
            moving = false;

        const touchStart = e => {
            const touch = this.convertTouchEvent(e);
            if (e.touches.length === 1) {
                startX = touch.x;
                startY = touch.y;
                moving = true;
                this.element.addEventListener('touchmove', touchMove, { passive: true });
            }
        };

        const touchMove = e => {
            if (moving) {
                const touch = this.convertTouchEvent(e),
                    dx = startX - touch.x,
                    dy = startY - touch.y;
                move.direction = null;
                move.moving = null;
                move.x = null;
                move.y = null;
                move.evt = e;
                if (Math.abs(dx) >= distance) {
                    touchEnd();
                    move.direction = dx > 0 ? 'left' : 'right';
                } else if (Math.abs(dy) >= distance) {
                    touchEnd();
                    move.direction = dy > 0 ? 'up' : 'down';
                } else {
                    move.moving = true;
                    move.x = dx;
                    move.y = dy;
                }
                if (callback) callback(move, e);
            }
        };

        const touchEnd = () => {
            startX = startY = moving = false;
            this.element.removeEventListener('touchmove', touchMove);
        };

        this.element.addEventListener('touchstart', touchStart, { passive: true });
        this.element.addEventListener('touchend', touchEnd, { passive: true });
        this.element.addEventListener('touchcancel', touchEnd, { passive: true });
        return this;
    }

    preventScroll() {
        if (!Device.mobile) return;
        const preventScroll = e => {
            let target = e.target;
            if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA' || target.nodeName === 'SELECT' || target.nodeName === 'A') return;
            let prevent = true;
            while (target.parentNode && prevent) {
                if (target.scrollParent) prevent = false;
                target = target.parentNode;
            }
            if (prevent) e.preventDefault();
        };
        this.element.addEventListener('touchstart', preventScroll, { passive: false });
    }

    overflowScroll(direction) {
        if (!Device.mobile) return;
        const x = !!direction.x,
            y = !!direction.y,
            overflow = {
                '-webkit-overflow-scrolling': 'touch'
            };
        if (!x && !y || x && y) overflow.overflow = 'scroll';
        if (!x && y) {
            overflow.overflowY = 'scroll';
            overflow.overflowX = 'hidden';
        }
        if (x && !y) {
            overflow.overflowX = 'scroll';
            overflow.overflowY = 'hidden';
        }
        this.css(overflow);
        this.element.scrollParent = true;
        this.element.preventEvent = e => e.stopPropagation();
        this.bind('touchmove', this.element.preventEvent);
    }

    removeOverflowScroll() {
        if (!Device.mobile) return;
        this.css({
            overflow: 'hidden',
            overflowX: '',
            overflowY: '',
            '-webkit-overflow-scrolling': ''
        });
        this.unbind('touchmove', this.element.preventEvent);
    }

    split(by = '') {
        const style = {
                position: 'relative',
                display: 'inline-block',
                width: 'auto',
                height: 'auto',
                margin: 0,
                padding: 0
            },
            array = [],
            split = this.text().split(by);
        this.empty();
        if (by === ' ') by = '&nbsp;';
        for (let i = 0; i < split.length; i++) {
            if (split[i] === ' ') split[i] = '&nbsp;';
            array.push(this.create('.t', 'span').html(split[i]).css(style));
            if (by !== '' && i < split.length - 1) array.push(this.create('.t', 'span').html(by).css(style));
        }
        return array;
    }
}

/**
 * Accelerometer helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Accelerometer {

    static init() {

        if (!this.active) {
            this.active = true;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.alpha = 0;
            this.beta = 0;
            this.gamma = 0;
            this.heading = 0;
            this.rotationRate = {};
            this.rotationRate.alpha = 0;
            this.rotationRate.beta = 0;
            this.rotationRate.gamma = 0;
            this.toRadians = Device.os === 'ios' ? Math.PI / 180 : 1;

            const updateAccel = e => {
                switch (window.orientation) {
                    case 0:
                        this.x = -e.accelerationIncludingGravity.x;
                        this.y = e.accelerationIncludingGravity.y;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = e.rotationRate.beta * this.toRadians;
                            this.rotationRate.beta = -e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                    case 180:
                        this.x = e.accelerationIncludingGravity.x;
                        this.y = -e.accelerationIncludingGravity.y;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = -e.rotationRate.beta * this.toRadians;
                            this.rotationRate.beta = e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                    case 90:
                        this.x = e.accelerationIncludingGravity.y;
                        this.y = e.accelerationIncludingGravity.x;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.beta = e.rotationRate.beta * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                    case -90:
                        this.x = -e.accelerationIncludingGravity.y;
                        this.y = -e.accelerationIncludingGravity.x;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = -e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.beta = -e.rotationRate.beta * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                }
            };

            const updateOrientation = e => {
                for (let key in e) if (~key.toLowerCase().indexOf('heading')) this.heading = e[key];
                switch (window.orientation) {
                    case 0:
                        this.alpha = e.beta * this.toRadians;
                        this.beta = -e.alpha * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                    case 180:
                        this.alpha = -e.beta * this.toRadians;
                        this.beta = e.alpha * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                    case 90:
                        this.alpha = e.alpha * this.toRadians;
                        this.beta = e.beta * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                    case -90:
                        this.alpha = -e.alpha * this.toRadians;
                        this.beta = -e.beta * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                }
                this.tilt = e.beta * this.toRadians;
                this.yaw = e.alpha * this.toRadians;
                this.roll = -e.gamma * this.toRadians;
                if (Device.os === 'Android') this.heading = compassHeading(e.alpha, e.beta, e.gamma);
            };

            const compassHeading = (alpha, beta, gamma) => {
                const degtorad = Math.PI / 180,
                    x = beta ? beta * degtorad : 0,
                    y = gamma ? gamma * degtorad : 0,
                    z = alpha ? alpha * degtorad : 0,
                    cY = Math.cos(y),
                    cZ = Math.cos(z),
                    sX = Math.sin(x),
                    sY = Math.sin(y),
                    sZ = Math.sin(z),
                    Vx = -cZ * sY - sZ * sX * cY,
                    Vy = -sZ * sY + cZ * sX * cY;
                let compassHeading = Math.atan(Vx / Vy);
                if (Vy < 0) compassHeading += Math.PI;
                else if (Vx < 0) compassHeading += 2 * Math.PI;
                return compassHeading * (180 / Math.PI);
            };

            window.addEventListener('devicemotion', updateAccel);
            window.addEventListener('deviceorientation', updateOrientation);

            this.stop = () => {
                this.active = false;
                window.removeEventListener('devicemotion', updateAccel);
                window.removeEventListener('deviceorientation', updateOrientation);
            };
        }
    }
}

/**
 * Mouse interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Mouse {

    static init() {

        if (!this.active) {
            this.active = true;
            this.x = 0;
            this.y = 0;
            this.normal = {
                x: 0,
                y: 0
            };
            this.tilt = {
                x: 0,
                y: 0
            };
            this.inverseNormal = {
                x: 0,
                y: 0
            };

            const update = e => {
                this.x = e.x;
                this.y = e.y;
                this.normal.x = e.x / Stage.width;
                this.normal.y = e.y / Stage.height;
                this.tilt.x = this.normal.x * 2 - 1;
                this.tilt.y = 1 - this.normal.y * 2;
                this.inverseNormal.x = this.normal.x;
                this.inverseNormal.y = 1 - this.normal.y;
            };

            this.input = Stage.initClass(Interaction);
            Stage.events.add(this.input, Interaction.START, update);
            Stage.events.add(this.input, Interaction.MOVE, update);
            update({
                x: Stage.width / 2,
                y: Stage.height / 2
            });

            this.stop = () => {
                this.active = false;
                Stage.events.remove(this.input, Interaction.START, update);
                Stage.events.remove(this.input, Interaction.MOVE, update);
            };
        }
    }
}

/**
 * Web audio engine.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

class WebAudio {

    static init() {

        class Sound {

            constructor(asset) {
                const self = this;

                this.asset = Assets.getPath(asset);
                if (WebAudio.context.createStereoPanner) this.stereo = WebAudio.context.createStereoPanner();
                this.output = WebAudio.context.createGain();
                this.volume = 1;
                this.rate = 1;
                if (this.stereo) this.stereo.connect(this.output);
                this.output.connect(WebAudio.output);
                this.output.gain.setValueAtTime(0, WebAudio.context.currentTime);

                this.gain = {
                    set value(value) {
                        self.volume = value;
                        self.output.gain.linearRampToValueAtTime(value, WebAudio.context.currentTime + 0.015);
                    },
                    get value() {
                        return self.volume;
                    }
                };

                this.playbackRate = {
                    set value(value) {
                        self.rate = value;
                        if (self.source) self.source.playbackRate.linearRampToValueAtTime(value, WebAudio.context.currentTime + 0.015);
                    },
                    get value() {
                        return self.rate;
                    }
                };

                this.stereoPan = {
                    set value(value) {
                        self.pan = value;
                        if (self.stereo) self.stereo.pan.linearRampToValueAtTime(value, WebAudio.context.currentTime + 0.015);
                    },
                    get value() {
                        return self.pan;
                    }
                };

                this.stop = () => {
                    if (this.source) {
                        this.source.stop();
                        this.playing = false;
                    }
                };
            }
        }

        if (!this.active) {
            this.active = true;

            const self = this;
            const sounds = {};
            let context;

            if (window.AudioContext) {
                context = new AudioContext();
                this.output = context.createGain();
                this.volume = 1;
                this.output.connect(context.destination);
                this.gain = {
                    set value(value) {
                        self.volume = value;
                        self.output.gain.linearRampToValueAtTime(value, context.currentTime + 0.015);
                    },
                    get value() {
                        return self.volume;
                    }
                };
                this.context = context;
            }

            this.loadSound = (id, callback) => {
                const promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
                const sound = this.getSound(id);
                window.fetch(sound.asset).then(response => {
                    if (!response.ok) return callback();
                    response.arrayBuffer().then(data => {
                        context.decodeAudioData(data, buffer => {
                            sound.buffer = buffer;
                            sound.complete = true;
                            callback();
                        }, () => {
                            callback();
                        });
                    });
                }).catch(() => {
                    callback();
                });
                sound.ready = () => promise;
            };

            this.createSound = (id, asset, callback) => {
                sounds[id] = new Sound(asset);
                if (Device.os === 'ios' && callback) callback();
                else this.loadSound(id, callback);
                return sounds[id];
            };

            this.getSound = id => {
                return sounds[id];
            };

            this.trigger = id => {
                if (!context) return;
                if (context.state === 'suspended') context.resume();
                const sound = this.getSound(id);
                if (!sound.ready) this.loadSound(id);
                sound.ready().then(() => {
                    if (sound.complete) {
                        if (sound.stopping && sound.loop) {
                            sound.stopping = false;
                            return;
                        }
                        sound.playing = true;
                        sound.source = context.createBufferSource();
                        sound.source.buffer = sound.buffer;
                        sound.source.loop = sound.loop;
                        sound.source.playbackRate.setValueAtTime(sound.rate, context.currentTime);
                        sound.source.connect(sound.stereo ? sound.stereo : sound.output);
                        sound.source.start();
                        sound.output.gain.linearRampToValueAtTime(sound.volume, context.currentTime + 0.015);
                    }
                });
            };

            this.play = (id, volume = 1, loop) => {
                if (!context) return;
                if (typeof volume === 'boolean') {
                    loop = volume;
                    volume = 1;
                }
                const sound = this.getSound(id);
                if (sound) {
                    sound.volume = volume;
                    sound.loop = !!loop;
                    this.trigger(id);
                }
            };

            this.fadeInAndPlay = (id, volume, loop, time, ease, delay = 0) => {
                if (!context) return;
                const sound = this.getSound(id);
                if (sound) {
                    sound.volume = 0;
                    sound.loop = !!loop;
                    this.trigger(id);
                    TweenManager.tween(sound.gain, { value: volume }, time, ease, delay);
                }
            };

            this.fadeOutAndStop = (id, time, ease, delay = 0) => {
                if (!context) return;
                const sound = this.getSound(id);
                if (sound && sound.playing) {
                    TweenManager.tween(sound.gain, { value: 0 }, time, ease, delay, () => {
                        if (!sound.stopping) return;
                        sound.stopping = false;
                        sound.stop();
                    });
                    sound.stopping = true;
                }
            };

            this.remove = id => {
                const sound = this.getSound(id);
                if (sound && sound.source) {
                    sound.source.buffer = null;
                    sound.source.stop();
                    sound.source.disconnect();
                    sound.source = null;
                    sound.playing = false;
                    delete sounds[id];
                }
            };

            this.mute = () => {
                if (!context) return;
                TweenManager.tween(this.gain, { value: 0 }, 300, 'easeOutSine');
            };

            this.unmute = () => {
                if (!context) return;
                TweenManager.tween(this.gain, { value: 1 }, 500, 'easeOutSine');
            };

            this.stop = () => {
                this.active = false;
                if (!context) return;
                for (let id in sounds) {
                    const sound = sounds[id];
                    if (sound) sound.stop();
                }
                context.close();
            };
        }

        window.WebAudio = this;
    }
}

/**
 * Stage instance.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

const Stage = new (class extends Interface {

    constructor() {
        super('Stage');
        const self = this;
        let last;

        initHTML();
        addListeners();

        function initHTML() {
            self.css({ overflow: 'hidden' });
            self.preventScroll();
        }

        function addListeners() {
            window.addEventListener('focus', focus);
            window.addEventListener('blur', blur);
            window.addEventListener('keydown', keyDown);
            window.addEventListener('keyup', keyUp);
            window.addEventListener('keypress', keyPress);
            window.addEventListener('resize', resize);
            window.addEventListener('orientationchange', resize);
            resize();
        }

        function focus() {
            if (last !== 'focus') {
                last = 'focus';
                Events.emitter.fire(Events.VISIBILITY, { type: 'focus' });
            }
        }

        function blur() {
            if (last !== 'blur') {
                last = 'blur';
                Events.emitter.fire(Events.VISIBILITY, { type: 'blur' });
            }
        }

        function keyDown(e) {
            Events.emitter.fire(Events.KEYBOARD_DOWN, e);
        }

        function keyUp(e) {
            Events.emitter.fire(Events.KEYBOARD_UP, e);
        }

        function keyPress(e) {
            Events.emitter.fire(Events.KEYBOARD_PRESS, e);
        }

        function resize(e) {
            self.size();
            self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            Events.emitter.fire(Events.RESIZE, e);
        }

        this.destroy = () => {
            if (Accelerometer.active) Accelerometer.stop();
            if (Mouse.active) Mouse.stop();
            if (WebAudio.active) WebAudio.stop();
            window.removeEventListener('focus', focus);
            window.removeEventListener('blur', blur);
            window.removeEventListener('keydown', keyDown);
            window.removeEventListener('keyup', keyUp);
            window.removeEventListener('keypress', keyPress);
            window.removeEventListener('resize', resize);
            window.removeEventListener('orientationchange', resize);
            return super.destroy();
        };
    }
})();

/**
 * 2D vector.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Vector2 {

    constructor(x, y) {
        this.x = typeof x === 'number' ? x : 0;
        this.y = typeof y === 'number' ? y : 0;
        this.type = 'vector2';
    }

    set(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        return this;
    }

    clear() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    copyTo(v) {
        v.x = this.x;
        v.y = this.y;
        return this;
    }

    copy(v) {
        this.x = v.x || 0;
        this.y = v.y || 0;
        return this;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y || 0.00001;
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    }

    setLength(length) {
        this.normalize().multiplyScalar(length);
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }

    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    subScalar(s) {
        this.x -= s;
        this.y -= s;
        return this;
    }

    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    }

    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }

    multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        return this;
    }

    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    divideScalar(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }

    perpendicular() {
        const tx = this.x,
            ty = this.y;
        this.x = -ty;
        this.y = tx;
        return this;
    }

    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    }

    deltaLerp(v, alpha, delta = 1) {
        for (let i = 0; i < delta; i++) this.lerp(v, alpha);
        return this;
    }

    interp(v, alpha, ease, dist = 5000) {
        if (!this.calc) this.calc = new Vector2();
        this.calc.subVectors(this, v);
        const fn = Interpolation.convertEase(ease),
            a = fn(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
        return this.lerp(v, a);
    }

    setAngleRadius(a, r) {
        this.x = Math.cos(a) * r;
        this.y = Math.sin(a) * r;
        return this;
    }

    addAngleRadius(a, r) {
        this.x += Math.cos(a) * r;
        this.y += Math.sin(a) * r;
        return this;
    }

    dot(a, b = this) {
        return a.x * b.x + a.y * b.y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    distanceTo(v, noSq) {
        const dx = this.x - v.x,
            dy = this.y - v.y;
        if (!noSq) return Math.sqrt(dx * dx + dy * dy);
        return dx * dx + dy * dy;
    }

    solveAngle(a, b = this) {
        return Math.atan2(a.y - b.y, a.x - b.x);
    }

    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    toString(split = ' ') {
        return this.x + split + this.y;
    }
}

/**
 * Interaction helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Interaction extends Component {

    constructor(object = Stage) {

        if (!Interaction.initialized) {
            Interaction.CLICK = 'interaction_click';
            Interaction.START = 'interaction_start';
            Interaction.MOVE  = 'interaction_move';
            Interaction.DRAG  = 'interaction_drag';
            Interaction.END   = 'interaction_end';

            const events = {
                    touchstart: [],
                    touchmove: [],
                    touchend: []
                },
                touchStart = e => events.touchstart.forEach(callback => callback(e)),
                touchMove = e => events.touchmove.forEach(callback => callback(e)),
                touchEnd = e => events.touchend.forEach(callback => callback(e));

            Interaction.bind = (event, callback) => events[event].push(callback);
            Interaction.unbind = (event, callback) => events[event].remove(callback);

            Stage.bind('touchstart', touchStart);
            Stage.bind('touchmove', touchMove);
            Stage.bind('touchend', touchEnd);
            Stage.bind('touchcancel', touchEnd);

            Interaction.initialized = true;
        }

        super();
        const self = this;
        let distance, timeDown, timeMove;

        this.x = 0;
        this.y = 0;
        this.hold = new Vector2();
        this.last = new Vector2();
        this.delta = new Vector2();
        this.move = new Vector2();
        this.velocity = new Vector2();

        addListeners();

        function addListeners() {
            if (object === Stage) Interaction.bind('touchstart', down);
            else object.bind('touchstart', down);
            Interaction.bind('touchmove', move);
            Interaction.bind('touchend', up);
        }

        function down(e) {
            self.isTouching = true;
            self.x = e.x;
            self.y = e.y;
            self.hold.x = self.last.x = e.x;
            self.hold.y = self.last.y = e.y;
            self.delta.x = self.move.x = self.velocity.x = 0;
            self.delta.y = self.move.y = self.velocity.y = 0;
            distance = 0;
            self.events.fire(Interaction.START, e, true);
            timeDown = timeMove = Render.TIME;
        }

        function move(e) {
            if (self.isTouching) {
                self.move.x = e.x - self.hold.x;
                self.move.y = e.y - self.hold.y;
            }
            self.x = e.x;
            self.y = e.y;
            self.delta.x = e.x - self.last.x;
            self.delta.y = e.y - self.last.y;
            self.last.x = e.x;
            self.last.y = e.y;
            distance += self.delta.length();
            const delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
            timeMove = Render.TIME;
            self.velocity.x = Math.abs(self.delta.x) / delta;
            self.velocity.y = Math.abs(self.delta.y) / delta;
            self.events.fire(Interaction.MOVE, e, true);
            if (self.isTouching) self.events.fire(Interaction.DRAG, e, true);
        }

        function up(e) {
            if (!self.isTouching) return;
            self.isTouching = false;
            self.move.x = 0;
            self.move.y = 0;
            const delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
            if (delta > 100) {
                self.delta.x = 0;
                self.delta.y = 0;
            }
            self.events.fire(Interaction.END, e, true);
            if (distance < 20 && Render.TIME - timeDown < 2000) self.events.fire(Interaction.CLICK, e, true);
        }

        this.destroy = () => {
            Interaction.unbind('touchstart', down);
            Interaction.unbind('touchmove', move);
            Interaction.unbind('touchend', up);
            if (object !== Stage && object.unbind) object.unbind('touchstart', down);
            return super.destroy();
        };
    }
}

/**
 * Asset loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class AssetLoader extends Component {

    constructor(assets, callback) {

        if (Array.isArray(assets)) {
            assets = (() => {
                const keys = assets.map(path => {
                    return Utils.basename(path);
                });
                return keys.reduce((o, k, i) => {
                    o[k] = assets[i];
                    return o;
                }, {});
            })();
        }

        super();
        const self = this;
        const total = Object.keys(assets).length;
        let loaded = 0;

        for (let key in assets) loadAsset(key, assets[key]);

        function loadAsset(key, path) {
            const ext = Utils.extension(path);
            if (ext.includes(['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                Assets.createImage(path, assetLoaded);
                return;
            }
            if (ext.includes(['mp3', 'm4a', 'ogg', 'wav', 'aif'])) {
                if (!window.AudioContext || !window.WebAudio) return assetLoaded();
                window.WebAudio.createSound(key, path, assetLoaded);
                return;
            }
            window.get(Assets.getPath(path), Assets.OPTIONS).then(data => {
                if (ext === 'json') Assets.storeData(key, data);
                if (ext === 'js') window.eval(data.replace('use strict', ''));
                assetLoaded();
            }).catch(() => {
                assetLoaded();
            });
        }

        function assetLoaded() {
            self.percent = ++loaded / total;
            self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
            if (loaded === total) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE, null, true);
            if (callback) callback();
        }
    }

    static loadAssets(assets, callback) {
        const promise = Promise.create();
        if (!callback) callback = promise.resolve;
        promise.loader = new AssetLoader(assets, callback);
        return promise;
    }
}

/**
 * Loader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * State dispatcher.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Storage helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Canvas values.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasValues {

    constructor(style) {
        this.styles = {};
        if (!style) this.data = new Float32Array(6);
        else this.styled = false;
    }

    setTRSA(x, y, r, sx, sy, a) {
        const m = this.data;
        m[0] = x;
        m[1] = y;
        m[2] = r;
        m[3] = sx;
        m[4] = sy;
        m[5] = a;
    }

    calculate(values) {
        const v = values.data,
            m = this.data;
        m[0] = m[0] + v[0];
        m[1] = m[1] + v[1];
        m[2] = m[2] + v[2];
        m[3] = m[3] * v[3];
        m[4] = m[4] * v[4];
        m[5] = m[5] * v[5];
    }

    calculateStyle(parent) {
        if (!parent.styled) return false;
        this.styled = true;
        const values = parent.values;
        for (let key in values) if (!this.styles[key]) this.styles[key] = values[key];
    }

    set shadowOffsetX(val) {
        this.styled = true;
        this.styles.shadowOffsetX = val;
    }

    get shadowOffsetX() {
        return this.styles.shadowOffsetX;
    }

    set shadowOffsetY(val) {
        this.styled = true;
        this.styles.shadowOffsetY = val;
    }

    get shadowOffsetY() {
        return this.styles.shadowOffsetY;
    }

    set shadowBlur(val) {
        this.styled = true;
        this.styles.shadowBlur = val;
    }

    get shadowBlur() {
        return this.styles.shadowBlur;
    }

    set shadowColor(val) {
        this.styled = true;
        this.styles.shadowColor = val;
    }

    get shadowColor() {
        return this.styles.shadowColor;
    }

    get values() {
        return this.styles;
    }
}

/**
 * Canvas object.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasObject {

    constructor() {
        this.visible = true;
        this.blendMode = 'source-over';
        this.x = 0;
        this.y = 0;
        this.px = 0;
        this.py = 0;
        this.clipX = 0;
        this.clipY = 0;
        this.clipWidth = 0;
        this.clipHeight = 0;
        this.width = 0;
        this.height = 0;
        this.rotation = 0;
        this.scale = 1;
        this.opacity = 1;
        this.values = new CanvasValues();
        this.styles = new CanvasValues(true);
        this.children = [];
    }

    updateValues() {
        this.values.setTRSA(this.x, this.y, Math.radians(this.rotation), this.scaleX || this.scale, this.scaleY || this.scale, this.opacity);
        if (this.parent.values) this.values.calculate(this.parent.values);
        if (this.parent.styles) this.styles.calculateStyle(this.parent.styles);
    }

    render(override) {
        if (!this.visible) return false;
        this.updateValues();
        if (this.draw) this.draw(override);
        for (let i = 0; i < this.children.length; i++) this.children[i].render(override);
    }

    startDraw(ox = 0, oy = 0, override) {
        const context = this.canvas.context,
            v = this.values.data,
            x = v[0] + ox,
            y = v[1] + oy;
        context.save();
        if (!override) context.globalCompositeOperation = this.blendMode;
        context.translate(x, y);
        context.rotate(v[2]);
        context.scale(v[3], v[4]);
        context.globalAlpha = v[5];
        if (this.styles.styled) {
            const values = this.styles.values;
            for (let key in values) context[key] = values[key];
        }
    }

    endDraw() {
        this.canvas.context.restore();
    }

    add(child) {
        child.setCanvas(this.canvas);
        child.parent = this;
        this.children.push(child);
        child.z = this.children.length;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        for (let i = 0; i < this.children.length; i++) this.children[i].setCanvas(canvas);
    }

    remove(child) {
        child.canvas = null;
        child.parent = null;
        this.children.remove(child);
    }

    isMask() {
        let obj = this;
        while (obj) {
            if (obj.masked) return true;
            obj = obj.parent;
        }
        return false;
    }

    unmask() {
        this.masked.mask(null);
        this.masked = null;
    }

    setZ(z) {
        this.z = z;
        this.parent.children.sort((a, b) => {
            return a.z - b.z;
        });
    }

    follow(object) {
        this.x = object.x;
        this.y = object.y;
        this.px = object.px;
        this.py = object.py;
        this.clipX = object.clipX;
        this.clipY = object.clipY;
        this.clipWidth = object.clipWidth;
        this.clipHeight = object.clipHeight;
        this.width = object.width;
        this.height = object.height;
        this.rotation = object.rotation;
        this.scale = object.scale;
        this.scaleX = object.scaleX || object.scale;
        this.scaleY = object.scaleY || object.scale;
        return this;
    }

    visible() {
        this.visible = true;
        return this;
    }

    invisible() {
        this.visible = false;
        return this;
    }

    transform(props) {
        for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        return this;
    }

    transformPoint(x, y) {
        this.px = typeof x === 'number' ? x : this.width * (parseFloat(x) / 100);
        this.py = typeof y === 'number' ? y : this.height * (parseFloat(y) / 100);
        return this;
    }

    clip(x, y, w, h) {
        this.clipX = x;
        this.clipY = y;
        this.clipWidth = w;
        this.clipHeight = h;
        return this;
    }

    destroy() {
        if (this.children) for (let i = this.children.length - 1; i >= 0; i--) this.children[i].destroy();
        return Utils.nullObject(this);
    }
}

/**
 * Canvas graphics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasGraphics extends CanvasObject {

    constructor(w = 0, h = w) {
        super();
        const self = this;
        let draw = [],
            mask;

        this.width = w;
        this.height = h;
        this.props = {};

        function setProperties(context) {
            for (let key in self.props) context[key] = self.props[key];
        }

        this.draw = override => {
            if (this.isMask() && !override) return false;
            const context = this.canvas.context;
            this.startDraw(this.px, this.py, override);
            setProperties(context);
            if (this.clipWidth && this.clipHeight) {
                context.beginPath();
                context.rect(this.clipX, this.clipY, this.clipWidth, this.clipHeight);
                context.clip();
            }
            for (let i = 0; i < draw.length; i++) {
                const cmd = draw[i];
                if (!cmd) continue;
                const fn = cmd.shift();
                context[fn].apply(context, cmd);
                cmd.unshift(fn);
            }
            this.endDraw();
            if (mask) {
                context.globalCompositeOperation = mask.blendMode;
                mask.render(true);
            }
        };

        this.clear = () => {
            for (let i = draw.length - 1; i >= 0; i--) draw[i].length = 0;
            draw.length = 0;
        };

        this.arc = (x = 0, y = 0, radius = this.radius || this.width / 2, startAngle = 0, endAngle = Math.PI * 2, anti = false) => {
            if (x && !y) {
                startAngle = Math.radians(-90), endAngle = x;
                x = 0;
                y = 0;
            }
            draw.push(['arc', x, y, radius, startAngle, endAngle, anti]);
        };

        this.quadraticCurveTo = (cpx, cpy, x, y) => {
            draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
        };

        this.bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
            draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
        };

        this.fillRect = (x, y, w, h) => {
            draw.push(['fillRect', x, y, w, h]);
        };

        this.clearRect = (x, y, w, h) => {
            draw.push(['clearRect', x, y, w, h]);
        };

        this.strokeRect = (x, y, w, h) => {
            draw.push(['strokeRect', x, y, w, h]);
        };

        this.moveTo = (x, y) => {
            draw.push(['moveTo', x, y]);
        };

        this.lineTo = (x, y) => {
            draw.push(['lineTo', x, y]);
        };

        this.stroke = () => {
            draw.push(['stroke']);
        };

        this.fill = () => {
            if (!mask) draw.push(['fill']);
        };

        this.beginPath = () => {
            draw.push(['beginPath']);
        };

        this.closePath = () => {
            draw.push(['closePath']);
        };

        this.fillText = (text, x = 0, y = 0) => {
            draw.push(['fillText', text, x, y]);
        };

        this.strokeText = (text, x = 0, y = 0) => {
            draw.push(['strokeText', text, x, y]);
        };

        this.setLineDash = value => {
            draw.push(['setLineDash', value]);
        };

        this.drawImage = (img, sx = 0, sy = 0, sWidth = img.width, sHeight = img.height, dx = 0, dy = 0, dWidth = img.width, dHeight = img.height) => {
            draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx + -this.px, dy + -this.py, dWidth, dHeight]);
        };

        this.mask = object => {
            if (!object) return mask = null;
            mask = object;
            object.masked = this;
            for (let i = 0; i < draw.length; i++) {
                if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                    draw[i].length = 0;
                    draw.splice(i, 1);
                }
            }
        };

        this.clone = () => {
            const object = new CanvasGraphics(this.width, this.height);
            object.visible = this.visible;
            object.blendMode = this.blendMode;
            object.opacity = this.opacity;
            object.follow(this);
            object.props = Utils.cloneObject(this.props);
            object.setDraw(Utils.cloneArray(draw));
            return object;
        };

        this.setDraw = array => {
            draw = array;
        };
    }

    set strokeStyle(val) {
        this.props.strokeStyle = val;
    }

    get strokeStyle() {
        return this.props.strokeStyle;
    }

    set fillStyle(val) {
        this.props.fillStyle = val;
    }

    get fillStyle() {
        return this.props.fillStyle;
    }

    set lineWidth(val) {
        this.props.lineWidth = val;
    }

    get lineWidth() {
        return this.props.lineWidth;
    }

    set lineCap(val) {
        this.props.lineCap = val;
    }

    get lineCap() {
        return this.props.lineCap;
    }

    set lineDashOffset(val) {
        this.props.lineDashOffset = val;
    }

    get lineDashOffset() {
        return this.props.lineDashOffset;
    }

    set lineJoin(val) {
        this.props.lineJoin = val;
    }

    get lineJoin() {
        return this.props.lineJoin;
    }

    set miterLimit(val) {
        this.props.miterLimit = val;
    }

    get miterLimit() {
        return this.props.miterLimit;
    }

    set font(val) {
        this.props.font = val;
    }

    get font() {
        return this.props.font;
    }

    set textAlign(val) {
        this.props.textAlign = val;
    }

    get textAlign() {
        return this.props.textAlign;
    }

    set textBaseline(val) {
        this.props.textBaseline = val;
    }

    get textBaseline() {
        return this.props.textBaseline;
    }
}

/**
 * Canvas interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Canvas {

    constructor(w, h = w, retina, whiteAlpha) {

        if (typeof h === 'boolean') {
            retina = h;
            h = w;
        }

        const self = this;

        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.object = new Interface(this.element);
        this.children = [];
        this.retina = retina;

        size(w, h);

        function size(w, h) {
            const ratio = retina ? 2 : 1;
            self.element.width = w * ratio;
            self.element.height = h * ratio;
            self.width = w;
            self.height = h;
            self.scale = ratio;
            self.object.size(self.width, self.height);
            self.context.scale(ratio, ratio);
            self.element.style.width = w + 'px';
            self.element.style.height = h + 'px';
            if (whiteAlpha) {
                const alpha = new CanvasGraphics(self.width, self.height);
                alpha.fillStyle = 'rgba(255, 255, 255, 0.002)';
                alpha.fillRect(0, 0, self.width, self.height);
                alpha.setCanvas(self);
                alpha.parent = self;
                self.children[0] = alpha;
                alpha.z = 1;
            }
        }

        this.size = size;

        this.toDataURL = (type, quality) => {
            return this.element.toDataURL(type, quality);
        };

        this.render = noClear => {
            if (!(typeof noClear === 'boolean' && noClear)) this.clear();
            for (let i = 0; i < this.children.length; i++) this.children[i].render();
        };

        this.clear = () => {
            this.context.clearRect(0, 0, this.element.width, this.element.height);
        };

        this.add = child => {
            child.setCanvas(this);
            child.parent = this;
            this.children.push(child);
            child.z = this.children.length;
        };

        this.remove = child => {
            child.canvas = null;
            child.parent = null;
            this.children.remove(child);
        };

        this.destroy = () => {
            if (this.children) for (let i = this.children.length - 1; i >= 0; i--) this.children[i].destroy();
            this.object.destroy();
            return Utils.nullObject(this);
        };

        this.getImageData = (x = 0, y = 0, w = this.element.width, h = this.element.height) => {
            this.imageData = this.context.getImageData(x, y, w, h);
            return this.imageData;
        };

        this.getPixel = (x, y, dirty) => {
            if (!this.imageData || dirty) this.getImageData();
            const imgData = {},
                index = (x + y * this.element.width) * 4,
                pixels = this.imageData.data;
            imgData.r = pixels[index];
            imgData.g = pixels[index + 1];
            imgData.b = pixels[index + 2];
            imgData.a = pixels[index + 3];
            return imgData;
        };

        this.putImageData = imageData => {
            this.context.putImageData(imageData, 0, 0);
        };
    }
}

/**
 * Canvas texture.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasTexture extends CanvasObject {

    constructor(texture, w = 0, h = w) {
        super();
        const self = this;
        let mask;

        this.width = w;
        this.height = h;

        initTexture();

        function initTexture() {
            if (typeof texture === 'string') {
                Assets.loadImage(texture).then(image => {
                    self.texture = image;
                    setDimensions();
                });
            } else {
                self.texture = texture;
                setDimensions();
            }
        }

        function setDimensions() {
            if (self.onload) self.onload();
            if (!self.width && !self.height) {
                self.width = self.texture.width;
                self.height = self.texture.height;
            }
        }

        this.draw = override => {
            if (this.isMask() && !override) return false;
            const context = this.canvas.context;
            if (this.texture) {
                this.startDraw(this.px, this.py, override);
                context.drawImage(this.texture, -this.px, -this.py, this.width, this.height);
                this.endDraw();
            }
            if (mask) {
                context.globalCompositeOperation = 'source-in';
                mask.render(true);
                context.globalCompositeOperation = 'source-over';
            }
        };

        this.mask = object => {
            if (!object) return mask = null;
            mask = object;
            object.masked = this;
        };
    }
}

/**
 * Canvas font utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Color helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * SVG interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Background video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Scroll interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Scroll lock.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Slide interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Slide video.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Slide loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Webcam interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!navigator.getUserMedia) navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

/**
 * Webcam motion tracker.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Linked list.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Object pool.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * 3D vector.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * 3D utilities with texture promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

/**
 * Raycaster.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

/**
 * 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Screen projection.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

/**
 * Shader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

/**
 * Post processing effects.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

/**
 * Euler integrator.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Particle physics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Particle.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Random Euler rotation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Wiggle behavior.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

class AlienKittyCanvas extends Interface {

    constructor() {
        super('AlienKittyCanvas');
        const self = this;
        let canvas, alienkitty, eyelid1, eyelid2;

        initHTML();
        initCanvas();
        initImages();

        function initHTML() {
            self.size(90, 86).css({ opacity: 0 });
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, 90, 86, true);
        }

        function initImages() {
            Promise.all([
                Assets.loadImage('assets/images/alienkitty.svg'),
                Assets.loadImage('assets/images/alienkitty_eyelid.svg')
            ]).then(finishSetup);
        }

        function finishSetup(img) {
            alienkitty = self.initClass(CanvasTexture, img[0], 90, 86);
            eyelid1 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
            alienkitty.add(eyelid1);
            alienkitty.add(eyelid2);
            canvas.add(alienkitty);
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function loop() {
            canvas.render();
        }

        this.animateIn = () => {
            blink();
            this.tween({ opacity: 1 }, 500, 'easeOutQuart');
            this.startRender(loop);
        };

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 500, 'easeInOutQuad', () => {
                this.stopRender(loop);
                this.clearTimers();
                if (callback) callback();
            });
        };
    }
}

class Progress extends Interface {

    constructor() {
        super('Progress');
        const self = this;
        const size = 90;
        let canvas, circle;

        initHTML();
        initCanvas();
        initCircle();
        this.startRender(loop);

        function initHTML() {
            self.size(size);
            self.progress = 0;
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, size, true);
        }

        function initCircle() {
            circle = self.initClass(CanvasGraphics);
            circle.x = size / 2;
            circle.y = size / 2;
            circle.radius = size * 0.4;
            circle.lineWidth = 1.5;
            circle.strokeStyle = Config.UI_COLOR;
            canvas.add(circle);
        }

        function drawCircle() {
            circle.clear();
            const endAngle = Math.radians(-90) + Math.radians(self.progress * 360);
            circle.beginPath();
            circle.arc(endAngle);
            circle.stroke();
        }

        function loop() {
            if (self.complete) return;
            if (self.progress >= 1) complete();
            drawCircle();
            canvas.render();
        }

        function complete() {
            self.complete = true;
            self.events.fire(Events.COMPLETE);
            self.stopRender(loop);
        }

        this.update = e => {
            if (this.complete) return;
            TweenManager.tween(this, { progress: e.percent }, 500, 'easeOutCubic');
        };

        this.animateOut = callback => {
            this.tween({ scale: 0.9, opacity: 0 }, 400, 'easeInCubic', callback);
        };
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        const self = this;
        let loader, progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.size('100%');
        }

        function initLoader() {
            loader = self.initClass(AssetLoader, Config.ASSETS);
            self.events.add(loader, Events.PROGRESS, loadUpdate);
        }

        function initProgress() {
            progress = self.initClass(Progress);
            progress.center();
            self.events.add(progress, Events.COMPLETE, loadComplete);
        }

        function loadUpdate(e) {
            progress.update(e);
        }

        function loadComplete() {
            self.events.fire(Events.COMPLETE);
        }

        this.animateOut = callback => {
            progress.animateOut(callback);
        };
    }
}

class Main {

    constructor({ container }) {

        container.appendChild(Stage.element);

        let loader, wrapper, alienkitty;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%').enable3D(2000);
            wrapper = Stage.create('.wrapper');
            wrapper.size('100%').transform({ z: -300 }).enable3D();
            alienkitty = wrapper.initClass(AlienKittyCanvas);
            alienkitty.center();
        }

        function initLoader() {
            loader = Stage.initClass(Loader);
            Stage.events.add(loader, Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            loader.animateOut(() => {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            wrapper.tween({ z: 0 }, 7000, 'easeOutCubic');
            alienkitty.animateIn();
        }
    }
}

return Main;

})));
