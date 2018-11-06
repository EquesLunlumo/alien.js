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
        for (let obj of objects) Object.assign(object, obj);
        return object;
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
            Events.COMPLETE       = 'complete';
            Events.PROGRESS       = 'progress';
            Events.UPDATE         = 'update';
            Events.LOADED         = 'loaded';
            Events.ERROR          = 'error';
            Events.READY          = 'ready';
            Events.RESIZE         = 'resize';
            Events.CLICK          = 'click';
            Events.HOVER          = 'hover';
            Events.FULLSCREEN     = 'fullscreen';
            Events.KEYBOARD_PRESS = 'keyboard_press';
            Events.KEYBOARD_DOWN  = 'keyboard_down';
            Events.KEYBOARD_UP    = 'keyboard_up';

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
        if (this.mobile) {
            this.tablet = Math.max(window.screen ? screen.width : window.innerWidth, window.screen ? screen.height : window.innerHeight) > 1000;
            this.phone = !this.tablet;
        }
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

        this.playing = true;

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
                    tweenComplete();
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

        function tweenComplete() {
            self.playing = false;
            Timer.create(() => {
                if (killed()) return;
                if (object.cssTween && !object.cssTween.playing) clearCSSTween();
            }, 1000);
            if (callback) callback();
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
            if (typeof name === 'string' || !name) {
                this.name = name;
                this.type = type;
                if (type === 'svg') {
                    const qualifiedName = detached || 'svg';
                    detached = true;
                    this.element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
                } else {
                    this.element = document.createElement(type);
                    if (name.charAt(0) !== '.') this.element.id = name;
                    else this.element.className = name.substr(1);
                    this.element.style.position = 'absolute';
                }
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
            if (typeof value === 'undefined') {
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

    attr(props, value) {
        if (typeof props !== 'object') {
            if (typeof value === 'undefined') return this.element.getAttribute(props);
            if (value === '') this.element.removeAttribute(props);
            else this.element.setAttribute(props, value);
            return this;
        }
        for (let key in props) {
            const val = props[key];
            if (!(typeof val === 'string' || typeof val === 'number')) continue;
            this.element.setAttribute(key, val);
        }
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

        if (Device.mobile) {
            this.element.addEventListener('touchstart', touchStart, { passive: true });
            this.element.addEventListener('touchend', touchEnd, { passive: true });
            this.element.addEventListener('touchcancel', touchEnd, { passive: true });
        }
        return this;
    }

    overflowScroll(direction) {
        const x = !!direction.x,
            y = !!direction.y,
            overflow = {};
        if ((!x && !y) || (x && y)) overflow.overflow = 'scroll';
        if (!x && y) {
            overflow.overflowY = 'scroll';
            overflow.overflowX = 'hidden';
        }
        if (x && !y) {
            overflow.overflowX = 'scroll';
            overflow.overflowY = 'hidden';
        }
        if (Device.mobile) {
            overflow['-webkit-overflow-scrolling'] = 'touch';
            this.element.scrollParent = true;
            this.element.preventEvent = e => e.stopPropagation();
            this.bind('touchmove', this.element.preventEvent);
        }
        this.css(overflow);
    }

    removeOverflowScroll() {
        this.css({
            overflow: 'hidden',
            overflowX: '',
            overflowY: '',
            '-webkit-overflow-scrolling': ''
        });
        if (Device.mobile) this.unbind('touchmove', this.element.preventEvent);
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
        }

        function addListeners() {
            window.addEventListener('focus', focus);
            window.addEventListener('blur', blur);
            window.addEventListener('keydown', keyDown);
            window.addEventListener('keyup', keyUp);
            window.addEventListener('keypress', keyPress);
            window.addEventListener('resize', resize);
            window.addEventListener('orientationchange', resize);
            if (Device.mobile) window.addEventListener('touchstart', preventScroll, { passive: false });
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

        function preventScroll(e) {
            let target = e.target;
            if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA' || target.nodeName === 'SELECT' || target.nodeName === 'A') return;
            let prevent = true;
            while (target.parentNode && prevent) {
                if (target.scrollParent) prevent = false;
                target = target.parentNode;
            }
            if (prevent) e.preventDefault();
        }

        this.allowScroll = () => {
            if (Device.mobile) window.removeEventListener('touchstart', preventScroll, { passive: false });
        };

        this.destroy = () => {
            if (this.Accelerometer && this.Accelerometer.active) this.Accelerometer.stop();
            if (this.Mouse && this.Mouse.active) this.Mouse.stop();
            if (this.WebAudio && this.WebAudio.active) this.WebAudio.stop();
            window.removeEventListener('focus', focus);
            window.removeEventListener('blur', blur);
            window.removeEventListener('keydown', keyDown);
            window.removeEventListener('keyup', keyUp);
            window.removeEventListener('keypress', keyPress);
            window.removeEventListener('resize', resize);
            window.removeEventListener('orientationchange', resize);
            if (Device.mobile) window.removeEventListener('touchstart', preventScroll, { passive: false });
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

        Stage.Accelerometer = this;
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

        Stage.Mouse = this;
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
                return keys.reduce((object, key, i) => {
                    object[key] = assets[i];
                    return object;
                }, {});
            })();
        }

        super();
        const self = this;
        let total = Object.keys(assets).length,
            loaded = 0;

        for (let key in assets) loadAsset(key, assets[key]);

        function loadAsset(key, path) {
            const ext = Utils.extension(path);
            if (ext.includes(['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                Assets.createImage(path, increment);
                return;
            }
            if (ext.includes(['mp3', 'm4a', 'ogg', 'wav', 'aif'])) {
                if (!window.AudioContext || !Stage.WebAudio) return increment();
                Stage.WebAudio.createSound(key, path, increment);
                return;
            }
            window.get(Assets.getPath(path), Assets.OPTIONS).then(data => {
                if (ext === 'json') Assets.storeData(key, data);
                if (ext === 'js') window.eval(data.replace('use strict', ''));
                increment();
            }).catch(() => {
                increment();
            });
        }

        function increment() {
            self.percent = ++loaded / total;
            self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
            if (loaded === total) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE, null, true);
            if (callback) callback();
        }

        this.add = (num = 1) => {
            total += num;
        };

        this.trigger = (num = 1) => {
            for (let i = 0; i < num; i++) increment();
        };
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

class MultiLoader extends Component {

    constructor() {
        super();
        const self = this;
        const loaders = [];
        let loaded = 0;

        function progress() {
            let percent = 0;
            for (let i = 0; i < loaders.length; i++) percent += loaders[i].percent || 0;
            percent /= loaders.length;
            self.events.fire(Events.PROGRESS, { percent }, true);
        }

        function complete() {
            if (++loaded === loaders.length) self.events.fire(Events.COMPLETE, null, true);
        }

        this.push = loader => {
            loaders.push(loader);
            this.events.add(loader, Events.PROGRESS, progress);
            this.events.add(loader, Events.COMPLETE, complete);
        };

        this.complete = () => {
            this.events.fire(Events.PROGRESS, { percent: 1 }, true);
            this.events.fire(Events.COMPLETE, null, true);
        };
    }
}

/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class FontLoader extends Component {

    constructor(fonts, callback) {

        fonts = fonts.map(font => {
            if (typeof font !== 'object') return {
                style: 'normal',
                variant: 'normal',
                weight: 'normal',
                family: font.replace(/"/g, '\'')
            };
            return font;
        });

        super();
        const self = this;
        let context,
            loaded = 0;

        initFonts();

        function initFonts() {
            context = document.createElement('canvas').getContext('2d');
            fonts.forEach(font => {
                font.specifier = (({ style = 'normal', variant = 'normal', weight = 'normal', family }) => {
                    return `${style} ${variant} ${weight} 12px "${family}"`;
                })(font);
            });
            if (document.fonts) {
                fonts.forEach(font => {
                    document.fonts.load(font.specifier).then(() => {
                        renderText(font.specifier);
                        fontLoaded();
                    }).catch(() => {
                        fontLoaded();
                    });
                });
            } else {
                fonts.forEach(font => renderText(font.specifier));
                self.delayedCall(() => {
                    self.percent = 1;
                    self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
                    self.events.fire(Events.COMPLETE, null, true);
                    if (callback) callback();
                }, 500);
            }
        }

        function renderText(specifier) {
            context.font = specifier;
            context.fillText('LOAD', 0, 0);
        }

        function fontLoaded() {
            self.percent = ++loaded / fonts.length;
            self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
            if (loaded === fonts.length) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE, null, true);
            if (callback) callback();
        }
    }

    static loadFonts(fonts, callback) {
        const promise = Promise.create();
        if (!callback) callback = promise.resolve;
        promise.loader = new FontLoader(fonts, callback);
        return promise;
    }
}

/**
 * Fullscreen controller.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Fullscreen extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new Fullscreen();
        return this.singleton;
    }

    constructor() {
        super();
        const self = this;

        this.opened = false;

        addListeners();

        function addListeners() {
            [
                'onfullscreenchange',
                'onwebkitfullscreenchange',
                'onmozfullscreenchange',
                'onmsfullscreenchange',
                'onfullscreenerror',
                'onwebkitfullscreenerror',
                'onmozfullscreenerror',
                'onmsfullscreenerror'
            ].forEach(event => {
                if (typeof document[event] !== 'undefined') document[event] = update;
            });
        }

        function update() {
            const opened = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            if (opened === self.opened) return;
            self.opened = opened;
            Events.emitter.fire(Events.FULLSCREEN, { fullscreen: self.opened });
        }

        this.open = element => {
            element = element || document.body;
            [
                'requestFullscreen',
                'webkitRequestFullscreen',
                'mozRequestFullScreen',
                'msRequestFullscreen'
            ].every(method => {
                if (typeof element[method] === 'undefined') return true;
                element[method]();
            });
        };

        this.close = () => {
            [
                'exitFullscreen',
                'webkitExitFullscreen',
                'mozCancelFullScreen',
                'msExitFullscreen'
            ].every(method => {
                if (typeof document[method] === 'undefined') return true;
                document[method]();
            });
        };

        this.destroy = () => {
            this.close();
            return super.destroy();
        };
    }
}

/**
 * State dispatcher.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class StateDispatcher extends Component {

    constructor(hash) {
        super();
        const self = this;
        let storePath, storeState,
            rootPath = '/';

        this.locked = false;

        addListeners();
        storePath = getPath();

        function addListeners() {
            if (hash) window.addEventListener('hashchange', hashChange);
            else window.addEventListener('popstate', popState);
        }

        function hashChange() {
            handleStateChange(null, getPath());
        }

        function popState(e) {
            handleStateChange(e.state, getPath());
        }

        function getPath() {
            if (hash) return location.hash.slice(3);
            return (rootPath !== '/' ? location.pathname.split(rootPath)[1] : location.pathname.slice(1)) || '';
        }

        function handleStateChange(state, path) {
            if (path === storePath) return;
            if (self.locked) {
                if (!storePath) return;
                if (hash) location.hash = '!/' + storePath;
                else history.pushState(storeState, null, rootPath + storePath);
                return;
            }
            storePath = path;
            storeState = state;
            self.events.fire(Events.UPDATE, { value: state, path }, true);
        }

        this.getState = () => {
            const path = getPath();
            return { value: storeState, path };
        };

        this.setRoot = root => {
            rootPath = root.charAt(0) === '/' ? root : '/' + root;
        };

        this.setState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path === storePath) return;
            storePath = path;
            storeState = state;
            if (hash) location.hash = '!/' + path;
            else history.pushState(state, null, rootPath + path);
        };

        this.replaceState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path === storePath) return;
            storePath = path;
            storeState = state;
            if (hash) location.hash = '!/' + path;
            else history.replaceState(state, null, rootPath + path);
        };

        this.setTitle = title => document.title = title;

        this.lock = () => this.locked = true;

        this.unlock = () => this.locked = false;

        this.useHash = () => hash = true;

        this.destroy = () => {
            window.removeEventListener('hashchange', hashChange);
            window.removeEventListener('popstate', popState);
            return super.destroy();
        };
    }
}

/**
 * Storage helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Storage {

    static set(key, value) {
        if (value !== null && typeof value === 'object') value = JSON.stringify(value);
        if (value === null) window.localStorage.removeItem(key);
        else window.localStorage[key] = value;
        return value;
    }

    static get(key) {
        let value = window.localStorage[key];
        if (value) {
            let char0;
            if (value.charAt) char0 = value.charAt(0);
            if (char0 === '{' || char0 === '[') value = JSON.parse(value);
            if (value === 'true' || value === 'false') value = value === 'true';
        }
        return value;
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

            constructor(path) {
                const self = this;

                this.path = Assets.getPath(path);
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
                window.fetch(sound.path, Assets.OPTIONS).then(response => {
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

            this.createSound = (id, path, callback) => {
                sounds[id] = new Sound(path);
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

        Stage.WebAudio = this;
    }
}

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

        function size(w, h = w) {
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

class CanvasFont {

    static createText(canvas, width, height, str, font, fillStyle, { textBaseline = 'alphabetic', lineHeight = height, letterSpacing = 0, textAlign = 'start' }) {
        const context = canvas.context;
        if (height === lineHeight) {
            return createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign);
        } else {
            const text = new CanvasGraphics(width, height),
                words = str.split(' '),
                lines = [];
            let line = '';
            text.totalWidth = 0;
            text.totalHeight = 0;
            context.font = font;
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ',
                    characters = testLine.split('');
                let testWidth = 0;
                for (let i = 0; i < characters.length; i++) testWidth += context.measureText(characters[i]).width + letterSpacing;
                if (testWidth > width && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);
            lines.forEach((line, i) => {
                const graphics = createText(canvas, width, lineHeight, line.slice(0, -1), font, fillStyle, textBaseline, letterSpacing, textAlign);
                graphics.y = i * lineHeight;
                text.add(graphics);
                text.totalWidth = Math.max(graphics.totalWidth, text.totalWidth);
                text.totalHeight += lineHeight;
            });
            return text;
        }

        function createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign) {
            const context = canvas.context,
                graphics = new CanvasGraphics(width, height);
            graphics.font = font;
            graphics.fillStyle = fillStyle;
            graphics.textBaseline = textBaseline;
            graphics.totalWidth = 0;
            graphics.totalHeight = height;
            const characters = str.split('');
            let chr,
                index = 0,
                currentPosition = 0;
            context.font = font;
            for (let i = 0; i < characters.length; i++) graphics.totalWidth += context.measureText(characters[i]).width + letterSpacing;
            switch (textAlign) {
                case 'start':
                case 'left':
                    currentPosition = 0;
                    break;
                case 'end':
                case 'right':
                    currentPosition = width - graphics.totalWidth;
                    break;
                case 'center':
                    currentPosition = (width - graphics.totalWidth) / 2;
                    break;
            }
            do {
                chr = characters[index++];
                graphics.fillText(chr, currentPosition, 0);
                currentPosition += context.measureText(chr).width + letterSpacing;
            } while (index < str.length);
            return graphics;
        }
    }
}

/**
 * Color helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Color {

    constructor(value) {
        const self = this;

        this.r = 1;
        this.g = 1;
        this.b = 1;

        set(value);

        function set(value) {
            if (value instanceof Color) copy(value);
            else if (typeof value === 'number') setHex(value);
            else if (Array.isArray(value)) setRGB(value);
            else setHex(Number('0x' + value.slice(1)));
        }

        function copy(color) {
            self.r = color.r;
            self.g = color.g;
            self.b = color.b;
        }

        function setHex(hex) {
            hex = Math.floor(hex);
            self.r = (hex >> 16 & 255) / 255;
            self.g = (hex >> 8 & 255) / 255;
            self.b = (hex & 255) / 255;
        }

        function setRGB(values) {
            self.r = values[0];
            self.g = values[1];
            self.b = values[2];
        }

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            else if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
            return p;
        }

        this.set = value => {
            set(value);
            return this;
        };

        this.setRGB = (r, g, b) => {
            this.r = r;
            this.g = g;
            this.b = b;
            return this;
        };

        this.setHSL = (h, s, l) => {
            if (s === 0) {
                this.r = this.g = this.b = l;
            } else {
                const p = l <= 0.5 ? l * (1 + s) : l + s - l * s,
                    q = 2 * l - p;
                this.r = hue2rgb(q, p, h + 1 / 3);
                this.g = hue2rgb(q, p, h);
                this.b = hue2rgb(q, p, h - 1 / 3);
            }
            return this;
        };

        this.offsetHSL = (h, s, l) => {
            const hsl = this.getHSL();
            hsl.h += h;
            hsl.s += s;
            hsl.l += l;
            this.setHSL(hsl.h, hsl.s, hsl.l);
            return this;
        };

        this.getStyle = a => {
            if (a) return 'rgba(' + (this.r * 255 | 0) + ', ' + (this.g * 255 | 0) + ', ' + (this.b * 255 | 0) + ', ' + a + ')';
            else return 'rgb(' + (this.r * 255 | 0) + ', ' + (this.g * 255 | 0) + ', ' + (this.b * 255 | 0) + ')';
        };

        this.getHex = () => {
            return this.r * 255 << 16 ^ this.g * 255 << 8 ^ this.b * 255 << 0;
        };

        this.getHexString = () => {
            return '#' + ('000000' + this.getHex().toString(16)).slice(-6);
        };

        this.getHSL = () => {
            if (!this.hsl) this.hsl = { h: 0, s: 0, l: 0 };
            const hsl = this.hsl,
                r = this.r,
                g = this.g,
                b = this.b,
                min = Math.min(r, g, b),
                max = Math.max(r, g, b),
                lightness = (min + max) / 2;
            let hue, saturation;
            if (min === max) {
                hue = 0;
                saturation = 0;
            } else {
                const delta = max - min;
                saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
                switch (max) {
                    case r:
                        hue = (g - b) / delta + (g < b ? 6 : 0);
                        break;
                    case g:
                        hue = (b - r) / delta + 2;
                        break;
                    case b:
                        hue = (r - g) / delta + 4;
                        break;
                }
                hue /= 6;
            }
            hsl.h = hue;
            hsl.s = saturation;
            hsl.l = lightness;
            return hsl;
        };

        this.add = color => {
            this.r += color.r;
            this.g += color.g;
            this.b += color.b;
            return this;
        };

        this.mix = (color, percent) => {
            this.r *= (1 - percent) + color.r * percent;
            this.g *= (1 - percent) + color.g * percent;
            this.b *= (1 - percent) + color.b * percent;
            return this;
        };

        this.addScalar = s => {
            this.r += s;
            this.g += s;
            this.b += s;
            return this;
        };

        this.sub = color => {
            this.r -= color.r;
            this.g -= color.g;
            this.b -= color.b;
            return this;
        };

        this.subScalar = s => {
            this.r -= s;
            this.g -= s;
            this.b -= s;
            return this;
        };

        this.multiply = color => {
            this.r *= color.r;
            this.g *= color.g;
            this.b *= color.b;
            return this;
        };

        this.multiplyScalar = s => {
            this.r *= s;
            this.g *= s;
            this.b *= s;
            return this;
        };

        this.divide = color => {
            this.r /= color.r;
            this.g /= color.g;
            this.b /= color.b;
            return this;
        };

        this.divideScalar = s => {
            this.r /= s;
            this.g /= s;
            this.b /= s;
            return this;
        };

        this.clone = () => {
            return new Color([this.r, this.g, this.b]);
        };

        this.toArray = () => {
            if (!this.array) this.array = [];
            this.array[0] = this.r;
            this.array[1] = this.g;
            this.array[2] = this.b;
            return this.array;
        };

        this.random = () => {
            let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            if (color.length < 7) color = this.random();
            return color;
        };
    }
}

/**
 * SVG interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class SVG extends Interface {

    constructor(type = 'svg') {
        super(null, 'svg', type);

        this.x = 0;
        this.y = 0;
        this.px = 0;
        this.py = 0;
        this.width = 0;
        this.height = 0;
    }

    size(w, h = w) {
        this.width = w;
        this.height = h;
        this.element.setAttribute('width', w);
        this.element.setAttribute('height', h);
        return this;
    }

    transform(props) {
        for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        let transforms = '';
        if (this.x || this.y) transforms += 'translate(' + (this.x + this.px) + ' ' + (this.y + this.py) + ')';
        if (typeof this.scale !== 'undefined') {
            transforms += 'scale(' + this.scale + ')';
        } else if (typeof this.scaleX !== 'undefined' || typeof this.scaleY !== 'undefined') {
            const scaleX = this.scaleX || 1,
                scaleY = this.scaleY || 1;
            let scale = '';
            scale += scaleX + ' ';
            scale += scaleY;
            transforms += 'scale(' + scale + ')';
        }
        if (typeof this.rotation !== 'undefined') transforms += 'rotate(' + this.rotation + ')';
        if (this.x || this.y) transforms += 'translate(-' + (this.x + this.px) + ' -' + (this.y + this.py) + ')';
        this.element.setAttribute('transform', transforms);
        return this;
    }

    transformPoint(x, y) {
        this.px = typeof x === 'number' ? x : this.width * (parseFloat(x) / 100);
        this.py = typeof y === 'number' ? y : this.height * (parseFloat(y) / 100);
        return this;
    }

    attr(props, value) {
        if (typeof props !== 'object') {
            this[props] = value;
            return super.attr(props, value);
        }
        for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        return super.attr(props, value);
    }
}

/**
 * Video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Video extends Component {

    constructor(params) {

        if (!Video.initialized) {
            Video.PLAY = 'video_play';
            Video.PAUSE = 'video_pause';
            Video.ENDED = 'video_ended';
            Video.PLAYING = 'video_playing';
            Video.PROGRESS = 'video_progress';
            Video.WAITING = 'video_waiting';
            Video.UPDATE = 'video_update';

            Video.initialized = true;
        }

        super();
        const self = this;
        const ready = Promise.create(),
            loaded = Promise.create();
        let object, video, loadingState, listeners,
            initialPlay = true;

        this.playing = false;

        initParameters();
        createElement();
        addListeners();

        function initParameters() {
            const defaults = {
                preload: false,
                autoplay: false,
                muted: true,
                loop: false,
                inline: true,
                controls: false,
                currentTime: 0,
                playback: 1,
                width: 640,
                height: 360,
                events: []
            };
            params = Object.assign(defaults, params);
        }

        function createElement() {
            video = document.createElement('video');
            video.src = Assets.getPath(params.src);
            video.crossorigin = 'anonymous';
            video.preload = params.preload;
            video.autoplay = params.autoplay;
            video.muted = params.autoplay || params.muted;
            video.loop = params.loop;
            video.playsinline = params.inline;
            video.controls = params.controls;
            video.width = params.width;
            video.height = params.height;
            video.defaultMuted = params.muted;
            video.defaultPlaybackRate = params.playback;

            self.element = video;
            object = new Interface(video);
            self.object = object;
            self.width = params.width;
            self.height = params.height;

            if (params.preload) startPreload();
            if (params.autoplay) startPlayback();
        }

        function addListeners() {
            listeners = { play, pause, ended, playing, progress, waiting, timeupdate, loadeddata };
            params.events.push('loadeddata');
            params.events.forEach(event => video.addEventListener(event, listeners[event], true));
        }

        function startPreload() {
            loadingState = true;
            return ready;
        }

        async function startPlayback() {
            loadingState = false;
            await ready;
            if (initialPlay) {
                initialPlay = false;
                video.currentTime = params.currentTime;
            }
            return video.play();
        }

        function play(e) {
            if (loadingState) loadingState = false;
            else self.events.fire(Video.PLAY, e, true);
        }

        function pause(e) {
            self.events.fire(Video.PAUSE, e, true);
        }

        function ended(e) {
            self.events.fire(Video.ENDED, e, true);
        }

        function playing(e) {
            self.events.fire(Video.PLAYING, e, true);
        }

        function progress(e) {
            self.events.fire(Video.PROGRESS, e, true);
        }

        function waiting(e) {
            self.events.fire(Video.WAITING, e, true);
        }

        function timeupdate(e) {
            self.events.fire(Video.UPDATE, e, true);
        }

        function loadeddata() {
            if (video.readyState >= 2) ready.resolve();
            if (video.readyState >= 4) loaded.resolve();
        }

        this.load = async () => {
            return await startPreload();
        };

        this.play = async () => {
            const promise = await startPlayback();
            this.playing = true;
            return promise;
        };

        this.pause = () => {
            this.playing = false;
            video.pause();
        };

        this.stop = () => {
            video.pause();
            this.seek(0);
        };

        this.seek = t => {
            if (video.fastSeek) video.fastSeek(t);
            else video.currentTime = t;
        };

        this.seekExact = t => {
            video.currentTime = t;
        };

        this.volume = v => {
            video.volume = v;
            if (video.muted) video.muted = false;
        };

        this.mute = () => {
            video.muted = true;
        };

        this.unmute = () => {
            video.muted = false;
        };

        this.ready = () => {
            return ready;
        };

        this.loaded = () => {
            return loaded;
        };

        this.size = (w, h) => {
            video.width = this.width = w;
            video.height = this.height = h;
        };

        this.destroy = () => {
            params.events.forEach(event => video.removeEventListener(event, listeners[event], true));
            this.stop();
            video.src = '';
            object.destroy();
            return super.destroy();
        };
    }
}

/**
 * Background video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class BackgroundVideo extends Interface {

    constructor(params) {

        if (!BackgroundVideo.initialized) {
            BackgroundVideo.test = BackgroundVideo.test || !Device.mobile;

            BackgroundVideo.initialized = true;
        }

        super('.BackgroundVideo');
        const self = this;
        let cover, wrapper, video,
            tick = 0;

        this.fade = params.fade !== false;

        initHTML();
        if (BackgroundVideo.test) {
            initVideo();
            if (this.fade) addListeners();
        }

        function initHTML() {
            self.size('100%').mouseEnabled(false);
            cover = self.create('.cover');
            cover.size('100%').bg(params.img || '#000', 'cover');
        }

        function initVideo() {
            wrapper = self.create('.wrapper');
            wrapper.size('100%');
            if (self.fade) wrapper.css({ opacity: 0 });
            video = wrapper.initClass(Video, {
                src: params.src,
                loop: params.loop !== false,
                events: ['timeupdate', 'ended'],
                width: params.width,
                height: params.height,
                preload: true
            });
            video.object.css({ position: 'absolute' });
            self.video = video;
        }

        function addListeners() {
            self.events.add(video, Video.UPDATE, update);
        }

        function update() {
            if (tick++ < 10) return;
            self.events.remove(video, Video.UPDATE, update);
            wrapper.tween({ opacity: params.opacity || 1 }, 500, 'easeOutSine', () => {
                if (!params.opacity) wrapper.clearOpacity();
            });
        }

        this.play = async () => {
            if (!video) return;
            return await video.play();
        };

        this.pause = () => {
            if (!video) return;
            video.pause();
        };

        this.size = (w, h) => {
            if (!video) return;
            video.height = h;
            video.width = video.height * (params.width / params.height);
            if (video.width < w) {
                video.width = w;
                video.height = video.width * (params.height / params.width);
            }
            cover.size(video.width, video.height).center();
            video.object.size(video.width, video.height).center();
        };
    }
}

/**
 * Scroll interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
            self.limit = params.limit !== false;
            if (Array.isArray(params.axes)) axes = params.axes;
            if (self.object) self.object.css({ overflow: 'auto' });
        }

        function addListeners() {
            window.addEventListener('wheel', scroll);
            if (self.hitObject) self.hitObject.bind('touchstart', e => e.preventDefault());
            const input = self.hitObject ? self.initClass(Interaction, self.hitObject) : Mouse.input;
            self.events.add(input, Interaction.START, down);
            self.events.add(input, Interaction.DRAG, drag);
            self.events.add(input, Interaction.END, up);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function stopInertia() {
            TweenManager.clearTween(scrollTarget);
        }

        function scroll(e) {
            if (!self.enabled) return;
            e.preventDefault();
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
                scrollTarget[axis] -= Mouse.input.delta[axis];
            });
        }

        function up() {
            if (!self.enabled) return;
            const m = (() => {
                    if (Device.os === 'android') return 35;
                    return 25;
                })(),
                obj = {};
            axes.forEach(axis => {
                if (!self.max[axis]) return;
                obj[axis] = scrollTarget[axis] - Mouse.input.delta[axis] * m;
            });
            TweenManager.tween(scrollTarget, obj, 2500, 'easeOutQuint');
        }

        function resize() {
            if (!self.enabled) return;
            stopInertia();
            if (!self.object) return;
            const p = {};
            if (Device.mobile) axes.forEach(axis => p[axis] = self.max[axis] ? scrollTarget[axis] / self.max[axis] : 0);
            if (typeof params.height === 'undefined') self.max.y = self.object.element.scrollHeight - self.object.element.clientHeight;
            if (typeof params.width === 'undefined') self.max.x = self.object.element.scrollWidth - self.object.element.clientWidth;
            if (Device.mobile) axes.forEach(axis => self[axis] = scrollTarget[axis] = p[axis] * self.max[axis]);
        }

        function loop() {
            axes.forEach(axis => {
                if (!self.max[axis]) return;
                if (self.limit) scrollTarget[axis] = Math.clamp(scrollTarget[axis], 0, self.max[axis]);
                self.delta[axis] = scrollTarget[axis] - self[axis];
                self[axis] += self.delta[axis];
                if (self.object) {
                    if (axis === 'x') self.object.element.scrollLeft = self.x;
                    if (axis === 'y') self.object.element.scrollTop = self.y;
                }
            });
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

        this.destroy = () => {
            window.removeEventListener('wheel', scroll);
            return super.destroy();
        };
    }
}

/**
 * Scroll lock controller.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class ScrollLock extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new ScrollLock();
        return this.singleton;
    }

    constructor() {
        super();

        this.locked = 0;

        function preventDefault(e) {
            e.preventDefault();
        }

        this.lock = () => {
            if (!this.locked) {
                document.body.style.overflow = 'hidden';
                document.body.addEventListener('touchmove', preventDefault, { passive: false });
            }
            this.locked++;
        };

        this.unlock = () => {
            this.locked--;
            if (!this.locked) {
                document.body.style.overflow = '';
                document.body.removeEventListener('touchmove', preventDefault, { passive: false });
            }
        };

        this.destroy = () => {
            document.body.removeEventListener('touchmove', preventDefault, { passive: false });
            return super.destroy();
        };
    }
}

/**
 * Slide interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

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
            self.isInertia = false;
            TweenManager.clearTween(scrollTarget);
        }

        function scroll(e) {
            if (!self.enabled) return;
            if (e.preventDefault) e.preventDefault();
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
                self.isInertia = true;
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

/**
 * Slide video.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class SlideVideo extends Component {

    constructor(params, callback) {

        if (!SlideVideo.initialized) {
            SlideVideo.test = SlideVideo.test || !Device.mobile && Device.browser !== 'safari' && !Device.detect('trident');

            SlideVideo.initialized = true;
        }

        super();
        const self = this;

        createElement();

        function createElement() {
            const src = params.src;
            if (src && SlideVideo.test) {
                window.fetch(Assets.getPath(src)).then(response => {
                    if (!response.ok) return error();
                    response.blob().then(data => {
                        self.element = document.createElement('video');
                        self.element.src = URL.createObjectURL(data);
                        self.element.muted = true;
                        self.element.loop = true;
                        ready();
                        if (callback) callback();
                    });
                }).catch(() => {
                    error();
                    if (callback) callback();
                });
            } else {
                const img = Assets.createImage(params.img);
                img.onload = () => {
                    self.element = img;
                    if (callback) callback();
                };
                img.onerror = error;
            }
        }

        function error() {
            self.events.fire(Events.ERROR, null, true);
        }

        function ready() {
            self.element.addEventListener('playing', playing);
            self.element.addEventListener('pause', pause);
            self.element.play();
        }

        function playing() {
            self.playing = true;
            self.events.fire(Events.READY, null, true);
        }

        function pause() {
            self.playing = false;
        }

        this.play = () => {
            this.element.play();
        };

        this.pause = () => {
            this.element.pause();
        };

        this.ready = () => {
            return this.element.readyState > this.element.HAVE_CURRENT_DATA;
        };

        this.destroy = () => {
            if (this.element) {
                if (this.element.pause) {
                    this.element.removeEventListener('playing', playing);
                    this.element.removeEventListener('pause', pause);
                    this.pause();
                }
                URL.revokeObjectURL(this.element.src);
                this.element.src = '';
            }
            return super.destroy();
        };
    }
}

/**
 * Slide loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class SlideLoader extends Component {

    constructor(slides, callback) {
        super();
        const self = this;
        let loaded = 0;

        this.list = [];
        this.pathList = [];

        slides.forEach(params => {
            this.list.push(new SlideVideo(params, slideLoaded));
            this.pathList.push(params.path);
        });

        function slideLoaded() {
            self.percent = ++loaded / self.list.length;
            self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
            if (loaded === self.list.length) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE, null, true);
            if (callback) callback();
        }
    }

    static loadSlides(slides, callback) {
        const promise = Promise.create();
        if (!callback) callback = promise.resolve;
        promise.loader = new SlideLoader(slides, callback);
        return promise;
    }
}

/**
 * Webcam interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

if (!navigator.getUserMedia) navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

class Webcam extends Component {

    constructor(width, height, audio) {
        super();
        const self = this;
        this.facing = 'back';
        const cameras = {};
        let back = false,
            attempts = 0;

        createVideo();

        function createVideo() {
            self.element = document.createElement('video');
            self.element.width = width;
            self.element.height = height;
            self.element.autoplay = true;
            self.object = new Interface(self.element);
            self.width = width;
            self.height = height;
            self.object.size(self.width, self.height);
            if (!Device.mobile) self.object.transform({ scaleX: -1 });
        }

        function establishWebcam() {
            if (attempts >= 2) return error();
            lookupDevices().then(() => {
                if (self.stream && self.config.back) self.stream.getTracks()[0].stop();
                navigator.getUserMedia({
                    video: self.config.back ? cameras.back : cameras.front || true,
                    audio
                }, success, error);
            });
            attempts += 1;
        }

        function lookupDevices() {
            const promise = Promise.create();
            if (!Device.mobile) return Promise.resolve();
            navigator.mediaDevices.enumerateDevices().then(devices => {
                devices.forEach(device => {
                    if (device.label.includes('front')) {
                        cameras.front = {
                            deviceId: { exact: device.deviceId }
                        };
                    }
                    if (device.label.includes('back')) {
                        cameras.back = {
                            deviceId: { exact: device.deviceId }
                        };
                        back = true;
                    }
                });
                if (!cameras.front) {
                    cameras.front = {
                        facingMode: 'user'
                    };
                }
                if (!cameras.back) {
                    cameras.back = {
                        facingMode: 'environment'
                    };
                    back = false;
                }
                promise.resolve();
            });
            return promise;
        }

        function success(stream) {
            self.denied = false;
            self.stream = stream;
            if (self.config.back && !back) {
                establishWebcam();
            } else {
                self.element.srcObject = stream;
                self.events.fire(Events.READY, null, true);
            }
        }

        function error() {
            self.denied = true;
            self.events.fire(Events.ERROR, null, true);
        }

        this.createStream = config => {
            attempts = 0;
            this.config = config;
            establishWebcam();
        };

        this.flip = () => {
            if (!back) return;
            let direction;
            if (this.facing === 'front') {
                this.facing = 'back';
                direction = cameras.back;
            } else {
                this.facing = 'front';
                direction = cameras.front;
            }
            this.stream.getTracks()[0].stop();
            navigator.getUserMedia({
                video: direction || true,
                audio
            }, success, error);
        };

        this.size = (w, h) => {
            this.element.width = this.width = w;
            this.element.height = this.height = h;
            this.object.size(this.width, this.height);
        };

        this.getPixels = (w = this.width, h = this.height) => {
            if (!this.canvas) this.canvas = this.initClass(Canvas, w, h);
            this.canvas.context.drawImage(this.element, 0, 0, w, h);
            return this.canvas.context.getImageData(0, 0, w, h);
        };

        this.ready = () => {
            return this.element.readyState > 0;
        };

        this.end = () => {
            this.active = false;
            this.element.pause();
            if (this.stream) this.stream.getTracks()[0].enabled = false;
        };

        this.restart = () => {
            this.element.play();
            if (this.stream) this.stream.getTracks()[0].enabled = true;
            this.active = true;
        };

        this.destroy = () => {
            this.element.src = '';
            this.object.destroy();
            return super.destroy();
        };
    }
}

/**
 * Webcam motion tracker.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class WebcamMotion extends Component {

    constructor(webcam, width = 64, height = 48, threshold = 80, length = 50, fps = 24) {
        super();
        const self = this;
        this.capturing = false;
        const gesture = {
                xDir: null,
                xValue: 0,
                yDir: null,
                yValue: 0
            },
            motion = [],
            average = {},
            lastAverage = {},
            event = {},
            outputAverage = {};
        let oldPixels, outputMotion;

        this.startRender(loop, fps);

        function loop() {
            if (!self.capturing) return;
            process();
            track();
        }

        function process() {
            const pixels = webcam.getPixels(width, height).data;
            if (!oldPixels) return oldPixels = pixels;
            motion.length = 0;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const w = i * width + j,
                        oldR = oldPixels[w * 4 + 0],
                        oldG = oldPixels[w * 4 + 1],
                        oldB = oldPixels[w * 4 + 2],
                        newR = pixels[w * 4 + 0],
                        newG = pixels[w * 4 + 1],
                        newB = pixels[w * 4 + 2];
                    if (Math.abs(newR - oldR) > threshold || Math.abs(newG - oldG) > threshold || Math.abs(newB - oldB) > threshold) motion.push([j, i]);
                }
            }
            oldPixels = pixels;
            let totalX = 0,
                totalY = 0;
            motion.forEach(p => {
                totalX += p[0];
                totalY += p[1];
            });
            average.x = totalX / motion.length;
            average.y = totalY / motion.length;
        }

        function track() {
            if (isNaN(average.x)) return;
            if (motion.length < length) return;
            outputAverage.x = 1 - average.x / width;
            outputAverage.y = average.y / height;
            outputMotion = Utils.cloneArray(motion);
            outputMotion.forEach(p => {
                p[0] = 1 - p[0] / width;
                p[1] /= height;
            });
            event.average = outputAverage;
            event.motion = outputMotion;
            event.gesture = null;
            self.events.fire(Events.UPDATE, event, true);
            const diffX = lastAverage.x - average.x,
                xDir = diffX < 0 ? 'left' : 'right';
            if (xDir !== gesture.xDir) {
                gesture.xDir = xDir;
                gesture.xValue = Math.abs(diffX);
            }
            gesture.xValue += Math.abs(diffX);
            if (gesture.xValue > 20) {
                event.gesture = gesture.xDir;
                self.events.fire(Events.UPDATE, event, true);
                gesture.xValue = 0;
            }
            const diffY = lastAverage.y - average.y,
                yDir = diffY < 0 ? 'down' : 'up';
            if (yDir !== gesture.yDir) {
                gesture.yDir = yDir;
                gesture.yValue = Math.abs(diffY);
            }
            gesture.yValue += Math.abs(diffY);
            if (gesture.yValue > 20) {
                event.gesture = gesture.yDir;
                self.events.fire(Events.UPDATE, event, true);
                gesture.yValue = 0;
            }
            lastAverage.x = average.x;
            lastAverage.y = average.y;
        }
    }
}

/**
 * Linked list.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class LinkedList {

    constructor() {
        const nodes = [];

        this.first = null;
        this.last = null;
        this.current = null;
        this.prev = null;

        function add(object) {
            return nodes[nodes.push({ object, prev: null, next: null }) - 1];
        }

        function remove(object) {
            for (let i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].object === object) {
                    nodes[i] = null;
                    nodes.splice(i, 1);
                    break;
                }
            }
        }

        function destroy() {
            for (let i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].object && nodes[i].object.destroy) nodes[i].object.destroy();
                nodes[i] = null;
                nodes.splice(i, 1);
            }
            return Utils.nullObject(this);
        }

        function find(object) {
            for (let i = 0; i < nodes.length; i++) if (nodes[i].object === object) return nodes[i];
            return null;
        }

        this.push = object => {
            const obj = add(object);
            if (!this.first) {
                obj.next = obj.prev = this.last = this.first = obj;
            } else {
                obj.next = this.first;
                obj.prev = this.last;
                this.last.next = obj;
                this.last = obj;
            }
        };

        this.remove = object => {
            const obj = find(object);
            if (!obj || !obj.next) return;
            if (nodes.length <= 1) {
                this.empty();
            } else {
                if (obj === this.first) {
                    this.first = obj.next;
                    this.last.next = this.first;
                    this.first.prev = this.last;
                } else if (obj == this.last) {
                    this.last = obj.prev;
                    this.last.next = this.first;
                    this.first.prev = this.last;
                } else {
                    obj.prev.next = obj.next;
                    obj.next.prev = obj.prev;
                }
            }
            remove(object);
        };

        this.empty = () => {
            this.first = null;
            this.last = null;
            this.current = null;
            this.prev = null;
        };

        this.start = () => {
            this.current = this.first;
            this.prev = this.current;
            return this.current.object;
        };

        this.next = () => {
            if (!this.current) return;
            if (nodes.length === 1 || this.prev.next === this.first) return;
            this.current = this.current.next;
            this.prev = this.current;
            return this.current.object;
        };

        this.destroy = destroy;
    }
}

/**
 * Object pool.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class ObjectPool {

    constructor(type, number) {
        const pool = [];

        this.array = pool;

        if (type) for (let i = 0; i < number || 10; i++) pool.push(new type());

        this.get = () => {
            return pool.shift() || (type ? new type() : null);
        };

        this.empty = () => {
            pool.length = 0;
        };

        this.put = object => {
            pool.push(object);
        };

        this.insert = array => {
            if (!Array.isArray(array)) array = [array];
            pool.push(...array);
        };

        this.length = () => {
            return pool.length;
        };

        this.destroy = () => {
            for (let i = pool.length - 1; i >= 0; i--) if (pool[i].destroy) pool[i].destroy();
            return Utils.nullObject(this);
        };
    }
}

/**
 * 3D vector.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Vector3 {

    constructor(x, y, z, w) {
        this.x = typeof x === 'number' ? x : 0;
        this.y = typeof y === 'number' ? y : 0;
        this.z = typeof z === 'number' ? z : 0;
        this.w = typeof w === 'number' ? w : 1;
        this.type = 'vector3';
    }

    set(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 1;
        return this;
    }

    clear() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        return this;
    }

    copyTo(p) {
        p.x = this.x;
        p.y = this.y;
        p.z = this.z;
        p.w = this.w;
        return p;
    }

    copy(p) {
        this.x = p.x || 0;
        this.y = p.y || 0;
        this.z = p.z || 0;
        this.w = p.w || 1;
        return this;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalize() {
        const m = 1 / this.length();
        this.set(this.x * m, this.y * m, this.z * m);
        return this;
    }

    setLength(length) {
        this.normalize().multiplyScalar(length);
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }

    addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    }

    subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    }

    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    }

    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    divideScalar(s) {
        this.x /= s;
        this.y /= s;
        this.z /= s;
        return this;
    }

    limit(max) {
        if (this.length() > max) {
            this.normalize();
            this.multiplyScalar(max);
        }
    }

    heading2D() {
        return -Math.atan2(-this.y, this.x);
    }

    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    }

    deltaLerp(v, alpha, delta = 1) {
        for (let i = 0; i < delta; i++) this.lerp(v, alpha);
        return this;
    }

    interp(v, alpha, ease, dist = 5000) {
        if (!this.calc) this.calc = new Vector3();
        this.calc.subVectors(this, v);
        const fn = Interpolation.convertEase(ease),
            a = fn(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
        return this.lerp(v, a);
    }

    setAngleRadius(a, r) {
        this.x = Math.cos(a) * r;
        this.y = Math.sin(a) * r;
        this.z = Math.sin(a) * r;
        return this;
    }

    addAngleRadius(a, r) {
        this.x += Math.cos(a) * r;
        this.y += Math.sin(a) * r;
        this.z += Math.sin(a) * r;
        return this;
    }

    applyQuaternion(q) {
        const x = this.x,
            y = this.y,
            z = this.z,
            qx = q.x,
            qy = q.y,
            qz = q.z,
            qw = q.w,
            ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    }

    dot(a, b = this) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    cross(a, b = this) {
        const x = a.y * b.z - a.z * b.y,
            y = a.z * b.x - a.x * b.z,
            z = a.x * b.y - a.y * b.x;
        this.set(x, y, z, this.w);
        return this;
    }

    distanceTo(v, noSq) {
        const dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;
        if (!noSq) return Math.sqrt(dx * dx + dy * dy + dz * dz);
        return dx * dx + dy * dy + dz * dz;
    }

    solveAngle(a, b = this) {
        return Math.acos(a.dot(b) / (a.length() * b.length() || 0.00001));
    }

    solveAngle2D(a, b = this) {
        const calc = new Vector2(),
            calc2 = new Vector2();
        calc.copy(a);
        calc2.copy(b);
        return calc.solveAngle(calc2);
    }

    equals(v) {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    toString(split = ' ') {
        return this.x + split + this.y + split + this.z;
    }
}

/**
 * 3D utilities with texture promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

class Utils3D {

    static decompose(local, world) {
        local.matrixWorld.decompose(world.position, world.quaternion, world.scale);
    }

    static createDebug(size = 40, color) {
        const geom = new THREE.IcosahedronGeometry(size, 1),
            mat = color ? new THREE.MeshBasicMaterial({ color }) : new THREE.MeshNormalMaterial();
        return new THREE.Mesh(geom, mat);
    }

    static createRT(width, height) {
        const params = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        };
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    static getTexture(src) {
        if (!this.textures) this.textures = {};
        if (!this.textures[src]) {
            const img = Assets.createImage(src),
                texture = new THREE.Texture(img);
            img.onload = () => {
                texture.needsUpdate = true;
                if (texture.onload) {
                    texture.onload();
                    texture.onload = null;
                }
                if (!THREE.Math.isPowerOfTwo(img.width * img.height)) texture.minFilter = THREE.LinearFilter;
            };
            this.textures[src] = texture;
        }
        return this.textures[src];
    }

    static setInfinity(v) {
        const inf = Number.POSITIVE_INFINITY;
        v.set(inf, inf, inf);
        return v;
    }

    static freezeMatrix(mesh) {
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
    }

    static getCubemap(src) {
        const path = 'cube_' + (Array.isArray(src) ? src[0] : src);
        if (!this.textures) this.textures = {};
        if (!this.textures[path]) {
            const images = [];
            for (let i = 0; i < 6; i++) {
                const img = Assets.createImage(Array.isArray(src) ? src[i] : src);
                images.push(img);
                img.onload = () => this.textures[path].needsUpdate = true;
            }
            this.textures[path] = new THREE.Texture(images);
            this.textures[path].minFilter = THREE.LinearFilter;
        }
        return this.textures[path];
    }

    static loadObject(data) {
        if (!this.objectLoader) this.objectLoader = new THREE.ObjectLoader();
        return this.objectLoader.parse(data);
    }

    static loadGeometry(data) {
        if (!this.geomLoader) this.geomLoader = new THREE.JSONLoader();
        if (!this.bufferGeomLoader) this.bufferGeomLoader = new THREE.BufferGeometryLoader();
        if (data.type === 'BufferGeometry') return this.bufferGeomLoader.parse(data);
        else return this.geomLoader.parse(data.data).geometry;
    }

    static disposeAllTextures() {
        for (let key in this.textures) this.textures[key].dispose();
    }

    static loadBufferGeometry(data) {
        const geometry = new THREE.BufferGeometry();
        if (data.data) data = data.data;
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal || data.position.length), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv || data.position.length / 3 * 2), 2));
        return geometry;
    }

    static loadSkinnedGeometry(data) {
        const geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal), 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv), 2));
        geometry.addAttribute('skinIndex', new THREE.BufferAttribute(new Float32Array(data.skinIndices), 4));
        geometry.addAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(data.skinWeights), 4));
        geometry.bones = data.bones;
        return geometry;
    }

    static loadCurve(data) {
        const points = [];
        for (let i = 0; i < data.length; i += 3) points.push(new THREE.Vector3(data[i + 0], data[i + 1], data[i + 2]));
        return new THREE.CatmullRomCurve3(points);
    }

    static setLightCamera(light, size, near, far, texture) {
        light.shadow.camera.left = -size;
        light.shadow.camera.right = size;
        light.shadow.camera.top = size;
        light.shadow.camera.bottom = -size;
        light.castShadow = true;
        if (near) light.shadow.camera.near = near;
        if (far) light.shadow.camera.far = far;
        if (texture) light.shadow.mapSize.width = light.shadow.mapSize.height = texture;
        light.shadow.camera.updateProjectionMatrix();
    }

    static getRepeatTexture(src) {
        const texture = this.getTexture(src);
        texture.onload = () => texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    static loadTexture(src) {
        const texture = this.getTexture(src),
            promise = Promise.create();
        texture.onload = () => promise.resolve(texture);
        return promise;
    }
}

/**
 * Raycaster.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

class Raycaster extends Component {

    constructor(camera) {
        super();
        const calc = new THREE.Vector2(),
            raycaster = new THREE.Raycaster();
        let debug;

        this.camera = camera;

        function ascSort(a, b) {
            return a.distance - b.distance;
        }

        function intersectObject(object, raycaster, intersects, recursive) {
            if (object.visible === false) return;
            let parent = object.parent;
            while (parent) {
                if (parent.visible === false) return;
                parent = parent.parent;
            }
            object.raycast(raycaster, intersects);
            if (recursive === true) object.children.forEach(object => intersectObject(object, raycaster, intersects, true));
        }

        function intersect(objects) {
            if (!Array.isArray(objects)) objects = [objects];
            const intersects = [];
            objects.forEach(object => intersectObject(object, raycaster, intersects, false));
            intersects.sort(ascSort);
            if (debug) updateDebug();
            return intersects;
        }

        function updateDebug() {
            const vertices = debug.geometry.vertices;
            vertices[0].copy(raycaster.ray.origin.clone());
            vertices[1].copy(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(10000)));
            debug.geometry.verticesNeedUpdate = true;
        }

        this.pointsThreshold = value => {
            raycaster.params.Points.threshold = value;
        };

        this.debug = scene => {
            const geom = new THREE.Geometry();
            geom.vertices.push(new THREE.Vector3(-100, 0, 0));
            geom.vertices.push(new THREE.Vector3(100, 0, 0));
            const mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
            debug = new THREE.Line(geom, mat);
            scene.add(debug);
        };

        this.checkHit = (objects, mouse = Mouse) => {
            const rect = this.rect || Stage;
            if (mouse === Mouse && rect === Stage) {
                calc.copy(Mouse.tilt);
            } else {
                calc.x = mouse.x / rect.width * 2 - 1;
                calc.y = -(mouse.y / rect.height) * 2 + 1;
            }
            raycaster.setFromCamera(calc, camera);
            return intersect(objects);
        };

        this.checkFromValues = (objects, origin, direction) => {
            raycaster.set(origin, direction, 0, Number.POSITIVE_INFINITY);
            return intersect(objects);
        };
    }
}

/**
 * 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Interaction3D extends Component {

    constructor(camera) {

        if (!Interaction3D.initialized) {
            Interaction3D.HOVER = 'interaction3d_hover';
            Interaction3D.CLICK = 'interaction3d_click';

            Interaction3D.initialized = true;
        }

        super();
        const self = this;
        const event = {};
        let hoverTarget, clickTarget;

        this.ray = new Raycaster(camera);
        this.meshes = [];
        this.meshCallbacks = [];
        this.cursor = 'auto';
        this.enabled = true;

        addListeners();

        function addListeners() {
            self.events.add(Mouse.input, Interaction.START, start);
            self.events.add(Mouse.input, Interaction.MOVE, move);
            self.events.add(Mouse.input, Interaction.CLICK, click);
        }

        function start() {
            if (!self.enabled) return;
            const hit = move();
            if (hit) {
                clickTarget = hit.object;
                clickTarget.time = Render.TIME;
            } else {
                clickTarget = null;
            }
        }

        function move() {
            if (!self.enabled) return;
            const hit = self.ray.checkHit(self.meshes)[0];
            if (hit) {
                const mesh = hit.object;
                if (mesh !== hoverTarget) {
                    if (hoverTarget) triggerHover('out', hoverTarget);
                    hoverTarget = mesh;
                    triggerHover('over', hoverTarget);
                    Stage.css('cursor', 'pointer');
                }
                return hit;
            } else {
                if (hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', self.cursor);
                }
                return false;
            }
        }

        function click() {
            if (!self.enabled) return;
            if (!clickTarget) return;
            const hit = self.ray.checkHit(self.meshes)[0];
            if (hit && hit.object === clickTarget) triggerClick(clickTarget);
            clickTarget = null;
        }

        function triggerHover(action, mesh) {
            event.action = action;
            event.mesh = mesh;
            self.events.fire(Interaction3D.HOVER, event, true);
            const i = self.meshes.indexOf(hoverTarget);
            if (self.meshCallbacks[i].hoverCallback) self.meshCallbacks[i].hoverCallback(event);
        }

        function triggerClick(mesh) {
            event.action = 'click';
            event.mesh = mesh;
            self.events.fire(Interaction3D.CLICK, event, true);
            const i = self.meshes.indexOf(clickTarget);
            if (self.meshCallbacks[i].clickCallback) self.meshCallbacks[i].clickCallback(event);
        }

        function parseMeshes(meshes) {
            if (!Array.isArray(meshes)) meshes = [meshes];
            const output = [];
            meshes.forEach(checkMesh);

            function checkMesh(mesh) {
                if (mesh.type === 'Mesh' && mesh.mouseEnabled) output.push(mesh);
                if (mesh.children.length) mesh.children.forEach(checkMesh);
            }

            return output;
        }

        this.add = (meshes, hoverCallback, clickCallback, parse) => {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(mesh => {
                this.meshes.push(mesh);
                this.meshCallbacks.push({ hoverCallback, clickCallback });
            });
        };

        this.remove = (meshes, parse) => {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(mesh => {
                if (mesh === hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', this.cursor);
                }
                for (let i = this.meshes.length - 1; i >= 0; i--) {
                    if (this.meshes[i] === mesh) {
                        this.meshes.splice(i, 1);
                        this.meshCallbacks.splice(i, 1);
                    }
                }
            });
        };
    }

    set camera(c) {
        this.ray.camera = c;
    }
}

/**
 * Screen projection.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

class ScreenProjection extends Component {

    constructor(camera) {
        super();
        const v3 = new THREE.Vector3(),
            v32 = new THREE.Vector3(),
            value = new THREE.Vector3;

        this.set = v => {
            camera = v;
        };

        this.unproject = (mouse, distance) => {
            const rect = this.rect || Stage;
            v3.set(mouse.x / rect.width * 2 - 1, -(mouse.y / rect.height) * 2 + 1, 0.5);
            v3.unproject(camera);
            const pos = camera.position;
            v3.sub(pos).normalize();
            const dist = distance || -pos.z / v3.z;
            value.copy(pos).add(v3.multiplyScalar(dist));
            return value;
        };

        this.project = pos => {
            const rect = this.rect || Stage;
            if (pos instanceof THREE.Object3D) {
                pos.updateMatrixWorld();
                v32.set(0, 0, 0).setFromMatrixPosition(pos.matrixWorld);
            } else {
                v32.copy(pos);
            }
            v32.project(camera);
            v32.x = (v32.x + 1) / 2 * rect.width;
            v32.y = -(v32.y - 1) / 2 * rect.height;
            return v32;
        };
    }
}

/**
 * Shader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

class Shader extends Component {

    constructor(vertexShader, fragmentShader, props) {
        super();
        const self = this;

        this.uniforms = {};
        this.properties = {};

        initProperties();
        initShader();

        function initProperties() {
            for (let key in props) {
                if (typeof props[key].value !== 'undefined') self.uniforms[key] = props[key];
                else self.properties[key] = props[key];
            }
        }

        function initShader() {
            const params = {};
            params.vertexShader = process(vertexShader, 'vs');
            params.fragmentShader = process(fragmentShader, 'fs');
            params.uniforms = self.uniforms;
            for (let key in self.properties) params[key] = self.properties[key];
            self.material = new THREE.RawShaderMaterial(params);
            self.material.shader = self;
            self.uniforms = self.material.uniforms;
        }

        function process(code, type) {
            let header;
            if (type === 'vs') {
                header = [
                    'precision highp float;',
                    'precision highp int;',
                    'attribute vec2 uv;',
                    'attribute vec3 position;',
                    'attribute vec3 normal;',
                    'uniform mat4 modelViewMatrix;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 modelMatrix;',
                    'uniform mat4 viewMatrix;',
                    'uniform mat3 normalMatrix;',
                    'uniform vec3 cameraPosition;'
                ].join('\n');
            } else {
                header = [
                    ~code.indexOf('dFdx') ? '#extension GL_OES_standard_derivatives : enable' : '',
                    'precision highp float;',
                    'precision highp int;',
                    'uniform mat4 modelViewMatrix;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 modelMatrix;',
                    'uniform mat4 viewMatrix;',
                    'uniform mat3 normalMatrix;',
                    'uniform vec3 cameraPosition;'
                ].join('\n');
            }
            code = header + '\n\n' + code;
            const threeChunk = (a, b) => {
                return THREE.ShaderChunk[b] + '\n';
            };
            return code.replace(/#s?chunk\(\s?(\w+)\s?\);/g, threeChunk);
        }

        this.destroy = () => {
            this.material.dispose();
            return super.destroy();
        };
    }
}

/**
 * Post processing effects.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

class Effects extends Component {

    constructor(stage, params) {
        super();
        const self = this;
        let renderTarget1, renderTarget2, scene, camera, mesh;

        this.stage = stage;
        this.renderer = params.renderer;
        this.scene = params.scene;
        this.camera = params.camera;
        this.enabled = params.enabled !== false;
        this.passes = params.passes || [];
        this.dpr = params.dpr || 1;
        this.rt = params.rt;

        initEffects();
        addListeners();

        function initEffects() {
            renderTarget1 = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            renderTarget2 = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2));
            scene.add(mesh);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
        }

        function resize() {
            renderTarget1.setSize(self.stage.width * self.dpr, self.stage.height * self.dpr);
            renderTarget2.setSize(self.stage.width * self.dpr, self.stage.height * self.dpr);
        }

        this.add = (pass, index) => {
            if (typeof index === 'number') {
                this.passes.splice(index, 0, pass);
                return;
            }
            this.passes.push(pass);
        };

        this.remove = pass => {
            if (typeof pass === 'number') this.passes.splice(pass);
            else this.passes.remove(pass);
        };

        this.render = rt => {
            if (!this.enabled || !this.passes.length) {
                this.renderer.render(this.scene, this.camera, rt || this.rt);
                return;
            }
            this.renderer.render(this.scene, this.camera, renderTarget1, true);
            for (let i = 0; i < this.passes.length - 1; i++) {
                mesh.material = this.passes[i].material;
                mesh.material.uniforms.texture.value = renderTarget1.texture;
                this.renderer.render(scene, camera, renderTarget2);
                const renderTarget = renderTarget1;
                renderTarget1 = renderTarget2;
                renderTarget2 = renderTarget;
            }
            mesh.material = this.passes[this.passes.length - 1].material;
            mesh.material.uniforms.texture.value = renderTarget1.texture;
            this.renderer.render(scene, camera, rt || this.rt);
        };

        this.setSize = (width, height) => {
            this.events.remove(Events.RESIZE, resize);
            renderTarget1.setSize(width * this.dpr, height * this.dpr);
            renderTarget2.setSize(width * this.dpr, height * this.dpr);
        };

        this.destroy = () => {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            renderTarget1.dispose();
            renderTarget2.dispose();
            renderTarget1 = null;
            renderTarget2 = null;
            mesh = null;
            camera = null;
            scene = null;
            return super.destroy();
        };
    }
}

/**
 * Euler integrator.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class EulerIntegrator {

    constructor() {
        const self = this;
        let vel, acc;

        this.useDeltaTime = false;

        function createVectors() {
            const Vector = self.type === '3D' ? Vector3 : Vector2;
            vel = new Vector();
            acc = new Vector();
        }

        this.integrate = (particles, dt, drag) => {
            if (!vel) createVectors();
            const dtSq = dt * dt;
            let p = particles.start();
            while (p) {
                if (!p.fixed && p.enabled) {
                    p.old.pos.copy(p.pos);
                    p.acc.multiplyScalar(p.massInv);
                    vel.copy(p.vel);
                    acc.copy(p.acc);
                    if (this.useDeltaTime) {
                        p.pos.add(vel.multiplyScalar(dt)).add(acc.multiplyScalar(0.5 * dtSq));
                        p.vel.add(p.acc.multiplyScalar(dt));
                    } else {
                        p.pos.add(vel).add(acc.multiplyScalar(0.5));
                        p.vel.add(p.acc);
                    }
                    if (drag) p.vel.multiplyScalar(drag);
                    p.acc.clear();
                }
                if (p.saveTo) p.saveTo.copy(p.pos);
                p = particles.next();
            }
        };
    }
}

/**
 * Particle physics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class ParticlePhysics extends Component {

    constructor(integrator = new EulerIntegrator()) {
        super();
        const self = this;
        const timestep = 1 / 60,
            toDelete = [];
        let clock = null,
            buffer = 0;

        this.friction = 1;
        this.maxSteps = 1;
        this.emitters = new LinkedList();
        this.initializers = new LinkedList();
        this.behaviors = new LinkedList();
        this.particles = new LinkedList();
        this.springs = new LinkedList();

        function init(p) {
            let i = self.initializers.start();
            while (i) {
                i(p);
                i = self.initializers.next();
            }
        }

        function updateSprings(dt) {
            let s = self.springs.start();
            while (s) {
                s.update(dt);
                s = self.springs.next();
            }
        }

        function deleteParticles() {
            for (let i = toDelete.length - 1; i >= 0; i--) {
                const particle = toDelete[i];
                self.particles.remove(particle);
                particle.system = null;
            }
        }

        function updateParticles(dt, list = self.particles) {
            let index = 0,
                p = list.start();
            while (p) {
                if (p.enabled) {
                    let b = self.behaviors.start();
                    while (b) {
                        b.applyBehavior(p, dt, index);
                        b = self.behaviors.next();
                    }
                    if (p.behaviors.length) p.update(dt, index);
                    if (p.childList) updateParticles(dt, p.childList);
                }
                index++;
                p = list.next();
            }
        }

        function integrate(dt) {
            updateParticles(dt);
            if (self.springs.length) updateSprings(dt);
            if (!self.skipIntegration) integrator.integrate(self.particles, dt, self.friction);
        }

        this.addEmitter = emitter => {
            this.emitters.push(emitter);
            emitter.parent = emitter.system = this;
        };

        this.removeEmitter = emitter => {
            this.emitters.remove(emitter);
            emitter.parent = emitter.system = null;
        };

        this.addInitializer = init => {
            this.initializers.push(init);
        };

        this.removeInitializer = init => {
            this.initializers.remove(init);
        };

        this.addBehavior = b => {
            this.behaviors.push(b);
            b.system = this;
        };

        this.removeBehavior = b => {
            this.behaviors.remove(b);
        };

        this.addParticle = p => {
            if (!integrator.type) integrator.type = typeof p.pos.z === 'number' ? '3D' : '2D';
            p.system = this;
            this.particles.push(p);
            if (this.initializers.length) init(p);
        };

        this.removeParticle = p => {
            p.system = null;
            toDelete.push(p);
        };

        this.addSpring = s => {
            s.system = this;
            this.springs.push(s);
        };

        this.removeSpring = s => {
            s.system = null;
            this.springs.remove(s);
        };

        this.update = force => {
            if (!clock) clock = Render.TIME;
            let time = Render.TIME,
                delta = time - clock;
            if (!force && delta <= 0) return;
            delta *= 0.001;
            clock = time;
            buffer += delta;
            if (!force) {
                let i = 0;
                while (buffer >= timestep && i++ < this.maxSteps) {
                    integrate(timestep);
                    buffer -= timestep;
                    time += timestep;
                }
            } else {
                integrate(0.016);
            }
            if (toDelete.length) deleteParticles();
        };
    }
}

/**
 * Particle.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Particle {

    constructor(pos, mass = 1, radius = 1) {
        const self = this;

        this.mass = mass;
        this.massInv = 1 / this.mass;
        this.radius = radius;
        this.radiusSq = this.radius * this.radius;
        this.behaviors = new LinkedList();
        this.fixed = false;
        this.enabled = true;

        initVectors();

        function initVectors() {
            const Vector = typeof pos.z === 'number' ? Vector3 : Vector2,
                vel = new Vector(),
                acc = new Vector(),
                old = {};
            old.pos = new Vector();
            old.vel = new Vector();
            old.acc = new Vector();
            self.pos = self.position = pos;
            self.vel = self.velocity = vel;
            self.acc = self.acceleration = acc;
            self.old = old;
            self.old.pos.copy(pos);
        }
    }

    moveTo(pos) {
        this.pos.copy(pos);
        this.old.pos.copy(pos);
        this.acc.clear();
        this.vel.clear();
    }

    setMass(mass = 1) {
        this.mass = mass;
        this.massInv = 1 / this.mass;
    }

    setRadius(radius) {
        this.radius = radius;
        this.radiusSq = this.radius * this.radius;
    }

    update(dt) {
        if (!this.behaviors.length) return;
        let b = this.behaviors.start();
        while (b) {
            b.applyBehavior(this, dt);
            b = this.behaviors.next();
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    addBehavior(behavior) {
        this.behaviors.push(behavior);
    }

    removeBehavior(behavior) {
        this.behaviors.remove(behavior);
    }

    addParticle(p) {
        if (!this.children) {
            this.children = [];
            this.childList = new LinkedList();
        }
        this.children.push(p);
        this.childList.push(p);
    }
}

/**
 * Random Euler rotation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class RandomEulerRotation {

    constructor(container) {
        const euler = ['x', 'y', 'z'];
        let rot;

        this.speed = 1;

        initRotation();

        function initRotation() {
            rot = {};
            rot.x = Utils.random(0, 2);
            rot.y = Utils.random(0, 2);
            rot.z = Utils.random(0, 2);
            rot.vx = Utils.random(-5, 5) * 0.0025;
            rot.vy = Utils.random(-5, 5) * 0.0025;
            rot.vz = Utils.random(-5, 5) * 0.0025;
        }

        this.update = () => {
            const t = Render.TIME;
            for (let i = 0; i < 3; i++) {
                const v = euler[i];
                switch (rot[v]) {
                    case 0:
                        container.rotation[v] += Math.cos(Math.sin(t * 0.25)) * rot['v' + v] * this.speed;
                        break;
                    case 1:
                        container.rotation[v] += Math.cos(Math.sin(t * 0.25)) * rot['v' + v] * this.speed;
                        break;
                    case 2:
                        container.rotation[v] += Math.cos(Math.cos(t * 0.25)) * rot['v' + v] * this.speed;
                        break;
                }
            }
        };
    }
}

/**
 * Wiggle behavior.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class WiggleBehavior {

    constructor(position, angle = Math.radians(Utils.random(0, 360))) {
        const wobble = new Vector3(),
            origin = new Vector3();

        this.target = wobble;
        this.scale = 1;
        this.alpha = 0.025;
        this.speed = 1;
        this.zMove = 2;

        if (position) origin.copy(position);

        this.update = copy => {
            const t = Render.TIME;
            if (copy) origin.copy(position);
            wobble.x = Math.cos(angle + t * (0.00075 * this.speed)) * (angle + Math.sin(t * (0.00095 * this.speed)) * 200);
            wobble.y = Math.sin(Math.asin(Math.cos(angle + t * (0.00085 * this.speed)))) * (Math.sin(angle + t * (0.00075 * this.speed)) * 150);
            wobble.x *= Math.sin(angle + t * (0.00075 * this.speed)) * 2;
            wobble.y *= Math.cos(angle + t * (0.00065 * this.speed)) * 1.75;
            wobble.x *= Math.cos(angle + t * (0.00075 * this.speed)) * 1.1;
            wobble.y *= Math.sin(angle + t * (0.00025 * this.speed)) * 1.15;
            wobble.z = Math.sin(angle + wobble.x * 0.0025) * (100 * this.zMove);
            wobble.multiplyScalar(this.scale * 0.1);
            wobble.add(origin);
            if (position) {
                if (this.ease) position.interp(wobble, this.alpha, this.ease);
                else position.lerp(wobble, this.alpha);
            }
        };
    }
}

/**
 * Alien abduction point.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */
