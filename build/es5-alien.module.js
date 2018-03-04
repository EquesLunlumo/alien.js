var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.Alien = {});
})(this, function (exports) {
    'use strict';

    /**
     * @author Patrick Schroen / https://github.com/pschroen
     */

    if (typeof Promise !== 'undefined') Promise.create = function () {
        var resolve = void 0,
            reject = void 0;
        var promise = new Promise(function (res, rej) {
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
        var newValue = (value - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
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
        var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
    };

    Math.fract = function (value) {
        return value - Math.floor(value);
    };

    Math.mod = function (value, n) {
        return (value % n + n) % n;
    };

    Array.prototype.remove = function (element) {
        var index = this.indexOf(element);
        if (~index) return this.splice(index, 1);
    };

    Array.prototype.last = function () {
        return this[this.length - 1];
    };

    String.prototype.includes = function (str) {
        if (!Array.isArray(str)) return ~this.indexOf(str);
        for (var i = 0; i < str.length; i++) {
            if (~this.indexOf(str[i])) return true;
        }return false;
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
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };

    if (!window.fetch) window.fetch = function (url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var promise = Promise.create(),
            request = new XMLHttpRequest();
        request.open(options.method || 'GET', url);
        for (var i in options.headers) {
            request.setRequestHeader(i, options.headers[i]);
        }request.onload = function () {
            return promise.resolve(response());
        };
        request.onerror = promise.reject;
        request.send(options.body);

        function response() {
            var _keys = [],
                all = [],
                headers = {};
            var header = void 0;
            request.getAllResponseHeaders().replace(/^(.*?):\s*([\s\S]*?)$/gm, function (m, key, value) {
                _keys.push(key = key.toLowerCase());
                all.push([key, value]);
                header = headers[key];
                headers[key] = header ? header + ',' + value : value;
            });
            return {
                ok: (request.status / 200 | 0) == 1,
                status: request.status,
                statusText: request.statusText,
                url: request.responseURL,
                clone: response,
                text: function text() {
                    return Promise.resolve(request.responseText);
                },
                json: function json() {
                    return Promise.resolve(request.responseText).then(JSON.parse);
                },
                xml: function xml() {
                    return Promise.resolve(request.responseXML);
                },
                blob: function blob() {
                    return Promise.resolve(new Blob([request.response]));
                },
                arrayBuffer: function arrayBuffer() {
                    return Promise.resolve(new ArrayBuffer([request.response]));
                },

                headers: {
                    keys: function keys() {
                        return _keys;
                    },
                    entries: function entries() {
                        return all;
                    },
                    get: function get(n) {
                        return headers[n.toLowerCase()];
                    },
                    has: function has(n) {
                        return n.toLowerCase() in headers;
                    }
                }
            };
        }
        return promise;
    };

    window.get = function (url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var promise = Promise.create();
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

    window.post = function (url, body) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var promise = Promise.create();
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

    window.defer = window.requestAnimationFrame;

    window.getURL = function (url) {
        var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_blank';

        window.open(url, target);
    };

    if (!window.Config) window.Config = {};
    if (!window.Global) window.Global = {};

    /**
     * Alien utilities.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Utils = function () {
        function Utils() {
            _classCallCheck(this, Utils);
        }

        _createClass(Utils, null, [{
            key: 'random',
            value: function random(min, max) {
                var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

                if (typeof min === 'undefined') return Math.random();
                if (min === max) return min;
                min = min || 0;
                max = max || 1;
                var p = Math.pow(10, precision);
                return Math.round((min + Math.random() * (max - min)) * p) / p;
            }
        }, {
            key: 'headsTails',
            value: function headsTails(heads, tails) {
                return this.random(0, 1) ? tails : heads;
            }
        }, {
            key: 'queryString',
            value: function queryString(key) {
                var str = decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[.+*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
                if (!str.length || str === '0' || str === 'false') return false;
                return str;
            }
        }, {
            key: 'getConstructorName',
            value: function getConstructorName(object) {
                return object.constructor.name || object.constructor.toString().match(/function ([^(]+)/)[1];
            }
        }, {
            key: 'nullObject',
            value: function nullObject(object) {
                for (var key in object) {
                    if (typeof object[key] !== 'undefined') object[key] = null;
                }return null;
            }
        }, {
            key: 'cloneObject',
            value: function cloneObject(object) {
                return JSON.parse(JSON.stringify(object));
            }
        }, {
            key: 'mergeObject',
            value: function mergeObject() {
                var object = {};

                for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
                    objects[_key] = arguments[_key];
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = objects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var obj = _step.value;
                        for (var key in obj) {
                            object[key] = obj[key];
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return object;
            }
        }, {
            key: 'toArray',
            value: function toArray(object) {
                return Object.keys(object).map(function (key) {
                    return object[key];
                });
            }
        }, {
            key: 'cloneArray',
            value: function cloneArray(array) {
                return array.slice(0);
            }
        }, {
            key: 'basename',
            value: function basename(path, ext) {
                var name = path.split('/').last();
                return !ext ? name.split('.')[0] : name;
            }
        }, {
            key: 'extension',
            value: function extension(path) {
                return path.split('.').last().split('?')[0].toLowerCase();
            }
        }, {
            key: 'base64',
            value: function base64(str) {
                return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
            }
        }, {
            key: 'timestamp',
            value: function timestamp() {
                return (Date.now() + this.random(0, 99999)).toString();
            }
        }, {
            key: 'pad',
            value: function pad(number) {
                return number < 10 ? '0' + number : number;
            }
        }, {
            key: 'hash',
            get: function get() {
                return window.location.hash.slice(1);
            }
        }]);

        return Utils;
    }();

    /**
     * Render loop.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Render = function () {
        function Render() {
            _classCallCheck(this, Render);
        }

        _createClass(Render, null, [{
            key: 'init',
            value: function init() {
                var _this = this;

                var self = this;
                var render = [],
                    skipLimit = 200;
                var last = performance.now();

                requestAnimationFrame(step);

                function step(t) {
                    var delta = Math.min(skipLimit, t - last);
                    last = t;
                    self.TIME = t;
                    self.DELTA = delta;
                    for (var i = render.length - 1; i >= 0; i--) {
                        var callback = render[i];
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

                this.start = function (callback, fps) {
                    if (fps) {
                        callback.fps = fps;
                        callback.last = -Infinity;
                        callback.frame = -1;
                    }
                    if (!~render.indexOf(callback)) render.unshift(callback);
                };

                this.stop = function (callback) {
                    render.remove(callback);
                };

                this.pause = function () {
                    _this.paused = true;
                };

                this.resume = function () {
                    if (!_this.paused) return;
                    _this.paused = false;
                    requestAnimationFrame(step);
                };
            }
        }]);

        return Render;
    }();

    Render.init();

    /**
     * Timer helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Timer = function () {
        function Timer() {
            _classCallCheck(this, Timer);
        }

        _createClass(Timer, null, [{
            key: 'init',
            value: function init() {
                var callbacks = [],
                    discard = [];

                Render.start(loop);

                function loop(t, delta) {
                    for (var i = 0; i < discard.length; i++) {
                        var obj = discard[i];
                        obj.callback = null;
                        callbacks.remove(obj);
                    }
                    if (discard.length) discard.length = 0;
                    for (var _i = 0; _i < callbacks.length; _i++) {
                        var _obj = callbacks[_i];
                        if (!_obj) {
                            callbacks.remove(_obj);
                            continue;
                        }
                        if ((_obj.current += delta) >= _obj.time) {
                            if (_obj.callback) _obj.callback.apply(_obj, _toConsumableArray(_obj.args));
                            discard.push(_obj);
                        }
                    }
                }

                function find(ref) {
                    for (var i = 0; i < callbacks.length; i++) {
                        if (callbacks[i].ref === ref) return callbacks[i];
                    }return null;
                }

                this.clearTimeout = function (ref) {
                    var obj = find(ref);
                    if (!obj) return false;
                    obj.callback = null;
                    callbacks.remove(obj);
                    return true;
                };

                this.create = function (callback, time) {
                    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                        args[_key2 - 2] = arguments[_key2];
                    }

                    var obj = {
                        time: Math.max(1, time || 1),
                        current: 0,
                        ref: Utils.timestamp(),
                        callback: callback,
                        args: args
                    };
                    callbacks.push(obj);
                    return obj.ref;
                };
            }
        }]);

        return Timer;
    }();

    Timer.init();

    /**
     * Event helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Events = function Events() {
        var _this2 = this;

        _classCallCheck(this, Events);

        var Emitter = function () {
            function Emitter() {
                _classCallCheck(this, Emitter);

                this.events = [];
                this.links = [];
            }

            _createClass(Emitter, [{
                key: 'add',
                value: function add(event, callback, object, target) {
                    this.events.push({ event: event, callback: callback, object: object, target: target });
                }
            }, {
                key: 'remove',
                value: function remove(event, callback) {
                    for (var i = this.events.length - 1; i >= 0; i--) {
                        if (this.events[i].event === event && this.events[i].callback === callback) {
                            this.events[i].removed = true;
                            this.events.splice(i, 1)[0] = null;
                        }
                    }
                }
            }, {
                key: 'fire',
                value: function fire(event) {
                    var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                    var called = false;
                    var clone = Utils.cloneArray(this.events);
                    for (var i = 0; i < clone.length; i++) {
                        if (clone[i].event === event && !clone[i].removed) {
                            if (clone[i].target && object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') object.target = object.target || clone[i].target;
                            clone[i].callback(object);
                            called = true;
                        }
                    }
                    return called;
                }
            }, {
                key: 'destroy',
                value: function destroy(object) {
                    for (var i = this.events.length - 1; i >= 0; i--) {
                        if (this.events[i].object === object) this.events.splice(i, 1)[0] = null;
                    }
                }
            }, {
                key: 'link',
                value: function link(object) {
                    if (!~this.links.indexOf(object)) this.links.push(object);
                }
            }]);

            return Emitter;
        }();

        if (!Events.initialized) {
            Events.emitter = new Emitter();
            Events.VISIBILITY = 'visibility';
            Events.KEYBOARD_PRESS = 'keyboard_press';
            Events.KEYBOARD_DOWN = 'keyboard_down';
            Events.KEYBOARD_UP = 'keyboard_up';
            Events.RESIZE = 'resize';
            Events.COMPLETE = 'complete';
            Events.PROGRESS = 'progress';
            Events.UPDATE = 'update';
            Events.LOADED = 'loaded';
            Events.ERROR = 'error';
            Events.READY = 'ready';
            Events.HOVER = 'hover';
            Events.CLICK = 'click';

            Events.initialized = true;
        }

        this.emitter = new Emitter();
        var linked = [];

        this.add = function (object, event, callback) {
            if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
                callback = event;
                event = object;
                object = null;
            }
            if (!object) {
                Events.emitter.add(event, callback, _this2);
            } else {
                var emitter = object.events.emitter;
                emitter.add(event, callback, _this2, object);
                emitter.link(_this2);
                linked.push(emitter);
            }
        };

        this.remove = function (object, event, callback) {
            if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
                callback = event;
                event = object;
                object = null;
            }
            if (!object) Events.emitter.remove(event, callback);else object.events.emitter.remove(event, callback);
        };

        this.fire = function (event) {
            var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var local = arguments[2];

            if (_this2.emitter.fire(event, object)) return;
            if (local) return;
            Events.emitter.fire(event, object);
        };

        this.destroy = function () {
            Events.emitter.destroy(_this2);
            linked.forEach(function (emitter) {
                return emitter.destroy(_this2);
            });
            _this2.emitter.links.forEach(function (object) {
                if (object.unlink) object.unlink(_this2.emitter);
            });
            return Utils.nullObject(_this2);
        };

        this.unlink = function (emitter) {
            linked.remove(emitter);
        };
    };

    /**
     * Browser detection and vendor prefixes.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Device = function () {
        function Device() {
            _classCallCheck(this, Device);
        }

        _createClass(Device, null, [{
            key: 'init',
            value: function init() {
                var _this3 = this;

                this.agent = navigator.userAgent.toLowerCase();
                this.prefix = function () {
                    var styles = window.getComputedStyle(document.documentElement, ''),
                        pre = (Array.prototype.slice.call(styles).join('').match(/-(webkit|moz|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
                    return {
                        lowercase: pre,
                        js: pre[0].toUpperCase() + pre.substr(1)
                    };
                }();
                this.transformProperty = function () {
                    var pre = void 0;
                    switch (_this3.prefix.lowercase) {
                        case 'webkit':
                            pre = '-webkit-transform';
                            break;
                        case 'moz':
                            pre = '-moz-transform';
                            break;
                        case 'ms':
                            pre = '-ms-transform';
                            break;
                        case 'o':
                            pre = '-o-transform';
                            break;
                        default:
                            pre = 'transform';
                            break;
                    }
                    return pre;
                }();
                this.pixelRatio = window.devicePixelRatio;
                this.os = function () {
                    if (_this3.detect(['iphone', 'ipad'])) return 'ios';
                    if (_this3.detect(['android'])) return 'android';
                    if (_this3.detect(['blackberry'])) return 'blackberry';
                    if (_this3.detect(['mac os'])) return 'mac';
                    if (_this3.detect(['windows'])) return 'windows';
                    if (_this3.detect(['linux'])) return 'linux';
                    return 'unknown';
                }();
                this.browser = function () {
                    if (_this3.os === 'ios') {
                        if (_this3.detect(['safari'])) return 'safari';
                        return 'unknown';
                    }
                    if (_this3.os === 'android') {
                        if (_this3.detect(['chrome'])) return 'chrome';
                        if (_this3.detect(['firefox'])) return 'firefox';
                        return 'browser';
                    }
                    if (_this3.detect(['msie'])) return 'ie';
                    if (_this3.detect(['trident']) && _this3.detect(['rv:'])) return 'ie';
                    if (_this3.detect(['windows']) && _this3.detect(['edge'])) return 'ie';
                    if (_this3.detect(['chrome'])) return 'chrome';
                    if (_this3.detect(['safari'])) return 'safari';
                    if (_this3.detect(['firefox'])) return 'firefox';
                    return 'unknown';
                }();
                this.mobile = 'ontouchstart' in window && this.detect(['iphone', 'ipad', 'android', 'blackberry']);
                this.tablet = Math.max(screen.width, screen.height) > 800;
                this.phone = !this.tablet;
                this.webgl = function () {
                    try {
                        return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
                    } catch (e) {
                        return false;
                    }
                }();
            }
        }, {
            key: 'detect',
            value: function detect(matches) {
                return this.agent.includes(matches);
            }
        }, {
            key: 'vendor',
            value: function vendor(style) {
                return this.prefix.js + style;
            }
        }, {
            key: 'vibrate',
            value: function vibrate(time) {
                if (navigator.vibrate) navigator.vibrate(time);
            }
        }]);

        return Device;
    }();

    Device.init();

    /**
     * Alien component.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Component = function () {
        function Component() {
            _classCallCheck(this, Component);

            this.events = new Events();
            this.classes = [];
            this.timers = [];
            this.loops = [];
        }

        _createClass(Component, [{
            key: 'initClass',
            value: function initClass(object) {
                for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    params[_key3 - 1] = arguments[_key3];
                }

                var child = new (Function.prototype.bind.apply(object, [null].concat(params)))();
                this.add(child);
                return child;
            }
        }, {
            key: 'add',
            value: function add(child) {
                if (child.destroy) {
                    this.classes.push(child);
                    child.parent = this;
                }
                return this;
            }
        }, {
            key: 'delayedCall',
            value: function delayedCall(callback) {
                for (var _len4 = arguments.length, params = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
                    params[_key4 - 2] = arguments[_key4];
                }

                var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                if (!this.timers) return;
                var timer = Timer.create(function () {
                    if (callback) callback.apply(undefined, params);
                }, time);
                this.timers.push(timer);
                if (this.timers.length > 50) this.timers.shift();
                return timer;
            }
        }, {
            key: 'clearTimers',
            value: function clearTimers() {
                for (var i = this.timers.length - 1; i >= 0; i--) {
                    Timer.clearTimeout(this.timers[i]);
                }this.timers.length = 0;
            }
        }, {
            key: 'startRender',
            value: function startRender(callback, fps) {
                this.loops.push(callback);
                Render.start(callback, fps);
            }
        }, {
            key: 'stopRender',
            value: function stopRender(callback) {
                this.loops.remove(callback);
                Render.stop(callback);
            }
        }, {
            key: 'clearRenders',
            value: function clearRenders() {
                for (var i = this.loops.length - 1; i >= 0; i--) {
                    this.stopRender(this.loops[i]);
                }this.loops.length = 0;
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removed = true;
                var parent = this.parent;
                if (parent && !parent.removed && parent.remove) parent.remove(this);
                for (var i = this.classes.length - 1; i >= 0; i--) {
                    var child = this.classes[i];
                    if (child && child.destroy) child.destroy();
                }
                this.classes.length = 0;
                this.clearRenders();
                this.clearTimers();
                this.events.destroy();
                return Utils.nullObject(this);
            }
        }, {
            key: 'remove',
            value: function remove(child) {
                this.classes.remove(child);
            }
        }]);

        return Component;
    }();

    /**
     * Assets helper class with image promise method.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Assets = function () {
        function Assets() {
            _classCallCheck(this, Assets);
        }

        _createClass(Assets, null, [{
            key: 'init',
            value: function init() {
                var _this4 = this;

                this.CDN = '';
                this.CORS = null;
                var images = {},
                    json = {};

                this.getPath = function (path) {
                    if (~path.indexOf('//')) return path;
                    if (_this4.CDN && !~path.indexOf(_this4.CDN)) path = _this4.CDN + path;
                    return path;
                };

                this.createImage = function (path, store, callback) {
                    if (typeof store !== 'boolean') {
                        callback = store;
                        store = undefined;
                    }
                    var img = new Image();
                    img.crossOrigin = _this4.CORS;
                    img.src = _this4.getPath(path);
                    img.onload = callback;
                    img.onerror = callback;
                    if (store) images[path] = img;
                    return img;
                };

                this.getImage = function (path) {
                    return images[path];
                };

                this.storeData = function (name, data) {
                    json[name] = data;
                    return json[name];
                };

                this.getData = function (name) {
                    return json[name];
                };
            }
        }, {
            key: 'loadImage',
            value: function loadImage(img) {
                if (typeof img === 'string') img = this.createImage(img);
                var promise = Promise.create();
                img.onload = function () {
                    return promise.resolve(img);
                };
                img.onerror = function () {
                    return promise.resolve(img);
                };
                return promise;
            }
        }]);

        return Assets;
    }();

    Assets.init();

    /**
     * Interpolation helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Interpolation = function () {
        function Interpolation() {
            _classCallCheck(this, Interpolation);
        }

        _createClass(Interpolation, null, [{
            key: 'init',
            value: function init() {
                var _this5 = this;

                function calculateBezier(aT, aA1, aA2) {
                    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
                }

                function getTForX(aX, mX1, mX2) {
                    var aGuessT = aX;
                    for (var i = 0; i < 4; i++) {
                        var currentSlope = getSlope(aGuessT, mX1, mX2);
                        if (currentSlope === 0) return aGuessT;
                        var currentX = calculateBezier(aGuessT, mX1, mX2) - aX;
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

                this.convertEase = function (ease) {
                    return function () {
                        var fn = void 0;
                        switch (ease) {
                            case 'easeInQuad':
                                fn = _this5.Quad.In;
                                break;
                            case 'easeInCubic':
                                fn = _this5.Cubic.In;
                                break;
                            case 'easeInQuart':
                                fn = _this5.Quart.In;
                                break;
                            case 'easeInQuint':
                                fn = _this5.Quint.In;
                                break;
                            case 'easeInSine':
                                fn = _this5.Sine.In;
                                break;
                            case 'easeInExpo':
                                fn = _this5.Expo.In;
                                break;
                            case 'easeInCirc':
                                fn = _this5.Circ.In;
                                break;
                            case 'easeInElastic':
                                fn = _this5.Elastic.In;
                                break;
                            case 'easeInBack':
                                fn = _this5.Back.In;
                                break;
                            case 'easeInBounce':
                                fn = _this5.Bounce.In;
                                break;
                            case 'easeOutQuad':
                                fn = _this5.Quad.Out;
                                break;
                            case 'easeOutCubic':
                                fn = _this5.Cubic.Out;
                                break;
                            case 'easeOutQuart':
                                fn = _this5.Quart.Out;
                                break;
                            case 'easeOutQuint':
                                fn = _this5.Quint.Out;
                                break;
                            case 'easeOutSine':
                                fn = _this5.Sine.Out;
                                break;
                            case 'easeOutExpo':
                                fn = _this5.Expo.Out;
                                break;
                            case 'easeOutCirc':
                                fn = _this5.Circ.Out;
                                break;
                            case 'easeOutElastic':
                                fn = _this5.Elastic.Out;
                                break;
                            case 'easeOutBack':
                                fn = _this5.Back.Out;
                                break;
                            case 'easeOutBounce':
                                fn = _this5.Bounce.Out;
                                break;
                            case 'easeInOutQuad':
                                fn = _this5.Quad.InOut;
                                break;
                            case 'easeInOutCubic':
                                fn = _this5.Cubic.InOut;
                                break;
                            case 'easeInOutQuart':
                                fn = _this5.Quart.InOut;
                                break;
                            case 'easeInOutQuint':
                                fn = _this5.Quint.InOut;
                                break;
                            case 'easeInOutSine':
                                fn = _this5.Sine.InOut;
                                break;
                            case 'easeInOutExpo':
                                fn = _this5.Expo.InOut;
                                break;
                            case 'easeInOutCirc':
                                fn = _this5.Circ.InOut;
                                break;
                            case 'easeInOutElastic':
                                fn = _this5.Elastic.InOut;
                                break;
                            case 'easeInOutBack':
                                fn = _this5.Back.InOut;
                                break;
                            case 'easeInOutBounce':
                                fn = _this5.Bounce.InOut;
                                break;
                            case 'linear':
                                fn = _this5.Linear.None;
                                break;
                        }
                        if (!fn) {
                            var curve = TweenManager.getEase(ease);
                            if (curve) {
                                var values = curve.split('(')[1].slice(0, -1).split(',');
                                for (var i = 0; i < values.length; i++) {
                                    values[i] = parseFloat(values[i]);
                                }fn = values;
                            } else {
                                fn = _this5.Cubic.Out;
                            }
                        }
                        return fn;
                    }();
                };

                this.solve = function (values, elapsed) {
                    if (values[0] === values[1] && values[2] === values[3]) return elapsed;
                    return calculateBezier(getTForX(elapsed, values[0], values[2]), values[1], values[3]);
                };

                this.Linear = {
                    None: function None(k) {
                        return k;
                    }
                };

                this.Quad = {
                    In: function In(k) {
                        return k * k;
                    },
                    Out: function Out(k) {
                        return k * (2 - k);
                    },
                    InOut: function InOut(k) {
                        if ((k *= 2) < 1) return 0.5 * k * k;
                        return -0.5 * (--k * (k - 2) - 1);
                    }
                };

                this.Cubic = {
                    In: function In(k) {
                        return k * k * k;
                    },
                    Out: function Out(k) {
                        return --k * k * k + 1;
                    },
                    InOut: function InOut(k) {
                        if ((k *= 2) < 1) return 0.5 * k * k * k;
                        return 0.5 * ((k -= 2) * k * k + 2);
                    }
                };

                this.Quart = {
                    In: function In(k) {
                        return k * k * k * k;
                    },
                    Out: function Out(k) {
                        return 1 - --k * k * k * k;
                    },
                    InOut: function InOut(k) {
                        if ((k *= 2) < 1) return 0.5 * k * k * k * k;
                        return -0.5 * ((k -= 2) * k * k * k - 2);
                    }
                };

                this.Quint = {
                    In: function In(k) {
                        return k * k * k * k * k;
                    },
                    Out: function Out(k) {
                        return --k * k * k * k * k + 1;
                    },
                    InOut: function InOut(k) {
                        if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
                        return 0.5 * ((k -= 2) * k * k * k * k + 2);
                    }
                };

                this.Sine = {
                    In: function In(k) {
                        return 1 - Math.cos(k * Math.PI / 2);
                    },
                    Out: function Out(k) {
                        return Math.sin(k * Math.PI / 2);
                    },
                    InOut: function InOut(k) {
                        return 0.5 * (1 - Math.cos(Math.PI * k));
                    }
                };

                this.Expo = {
                    In: function In(k) {
                        return k === 0 ? 0 : Math.pow(1024, k - 1);
                    },
                    Out: function Out(k) {
                        return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
                    },
                    InOut: function InOut(k) {
                        if (k === 0) return 0;
                        if (k === 1) return 1;
                        if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
                        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
                    }
                };

                this.Circ = {
                    In: function In(k) {
                        return 1 - Math.sqrt(1 - k * k);
                    },
                    Out: function Out(k) {
                        return Math.sqrt(1 - --k * k);
                    },
                    InOut: function InOut(k) {
                        if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
                        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
                    }
                };

                this.Elastic = {
                    In: function In(k) {
                        var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                        var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;

                        var s = void 0;
                        if (k === 0) return 0;
                        if (k === 1) return 1;
                        if (!a || a < 1) {
                            a = 1;
                            s = p / 4;
                        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                        return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
                    },
                    Out: function Out(k) {
                        var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                        var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;

                        var s = void 0;
                        if (k === 0) return 0;
                        if (k === 1) return 1;
                        if (!a || a < 1) {
                            a = 1;
                            s = p / 4;
                        } else s = p * Math.asin(1 / a) / (2 * Math.PI);
                        return a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1;
                    },
                    InOut: function InOut(k) {
                        var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                        var p = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;

                        var s = void 0;
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
                    In: function In(k) {
                        var s = 1.70158;
                        return k * k * ((s + 1) * k - s);
                    },
                    Out: function Out(k) {
                        var s = 1.70158;
                        return --k * k * ((s + 1) * k + s) + 1;
                    },
                    InOut: function InOut(k) {
                        var s = 1.70158 * 1.525;
                        if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
                        return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
                    }
                };

                this.Bounce = {
                    In: function In(k) {
                        return 1 - Interpolation.Bounce.Out(1 - k);
                    },
                    Out: function Out(k) {
                        if (k < 1 / 2.75) return 7.5625 * k * k;
                        if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
                        if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
                        return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
                    },
                    InOut: function InOut(k) {
                        if (k < 0.5) return Interpolation.Bounce.In(k * 2) * 0.5;
                        return Interpolation.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
                    }
                };
            }
        }]);

        return Interpolation;
    }();

    Interpolation.init();

    /**
     * Mathematical.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var MathTween = function MathTween(object, props, time, ease, delay, update, callback) {
        var _this6 = this;

        _classCallCheck(this, MathTween);

        var self = this;
        var startTime = void 0,
            startValues = void 0,
            endValues = void 0,
            easeFunction = void 0,
            paused = void 0,
            spring = void 0,
            damping = void 0,
            elapsed = void 0;

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
            for (var prop in endValues) {
                if (typeof object[prop] === 'number') startValues[prop] = object[prop];
            }
        }

        function clear() {
            if (!object && !props) return false;
            object.mathTween = null;
            TweenManager.removeMathTween(self);
            Utils.nullObject(self);
            if (object.mathTweens) object.mathTweens.remove(self);
        }

        this.update = function (t) {
            if (paused || t < startTime) return;
            elapsed = (t - startTime) / time;
            elapsed = elapsed > 1 ? 1 : elapsed;
            var delta = _this6.interpolate(elapsed);
            if (update) update(delta);
            if (elapsed === 1) {
                if (callback) callback();
                clear();
            }
        };

        this.stop = function () {
            clear();
        };

        this.pause = function () {
            paused = true;
        };

        this.resume = function () {
            paused = false;
            startTime = performance.now() - elapsed * time;
        };

        this.interpolate = function (elapsed) {
            var delta = easeFunction ? ease(elapsed, spring, damping) : Interpolation.solve(ease, elapsed);
            for (var prop in startValues) {
                if (typeof startValues[prop] === 'number' && typeof endValues[prop] === 'number') {
                    var start = startValues[prop],
                        end = endValues[prop];
                    object[prop] = start + (end - start) * delta;
                }
            }
            return delta;
        };
    };

    /**
     * Tween helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var TweenManager = function () {
        function TweenManager() {
            _classCallCheck(this, TweenManager);
        }

        _createClass(TweenManager, null, [{
            key: 'init',
            value: function init() {
                var self = this;
                this.TRANSFORMS = ['x', 'y', 'z', 'scale', 'scaleX', 'scaleY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'skewX', 'skewY', 'perspective'];
                this.CSS_EASES = {
                    easeOutCubic: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                    easeOutQuad: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
                    easeOutQuart: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
                    easeOutQuint: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
                    easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
                    easeOutExpo: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                    easeOutCirc: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
                    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
                    easeInCubic: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
                    easeInQuad: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)',
                    easeInQuart: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
                    easeInQuint: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                    easeInSine: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
                    easeInCirc: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
                    easeInBack: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
                    easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
                    easeInOutQuad: 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
                    easeInOutQuart: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
                    easeInOutQuint: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
                    easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
                    easeInOutExpo: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
                    easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
                    easeInOutBack: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
                    easeInOut: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
                    linear: 'linear'
                };
                var tweens = [];

                Render.start(updateTweens);

                function updateTweens(t) {
                    for (var i = tweens.length - 1; i >= 0; i--) {
                        var tween = tweens[i];
                        if (tween.update) tween.update(t);else self.removeMathTween(tween);
                    }
                }

                this.addMathTween = function (tween) {
                    tweens.push(tween);
                };

                this.removeMathTween = function (tween) {
                    tweens.remove(tween);
                };
            }
        }, {
            key: 'tween',
            value: function tween(object, props, time, ease, delay, callback, update) {
                if (typeof delay !== 'number') {
                    update = callback;
                    callback = delay;
                    delay = 0;
                }
                var promise = null;
                if (typeof Promise !== 'undefined') {
                    promise = Promise.create();
                    if (callback) promise.then(callback);
                    callback = promise.resolve;
                }
                var tween = new MathTween(object, props, time, ease, delay, update, callback);
                return promise || tween;
            }
        }, {
            key: 'clearTween',
            value: function clearTween(object) {
                if (object.mathTween) object.mathTween.stop();
                if (object.mathTweens) {
                    var tweens = object.mathTweens;
                    for (var i = tweens.length - 1; i >= 0; i--) {
                        var tween = tweens[i];
                        if (tween) tween.stop();
                    }
                    object.mathTweens = null;
                }
            }
        }, {
            key: 'isTransform',
            value: function isTransform(key) {
                return ~this.TRANSFORMS.indexOf(key);
            }
        }, {
            key: 'getEase',
            value: function getEase(name) {
                return this.CSS_EASES[name] || this.CSS_EASES.easeOutCubic;
            }
        }, {
            key: 'getAllTransforms',
            value: function getAllTransforms(object) {
                var obj = {};
                for (var i = 0; i < this.TRANSFORMS.length; i++) {
                    var key = this.TRANSFORMS[i],
                        val = object[key];
                    if (val !== 0 && typeof val === 'number') obj[key] = val;
                }
                return obj;
            }
        }, {
            key: 'parseTransform',
            value: function parseTransform(props) {
                var transforms = '';
                if (typeof props.x !== 'undefined' || typeof props.y !== 'undefined' || typeof props.z !== 'undefined') {
                    var x = props.x || 0,
                        y = props.y || 0,
                        z = props.z || 0;
                    var translate = '';
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
            }
        }, {
            key: 'interpolate',
            value: function interpolate(num, alpha, ease) {
                var fn = Interpolation.convertEase(ease);
                return num * (typeof fn === 'function' ? fn(alpha) : Interpolation.solve(fn, alpha));
            }
        }, {
            key: 'interpolateValues',
            value: function interpolateValues(start, end, alpha, ease) {
                var fn = Interpolation.convertEase(ease);
                return start + (end - start) * (typeof fn === 'function' ? fn(alpha) : Interpolation.solve(fn, alpha));
            }
        }]);

        return TweenManager;
    }();

    TweenManager.init();

    /**
     * CSS3 transition animation.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CSSTransition = function CSSTransition(object, props, time, ease, delay, callback) {
        _classCallCheck(this, CSSTransition);

        var self = this;
        var transformProps = void 0,
            transitionProps = void 0;

        initProperties();
        initCSSTween();

        function killed() {
            return !self || self.kill || !object || !object.element;
        }

        function initProperties() {
            var transform = TweenManager.getAllTransforms(object),
                properties = [];
            for (var key in props) {
                if (TweenManager.isTransform(key)) {
                    transform.use = true;
                    transform[key] = props[key];
                    delete props[key];
                } else if (typeof props[key] === 'number' || ~key.indexOf('-')) {
                    properties.push(key);
                }
            }
            if (transform.use) {
                properties.push(Device.transformProperty);
                delete transform.use;
            }
            transformProps = transform;
            transitionProps = properties;
        }

        function initCSSTween() {
            if (killed()) return;
            if (object.cssTween) object.cssTween.kill = true;
            object.cssTween = self;
            var strings = buildStrings(time, ease, delay);
            object.willChange(strings.props);
            Timer.create(function () {
                if (killed()) return;
                object.element.style[Device.vendor('Transition')] = strings.transition;
                object.css(props);
                object.transform(transformProps);
                Timer.create(function () {
                    if (killed()) return;
                    clearCSSTween();
                    if (callback) callback();
                }, time + delay);
            }, 35);
        }

        function buildStrings(time, ease, delay) {
            var props = '',
                transition = '';
            for (var i = 0; i < transitionProps.length; i++) {
                var transitionProp = transitionProps[i];
                props += (props.length ? ', ' : '') + transitionProp;
                transition += (transition.length ? ', ' : '') + transitionProp + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
            }
            return {
                props: props,
                transition: transition
            };
        }

        function clearCSSTween() {
            if (killed()) return;
            self.kill = true;
            object.element.style[Device.vendor('Transition')] = '';
            object.willChange(null);
            object.cssTween = null;
            object = props = null;
            Utils.nullObject(self);
        }

        this.stop = clearCSSTween;
    };

    /**
     * Alien interface.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Interface = function () {
        function Interface(name) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
            var detached = arguments[2];

            _classCallCheck(this, Interface);

            this.events = new Events();
            this.classes = [];
            this.timers = [];
            this.loops = [];
            if (typeof name !== 'undefined') {
                if (typeof name === 'string') {
                    this.name = name;
                    this.type = type;
                    if (type === 'svg') {
                        var qualifiedName = detached || 'svg';
                        detached = true;
                        this.element = document.createElementNS('http://www.w3.org/2000/svg', qualifiedName);
                        this.element.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
                    } else {
                        this.element = document.createElement(type);
                        if (name[0] !== '.') this.element.id = name;else this.element.className = name.substr(1);
                    }
                    this.element.style.position = 'absolute';
                    if (!detached) document.body.appendChild(this.element);
                } else {
                    this.element = name;
                }
                this.element.object = this;
            }
        }

        _createClass(Interface, [{
            key: 'initClass',
            value: function initClass(object) {
                for (var _len5 = arguments.length, params = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                    params[_key5 - 1] = arguments[_key5];
                }

                var child = new (Function.prototype.bind.apply(object, [null].concat(params)))();
                this.add(child);
                return child;
            }
        }, {
            key: 'add',
            value: function add(child) {
                if (child.destroy) {
                    this.classes.push(child);
                    child.parent = this;
                }
                if (child.element) this.element.appendChild(child.element);else if (child.nodeName) this.element.appendChild(child);
                return this;
            }
        }, {
            key: 'delayedCall',
            value: function delayedCall(callback) {
                for (var _len6 = arguments.length, params = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
                    params[_key6 - 2] = arguments[_key6];
                }

                var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                if (!this.timers) return;
                var timer = Timer.create(function () {
                    if (callback) callback.apply(undefined, params);
                }, time);
                this.timers.push(timer);
                if (this.timers.length > 50) this.timers.shift();
                return timer;
            }
        }, {
            key: 'clearTimers',
            value: function clearTimers() {
                for (var i = this.timers.length - 1; i >= 0; i--) {
                    Timer.clearTimeout(this.timers[i]);
                }this.timers.length = 0;
            }
        }, {
            key: 'startRender',
            value: function startRender(callback, fps) {
                this.loops.push(callback);
                Render.start(callback, fps);
            }
        }, {
            key: 'stopRender',
            value: function stopRender(callback) {
                this.loops.remove(callback);
                Render.stop(callback);
            }
        }, {
            key: 'clearRenders',
            value: function clearRenders() {
                for (var i = this.loops.length - 1; i >= 0; i--) {
                    this.stopRender(this.loops[i]);
                }this.loops.length = 0;
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removed = true;
                var parent = this.parent;
                if (parent && !parent.removed && parent.remove) parent.remove(this);
                for (var i = this.classes.length - 1; i >= 0; i--) {
                    var child = this.classes[i];
                    if (child && child.destroy) child.destroy();
                }
                this.classes.length = 0;
                this.element.object = null;
                this.clearRenders();
                this.clearTimers();
                this.events.destroy();
                return Utils.nullObject(this);
            }
        }, {
            key: 'remove',
            value: function remove(child) {
                if (child.element) child.element.parentNode.removeChild(child.element);else if (child.nodeName) child.parentNode.removeChild(child);
                this.classes.remove(child);
            }
        }, {
            key: 'create',
            value: function create(name, type) {
                var child = new Interface(name, type);
                this.add(child);
                return child;
            }
        }, {
            key: 'clone',
            value: function clone() {
                return new Interface(this.element.cloneNode(true));
            }
        }, {
            key: 'empty',
            value: function empty() {
                this.element.innerHTML = '';
                return this;
            }
        }, {
            key: 'text',
            value: function text(_text) {
                if (typeof _text === 'undefined') return this.element.textContent;else this.element.textContent = _text;
                return this;
            }
        }, {
            key: 'html',
            value: function html(text) {
                if (typeof text === 'undefined') return this.element.innerHTML;else this.element.innerHTML = text;
                return this;
            }
        }, {
            key: 'hide',
            value: function hide() {
                this.element.style.display = 'none';
                return this;
            }
        }, {
            key: 'show',
            value: function show() {
                this.element.style.display = '';
                return this;
            }
        }, {
            key: 'visible',
            value: function visible() {
                this.element.style.visibility = 'visible';
                return this;
            }
        }, {
            key: 'invisible',
            value: function invisible() {
                this.element.style.visibility = 'hidden';
                return this;
            }
        }, {
            key: 'setZ',
            value: function setZ(z) {
                this.element.style.zIndex = z;
                return this;
            }
        }, {
            key: 'clearAlpha',
            value: function clearAlpha() {
                this.element.style.opacity = '';
                return this;
            }
        }, {
            key: 'size',
            value: function size(w) {
                var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;

                if (typeof w !== 'undefined') {
                    if (typeof w === 'string' || typeof h === 'string') {
                        if (typeof w !== 'string') w = w + 'px';
                        if (typeof h !== 'string') h = h + 'px';
                        this.element.style.width = w;
                        this.element.style.height = h;
                    } else {
                        this.element.style.width = w + 'px';
                        this.element.style.height = h + 'px';
                        this.element.style.backgroundSize = w + 'px ' + h + 'px';
                    }
                }
                this.width = this.element.offsetWidth;
                this.height = this.element.offsetHeight;
                return this;
            }
        }, {
            key: 'mouseEnabled',
            value: function mouseEnabled(bool) {
                this.element.style.pointerEvents = bool ? 'auto' : 'none';
                return this;
            }
        }, {
            key: 'fontStyle',
            value: function fontStyle(fontFamily, fontSize, color, _fontStyle) {
                this.css({ fontFamily: fontFamily, fontSize: fontSize, color: color, fontStyle: _fontStyle });
                return this;
            }
        }, {
            key: 'bg',
            value: function bg(src, x, y, repeat) {
                if (~src.indexOf('.')) src = Assets.getPath(src);
                if (src.includes(['data:', '.'])) this.element.style.backgroundImage = 'url(' + src + ')';else this.element.style.backgroundColor = src;
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
                    this.element.style.backgroundSize = x;
                    this.element.style.backgroundRepeat = 'no-repeat';
                    this.element.style.backgroundPosition = typeof y !== 'undefined' ? y + ' ' + repeat : 'center';
                }
                return this;
            }
        }, {
            key: 'center',
            value: function center(x, y, noPos) {
                var css = {};
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
        }, {
            key: 'mask',
            value: function mask(src) {
                this.element.style[Device.vendor('Mask')] = (~src.indexOf('.') ? 'url(' + src + ')' : src) + ' no-repeat';
                this.element.style[Device.vendor('MaskSize')] = 'contain';
                return this;
            }
        }, {
            key: 'blendMode',
            value: function blendMode(mode, bg) {
                this.element.style[bg ? 'background-blend-mode' : 'mix-blend-mode'] = mode;
                return this;
            }
        }, {
            key: 'css',
            value: function css(props, value) {
                if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') {
                    if (!value) {
                        var style = this.element.style[props];
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
                for (var key in props) {
                    var val = props[key];
                    if (!(typeof val === 'string' || typeof val === 'number')) continue;
                    if (typeof val !== 'string' && key !== 'opacity' && key !== 'zIndex') val += 'px';
                    this.element.style[key] = val;
                }
                return this;
            }
        }, {
            key: 'transform',
            value: function transform(props) {
                if (!props) props = this;else for (var key in props) {
                    if (typeof props[key] === 'number') this[key] = props[key];
                }this.element.style[Device.vendor('Transform')] = TweenManager.parseTransform(props);
                return this;
            }
        }, {
            key: 'willChange',
            value: function willChange(props) {
                var string = typeof props === 'string';
                if (props) this.element.style['will-change'] = string ? props : Device.transformProperty + ', opacity';else this.element.style['will-change'] = '';
            }
        }, {
            key: 'backfaceVisibility',
            value: function backfaceVisibility(visible) {
                if (visible) this.element.style[Device.vendor('BackfaceVisibility')] = 'visible';else this.element.style[Device.vendor('BackfaceVisibility')] = 'hidden';
            }
        }, {
            key: 'enable3D',
            value: function enable3D(perspective, x, y) {
                this.element.style[Device.vendor('TransformStyle')] = 'preserve-3d';
                if (perspective) this.element.style[Device.vendor('Perspective')] = perspective + 'px';
                if (typeof x !== 'undefined') {
                    x = typeof x === 'number' ? x + 'px' : x;
                    y = typeof y === 'number' ? y + 'px' : y;
                    this.element.style[Device.vendor('PerspectiveOrigin')] = x + ' ' + y;
                }
                return this;
            }
        }, {
            key: 'disable3D',
            value: function disable3D() {
                this.element.style[Device.vendor('TransformStyle')] = '';
                this.element.style[Device.vendor('Perspective')] = '';
                return this;
            }
        }, {
            key: 'transformPoint',
            value: function transformPoint(x, y, z) {
                var origin = '';
                if (typeof x !== 'undefined') origin += typeof x === 'number' ? x + 'px' : x;
                if (typeof y !== 'undefined') origin += typeof y === 'number' ? ' ' + y + 'px' : ' ' + y;
                if (typeof z !== 'undefined') origin += typeof z === 'number' ? ' ' + z + 'px' : ' ' + z;
                this.element.style[Device.vendor('TransformOrigin')] = origin;
                return this;
            }
        }, {
            key: 'tween',
            value: function tween(props, time, ease, delay, callback) {
                if (typeof delay !== 'number') {
                    callback = delay;
                    delay = 0;
                }
                var promise = null;
                if (typeof Promise !== 'undefined') {
                    promise = Promise.create();
                    if (callback) promise.then(callback);
                    callback = promise.resolve;
                }
                var tween = new CSSTransition(this, props, time, ease, delay, callback);
                return promise || tween;
            }
        }, {
            key: 'clearTransform',
            value: function clearTransform() {
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
                this.element.style[Device.transformProperty] = '';
                return this;
            }
        }, {
            key: 'clearTween',
            value: function clearTween() {
                if (this.cssTween) this.cssTween.stop();
                if (this.mathTween) this.mathTween.stop();
                return this;
            }
        }, {
            key: 'attr',
            value: function attr(_attr, value) {
                if (typeof value === 'undefined') return this.element.getAttribute(_attr);
                if (value === '') this.element.removeAttribute(_attr);else this.element.setAttribute(_attr, value);
                return this;
            }
        }, {
            key: 'convertTouchEvent',
            value: function convertTouchEvent(e) {
                var touch = {};
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
        }, {
            key: 'click',
            value: function click(callback) {
                var _this7 = this;

                var click = function click(e) {
                    if (!_this7.element) return false;
                    e.object = _this7.element.className === 'hit' ? _this7.parent : _this7;
                    e.action = 'click';
                    if (callback) callback(e);
                };
                this.element.addEventListener('click', click, true);
                this.element.style.cursor = 'pointer';
                return this;
            }
        }, {
            key: 'hover',
            value: function hover(callback) {
                var _this8 = this;

                var hover = function hover(e) {
                    if (!_this8.element) return false;
                    e.object = _this8.element.className === 'hit' ? _this8.parent : _this8;
                    e.action = e.type === 'mouseout' ? 'out' : 'over';
                    if (callback) callback(e);
                };
                this.element.addEventListener('mouseover', hover, true);
                this.element.addEventListener('mouseout', hover, true);
                return this;
            }
        }, {
            key: 'press',
            value: function press(callback) {
                var _this9 = this;

                var press = function press(e) {
                    if (!_this9.element) return false;
                    e.object = _this9.element.className === 'hit' ? _this9.parent : _this9;
                    e.action = e.type === 'mousedown' ? 'down' : 'up';
                    if (callback) callback(e);
                };
                this.element.addEventListener('mousedown', press, true);
                this.element.addEventListener('mouseup', press, true);
                return this;
            }
        }, {
            key: 'bind',
            value: function bind(event, callback) {
                var _this10 = this;

                if (event === 'touchstart' && !Device.mobile) event = 'mousedown';else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
                if (!this.events['bind_' + event]) this.events['bind_' + event] = [];
                var events = this.events['bind_' + event];
                events.push({ target: this.element, callback: callback });

                var touchEvent = function touchEvent(e) {
                    var touch = _this10.convertTouchEvent(e);
                    if (!(e instanceof MouseEvent)) {
                        e.x = touch.x;
                        e.y = touch.y;
                    }
                    events.forEach(function (event) {
                        if (event.target === e.currentTarget) event.callback(e);
                    });
                };

                if (!this.events['fn_' + event]) {
                    this.events['fn_' + event] = touchEvent;
                    this.element.addEventListener(event, touchEvent, true);
                }
                return this;
            }
        }, {
            key: 'unbind',
            value: function unbind(event, callback) {
                if (event === 'touchstart' && !Device.mobile) event = 'mousedown';else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
                var events = this.events['bind_' + event];
                if (!events) return this;
                events.forEach(function (event, i) {
                    if (event.callback === callback) events.splice(i, 1);
                });
                if (this.events['fn_' + event] && !events.length) {
                    this.element.removeEventListener(event, this.events['fn_' + event], true);
                    this.events['fn_' + event] = null;
                }
                return this;
            }
        }, {
            key: 'interact',
            value: function interact(overCallback, clickCallback) {
                this.hit = this.create('.hit');
                this.hit.css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 99999
                });
                if (Device.mobile) this.hit.touchClick(overCallback, clickCallback);else this.hit.hover(overCallback).click(clickCallback);
                return this;
            }
        }, {
            key: 'touchClick',
            value: function touchClick(hover, click) {
                var _this11 = this;

                var start = {};
                var time = void 0,
                    move = void 0,
                    touch = void 0;

                var findDistance = function findDistance(p1, p2) {
                    var dx = p2.x - p1.x,
                        dy = p2.y - p1.y;
                    return Math.sqrt(dx * dx + dy * dy);
                };

                var touchMove = function touchMove(e) {
                    if (!_this11.element) return false;
                    touch = _this11.convertTouchEvent(e);
                    move = findDistance(start, touch) > 5;
                };

                var setTouch = function setTouch(e) {
                    var touchEvent = _this11.convertTouchEvent(e);
                    e.touchX = touchEvent.x;
                    e.touchY = touchEvent.y;
                    start.x = e.touchX;
                    start.y = e.touchY;
                };

                var touchStart = function touchStart(e) {
                    if (!_this11.element) return false;
                    time = performance.now();
                    e.object = _this11.element.className === 'hit' ? _this11.parent : _this11;
                    e.action = 'over';
                    setTouch(e);
                    if (hover && !move) hover(e);
                };

                var touchEnd = function touchEnd(e) {
                    if (!_this11.element) return false;
                    var t = performance.now();
                    e.object = _this11.element.className === 'hit' ? _this11.parent : _this11;
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
        }, {
            key: 'overflowScroll',
            value: function overflowScroll(direction) {
                if (!Device.mobile) return;
                var x = !!direction.x,
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
                this.element.preventEvent = function (e) {
                    return e.stopPropagation();
                };
                this.bind('touchmove', this.element.preventEvent);
            }
        }, {
            key: 'removeOverflowScroll',
            value: function removeOverflowScroll() {
                if (!Device.mobile) return;
                this.css({
                    overflow: 'hidden',
                    overflowX: '',
                    overflowY: '',
                    '-webkit-overflow-scrolling': ''
                });
                this.unbind('touchmove', this.element.preventEvent);
            }
        }, {
            key: 'split',
            value: function split() {
                var by = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                var style = {
                    position: 'relative',
                    display: 'block',
                    width: 'auto',
                    height: 'auto',
                    margin: 0,
                    padding: 0,
                    cssFloat: 'left'
                },
                    array = [],
                    split = this.text().split(by);
                this.empty();
                if (by === ' ') by = '&nbsp;';
                for (var i = 0; i < split.length; i++) {
                    if (split[i] === ' ') split[i] = '&nbsp;';
                    array.push(this.create('.t', 'span').html(split[i]).css(style));
                    if (by !== '' && i < split.length - 1) array.push(this.create('.t', 'span').html(by).css(style));
                }
                return array;
            }
        }]);

        return Interface;
    }();

    /**
     * Accelerometer helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Accelerometer = function () {
        function Accelerometer() {
            _classCallCheck(this, Accelerometer);
        }

        _createClass(Accelerometer, null, [{
            key: 'init',
            value: function init() {
                var _this12 = this;

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

                    var updateAccel = function updateAccel(e) {
                        switch (window.orientation) {
                            case 0:
                                _this12.x = -e.accelerationIncludingGravity.x;
                                _this12.y = e.accelerationIncludingGravity.y;
                                _this12.z = e.accelerationIncludingGravity.z;
                                if (e.rotationRate) {
                                    _this12.rotationRate.alpha = e.rotationRate.beta * _this12.toRadians;
                                    _this12.rotationRate.beta = -e.rotationRate.alpha * _this12.toRadians;
                                    _this12.rotationRate.gamma = e.rotationRate.gamma * _this12.toRadians;
                                }
                                break;
                            case 180:
                                _this12.x = e.accelerationIncludingGravity.x;
                                _this12.y = -e.accelerationIncludingGravity.y;
                                _this12.z = e.accelerationIncludingGravity.z;
                                if (e.rotationRate) {
                                    _this12.rotationRate.alpha = -e.rotationRate.beta * _this12.toRadians;
                                    _this12.rotationRate.beta = e.rotationRate.alpha * _this12.toRadians;
                                    _this12.rotationRate.gamma = e.rotationRate.gamma * _this12.toRadians;
                                }
                                break;
                            case 90:
                                _this12.x = e.accelerationIncludingGravity.y;
                                _this12.y = e.accelerationIncludingGravity.x;
                                _this12.z = e.accelerationIncludingGravity.z;
                                if (e.rotationRate) {
                                    _this12.rotationRate.alpha = e.rotationRate.alpha * _this12.toRadians;
                                    _this12.rotationRate.beta = e.rotationRate.beta * _this12.toRadians;
                                    _this12.rotationRate.gamma = e.rotationRate.gamma * _this12.toRadians;
                                }
                                break;
                            case -90:
                                _this12.x = -e.accelerationIncludingGravity.y;
                                _this12.y = -e.accelerationIncludingGravity.x;
                                _this12.z = e.accelerationIncludingGravity.z;
                                if (e.rotationRate) {
                                    _this12.rotationRate.alpha = -e.rotationRate.alpha * _this12.toRadians;
                                    _this12.rotationRate.beta = -e.rotationRate.beta * _this12.toRadians;
                                    _this12.rotationRate.gamma = e.rotationRate.gamma * _this12.toRadians;
                                }
                                break;
                        }
                    };

                    var updateOrientation = function updateOrientation(e) {
                        for (var key in e) {
                            if (~key.toLowerCase().indexOf('heading')) _this12.heading = e[key];
                        }switch (window.orientation) {
                            case 0:
                                _this12.alpha = e.beta * _this12.toRadians;
                                _this12.beta = -e.alpha * _this12.toRadians;
                                _this12.gamma = e.gamma * _this12.toRadians;
                                break;
                            case 180:
                                _this12.alpha = -e.beta * _this12.toRadians;
                                _this12.beta = e.alpha * _this12.toRadians;
                                _this12.gamma = e.gamma * _this12.toRadians;
                                break;
                            case 90:
                                _this12.alpha = e.alpha * _this12.toRadians;
                                _this12.beta = e.beta * _this12.toRadians;
                                _this12.gamma = e.gamma * _this12.toRadians;
                                break;
                            case -90:
                                _this12.alpha = -e.alpha * _this12.toRadians;
                                _this12.beta = -e.beta * _this12.toRadians;
                                _this12.gamma = e.gamma * _this12.toRadians;
                                break;
                        }
                        _this12.tilt = e.beta * _this12.toRadians;
                        _this12.yaw = e.alpha * _this12.toRadians;
                        _this12.roll = -e.gamma * _this12.toRadians;
                        if (Device.os === 'Android') _this12.heading = _compassHeading(e.alpha, e.beta, e.gamma);
                    };

                    var _compassHeading = function _compassHeading(alpha, beta, gamma) {
                        var degtorad = Math.PI / 180,
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
                        var compassHeading = Math.atan(Vx / Vy);
                        if (Vy < 0) compassHeading += Math.PI;else if (Vx < 0) compassHeading += 2 * Math.PI;
                        return compassHeading * (180 / Math.PI);
                    };

                    window.addEventListener('devicemotion', updateAccel, true);
                    window.addEventListener('deviceorientation', updateOrientation, true);

                    this.stop = function () {
                        _this12.active = false;
                        window.removeEventListener('devicemotion', updateAccel, true);
                        window.removeEventListener('deviceorientation', updateOrientation, true);
                    };
                }
            }
        }]);

        return Accelerometer;
    }();

    /**
     * Mouse interaction.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Mouse = function () {
        function Mouse() {
            _classCallCheck(this, Mouse);
        }

        _createClass(Mouse, null, [{
            key: 'init',
            value: function init() {
                var _this13 = this;

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

                    var update = function update(e) {
                        _this13.x = e.x;
                        _this13.y = e.y;
                        _this13.normal.x = e.x / Stage.width;
                        _this13.normal.y = e.y / Stage.height;
                        _this13.tilt.x = _this13.normal.x * 2 - 1;
                        _this13.tilt.y = 1 - _this13.normal.y * 2;
                        _this13.inverseNormal.x = _this13.normal.x;
                        _this13.inverseNormal.y = 1 - _this13.normal.y;
                    };

                    this.input = Stage.initClass(Interaction);
                    Stage.events.add(this.input, Interaction.START, update);
                    Stage.events.add(this.input, Interaction.MOVE, update);
                    update({
                        x: Stage.width / 2,
                        y: Stage.height / 2
                    });

                    this.stop = function () {
                        _this13.active = false;
                        Stage.events.remove(_this13.input, Interaction.START, update);
                        Stage.events.remove(_this13.input, Interaction.MOVE, update);
                    };
                }
            }
        }]);

        return Mouse;
    }();

    /**
     * Web audio engine.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

    var WebAudio = function () {
        function WebAudio() {
            _classCallCheck(this, WebAudio);
        }

        _createClass(WebAudio, null, [{
            key: 'init',
            value: function init() {
                var _this14 = this;

                if (!this.active) {
                    this.active = true;

                    var _self = this;
                    var sounds = {};
                    var context = void 0;

                    if (window.AudioContext) context = new AudioContext();
                    if (!context) return;
                    this.globalGain = context.createGain();
                    this.globalGain.connect(context.destination);
                    this.globalGain.value = this.globalGain.gain.defaultValue;
                    this.gain = {
                        set value(value) {
                            _self.globalGain.value = value;
                            _self.globalGain.gain.setTargetAtTime(value, context.currentTime, 0.01);
                        },
                        get value() {
                            return _self.globalGain.value;
                        }
                    };

                    this.loadSound = function (id, callback) {
                        var promise = Promise.create();
                        if (callback) promise.then(callback);
                        callback = promise.resolve;
                        var sound = _this14.getSound(id);
                        window.fetch(sound.asset).then(function (response) {
                            if (!response.ok) return callback();
                            response.arrayBuffer().then(function (data) {
                                context.decodeAudioData(data, function (buffer) {
                                    sound.buffer = buffer;
                                    sound.complete = true;
                                    callback();
                                });
                            });
                        }).catch(function () {
                            callback();
                        });
                        sound.ready = function () {
                            return promise;
                        };
                    };

                    this.createSound = function (id, asset, callback) {
                        var sound = {};
                        sound.asset = Assets.getPath(asset);
                        sound.audioGain = context.createGain();
                        sound.audioGain.connect(_this14.globalGain);
                        sound.audioGain.value = sound.audioGain.gain.defaultValue;
                        sound.gain = {
                            set value(value) {
                                sound.audioGain.value = value;
                                sound.audioGain.gain.setTargetAtTime(value, context.currentTime, 0.01);
                            },
                            get value() {
                                return sound.audioGain.value;
                            }
                        };
                        sound.stop = function () {
                            if (sound.source) sound.source.stop();
                        };
                        sounds[id] = sound;
                        if (Device.os === 'ios') callback();else _this14.loadSound(id, callback);
                    };

                    this.getSound = function (id) {
                        return sounds[id];
                    };

                    this.trigger = function (id) {
                        if (!context) return;
                        if (context.state === 'suspended') context.resume();
                        var sound = _this14.getSound(id);
                        if (!sound.ready) _this14.loadSound(id);
                        sound.ready().then(function () {
                            if (sound.complete) {
                                sound.source = context.createBufferSource();
                                sound.source.buffer = sound.buffer;
                                sound.source.connect(sound.audioGain);
                                sound.audioGain.gain.setValueAtTime(0, context.currentTime);
                                sound.source.loop = !!sound.loop;
                                sound.source.start();
                                sound.audioGain.gain.setTargetAtTime(sound.audioGain.value, context.currentTime, 0.01);
                            }
                        });
                    };

                    this.mute = function () {
                        if (!context) return;
                        TweenManager.tween(_this14.gain, { value: 0 }, 300, 'easeOutSine');
                    };

                    this.unmute = function () {
                        if (!context) return;
                        TweenManager.tween(_this14.gain, { value: 1 }, 500, 'easeOutSine');
                    };

                    this.stop = function () {
                        _this14.active = false;
                        if (!context) return;
                        for (var id in sounds) {
                            var sound = sounds[id];
                            if (sound) sound.stop();
                        }
                        context.close();
                    };
                }

                window.WebAudio = this;
            }
        }]);

        return WebAudio;
    }();

    /**
     * Stage instance.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Stage = new (function (_Interface) {
        _inherits(_class, _Interface);

        function _class() {
            _classCallCheck(this, _class);

            var _this15 = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, 'Stage'));

            var self = _this15;
            var last = void 0;

            initHTML();
            addListeners();

            function initHTML() {
                self.css({ overflow: 'hidden' });
            }

            function addListeners() {
                window.addEventListener('focus', focus, true);
                window.addEventListener('blur', blur, true);
                window.addEventListener('keydown', keyDown, true);
                window.addEventListener('keyup', keyUp, true);
                window.addEventListener('keypress', keyPress, true);
                window.addEventListener('resize', resize, true);
                window.addEventListener('orientationchange', resize, true);
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

            function resize() {
                self.size();
                self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
                Events.emitter.fire(Events.RESIZE);
            }

            _this15.destroy = function () {
                if (Accelerometer.active) Accelerometer.stop();
                if (Mouse.active) Mouse.stop();
                if (WebAudio.active) WebAudio.stop();
                window.removeEventListener('focus', focus, true);
                window.removeEventListener('blur', blur, true);
                window.removeEventListener('keydown', keyDown, true);
                window.removeEventListener('keyup', keyUp, true);
                window.removeEventListener('keypress', keyPress, true);
                window.removeEventListener('resize', resize, true);
                window.removeEventListener('orientationchange', resize, true);
                return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'destroy', _this15).call(_this15);
            };
            return _this15;
        }

        return _class;
    }(Interface))();

    /**
     * 2D vector.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Vector2 = function () {
        function Vector2(x, y) {
            _classCallCheck(this, Vector2);

            this.x = typeof x === 'number' ? x : 0;
            this.y = typeof y === 'number' ? y : 0;
            this.type = 'vector2';
        }

        _createClass(Vector2, [{
            key: 'set',
            value: function set(x, y) {
                this.x = x || 0;
                this.y = y || 0;
                return this;
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.x = 0;
                this.y = 0;
                return this;
            }
        }, {
            key: 'copyTo',
            value: function copyTo(v) {
                v.x = this.x;
                v.y = this.y;
                return this;
            }
        }, {
            key: 'copyFrom',
            value: function copyFrom(v) {
                this.x = v.x || 0;
                this.y = v.y || 0;
                return this;
            }
        }, {
            key: 'lengthSq',
            value: function lengthSq() {
                return this.x * this.x + this.y * this.y || 0.00001;
            }
        }, {
            key: 'length',
            value: function length() {
                return Math.sqrt(this.lengthSq());
            }
        }, {
            key: 'normalize',
            value: function normalize() {
                var length = this.length();
                this.x /= length;
                this.y /= length;
                return this;
            }
        }, {
            key: 'setLength',
            value: function setLength(length) {
                this.normalize().multiply(length);
                return this;
            }
        }, {
            key: 'addVectors',
            value: function addVectors(a, b) {
                this.x = a.x + b.x;
                this.y = a.y + b.y;
                return this;
            }
        }, {
            key: 'subVectors',
            value: function subVectors(a, b) {
                this.x = a.x - b.x;
                this.y = a.y - b.y;
                return this;
            }
        }, {
            key: 'multiplyVectors',
            value: function multiplyVectors(a, b) {
                this.x = a.x * b.x;
                this.y = a.y * b.y;
                return this;
            }
        }, {
            key: 'add',
            value: function add(v) {
                this.x += v.x;
                this.y += v.y;
                return this;
            }
        }, {
            key: 'sub',
            value: function sub(v) {
                this.x -= v.x;
                this.y -= v.y;
                return this;
            }
        }, {
            key: 'multiply',
            value: function multiply(v) {
                this.x *= v;
                this.y *= v;
                return this;
            }
        }, {
            key: 'divide',
            value: function divide(v) {
                this.x /= v;
                this.y /= v;
                return this;
            }
        }, {
            key: 'perpendicular',
            value: function perpendicular() {
                var tx = this.x,
                    ty = this.y;
                this.x = -ty;
                this.y = tx;
                return this;
            }
        }, {
            key: 'lerp',
            value: function lerp(v, alpha) {
                this.x += (v.x - this.x) * alpha;
                this.y += (v.y - this.y) * alpha;
                return this;
            }
        }, {
            key: 'deltaLerp',
            value: function deltaLerp(v, alpha) {
                var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

                for (var i = 0; i < delta; i++) {
                    this.lerp(v, alpha);
                }return this;
            }
        }, {
            key: 'interp',
            value: function interp(v, alpha, ease) {
                var dist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;

                if (!this.calc) this.calc = new Vector2();
                this.calc.subVectors(this, v);
                var fn = Interpolation.convertEase(ease),
                    a = fn(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
                return this.lerp(v, a);
            }
        }, {
            key: 'setAngleRadius',
            value: function setAngleRadius(a, r) {
                this.x = Math.cos(a) * r;
                this.y = Math.sin(a) * r;
                return this;
            }
        }, {
            key: 'addAngleRadius',
            value: function addAngleRadius(a, r) {
                this.x += Math.cos(a) * r;
                this.y += Math.sin(a) * r;
                return this;
            }
        }, {
            key: 'dot',
            value: function dot(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

                return a.x * b.x + a.y * b.y;
            }
        }, {
            key: 'clone',
            value: function clone() {
                return new Vector2(this.x, this.y);
            }
        }, {
            key: 'distanceTo',
            value: function distanceTo(v, noSq) {
                var dx = this.x - v.x,
                    dy = this.y - v.y;
                if (!noSq) return Math.sqrt(dx * dx + dy * dy);
                return dx * dx + dy * dy;
            }
        }, {
            key: 'solveAngle',
            value: function solveAngle(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

                return Math.atan2(a.y - b.y, a.x - b.x);
            }
        }, {
            key: 'equals',
            value: function equals(v) {
                return this.x === v.x && this.y === v.y;
            }
        }, {
            key: 'toString',
            value: function toString() {
                var split = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';

                return this.x + split + this.y;
            }
        }]);

        return Vector2;
    }();

    /**
     * Interaction helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Interaction = function (_Component) {
        _inherits(Interaction, _Component);

        function Interaction() {
            var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Stage;

            _classCallCheck(this, Interaction);

            if (!Interaction.initialized) {
                Interaction.CLICK = 'interaction_click';
                Interaction.START = 'interaction_start';
                Interaction.MOVE = 'interaction_move';
                Interaction.DRAG = 'interaction_drag';
                Interaction.END = 'interaction_end';

                var events = {
                    touchstart: [],
                    touchmove: [],
                    touchend: []
                },
                    touchStart = function touchStart(e) {
                    return events.touchstart.forEach(function (callback) {
                        return callback(e);
                    });
                },
                    touchMove = function touchMove(e) {
                    return events.touchmove.forEach(function (callback) {
                        return callback(e);
                    });
                },
                    touchEnd = function touchEnd(e) {
                    return events.touchend.forEach(function (callback) {
                        return callback(e);
                    });
                };

                Interaction.bind = function (event, callback) {
                    return events[event].push(callback);
                };
                Interaction.unbind = function (event, callback) {
                    return events[event].remove(callback);
                };

                Stage.bind('touchstart', touchStart);
                Stage.bind('touchmove', touchMove);
                Stage.bind('touchend', touchEnd);
                Stage.bind('touchcancel', touchEnd);

                Interaction.initialized = true;
            }

            var _this16 = _possibleConstructorReturn(this, (Interaction.__proto__ || Object.getPrototypeOf(Interaction)).call(this));

            var self = _this16;
            _this16.x = 0;
            _this16.y = 0;
            _this16.hold = new Vector2();
            _this16.last = new Vector2();
            _this16.delta = new Vector2();
            _this16.move = new Vector2();
            _this16.velocity = new Vector2();
            var distance = void 0,
                timeDown = void 0,
                timeMove = void 0;

            addListeners();

            function addListeners() {
                if (object === Stage) Interaction.bind('touchstart', down);else object.bind('touchstart', down);
                Interaction.bind('touchmove', move);
                Interaction.bind('touchend', up);
            }

            function down(e) {
                e.preventDefault();
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
                var delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
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
                var delta = Math.max(0.001, Render.TIME - (timeMove || Render.TIME));
                if (delta > 100) {
                    self.delta.x = 0;
                    self.delta.y = 0;
                }
                self.events.fire(Interaction.END, e, true);
                if (distance < 20 && Render.TIME - timeDown < 2000) self.events.fire(Interaction.CLICK, e, true);
            }

            _this16.destroy = function () {
                Interaction.unbind('touchstart', down);
                Interaction.unbind('touchmove', move);
                Interaction.unbind('touchend', up);
                if (object !== Stage && object.unbind) object.unbind('touchstart', down);
                return _get(Interaction.prototype.__proto__ || Object.getPrototypeOf(Interaction.prototype), 'destroy', _this16).call(_this16);
            };
            return _this16;
        }

        return Interaction;
    }(Component);

    /**
     * Asset loader with promise method.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var AssetLoader = function (_Component2) {
        _inherits(AssetLoader, _Component2);

        function AssetLoader(assets, callback) {
            _classCallCheck(this, AssetLoader);

            if (Array.isArray(assets)) {
                assets = function () {
                    var keys = assets.map(function (path) {
                        return Utils.basename(path);
                    });
                    return keys.reduce(function (o, k, i) {
                        o[k] = assets[i];
                        return o;
                    }, {});
                }();
            }

            var _this17 = _possibleConstructorReturn(this, (AssetLoader.__proto__ || Object.getPrototypeOf(AssetLoader)).call(this));

            var self = _this17;
            var total = Object.keys(assets).length;
            var loaded = 0;

            for (var key in assets) {
                loadAsset(key, assets[key]);
            }function loadAsset(key, asset) {
                var ext = Utils.extension(asset);
                if (ext.includes(['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                    Assets.createImage(asset, assetLoaded);
                    return;
                }
                if (ext.includes(['mp3', 'm4a', 'ogg', 'wav', 'aif'])) {
                    if (!window.AudioContext || !window.WebAudio) return assetLoaded();
                    window.WebAudio.createSound(key, asset, assetLoaded);
                    return;
                }
                window.get(Assets.getPath(asset)).then(function (data) {
                    if (ext === 'json') Assets.storeData(key, data);
                    if (ext === 'js') window.eval(data.replace('use strict', ''));
                    assetLoaded();
                }).catch(function () {
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
            return _this17;
        }

        _createClass(AssetLoader, null, [{
            key: 'loadAssets',
            value: function loadAssets(assets, callback) {
                var promise = Promise.create();
                if (!callback) callback = promise.resolve;
                promise.loader = new AssetLoader(assets, callback);
                return promise;
            }
        }]);

        return AssetLoader;
    }(Component);

    /**
     * Loader helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var MultiLoader = function (_Component3) {
        _inherits(MultiLoader, _Component3);

        function MultiLoader() {
            _classCallCheck(this, MultiLoader);

            var _this18 = _possibleConstructorReturn(this, (MultiLoader.__proto__ || Object.getPrototypeOf(MultiLoader)).call(this));

            var self = _this18;
            var loaders = [];
            var loaded = 0;

            function progress() {
                var percent = 0;
                for (var i = 0; i < loaders.length; i++) {
                    percent += loaders[i].percent || 0;
                }percent /= loaders.length;
                self.events.fire(Events.PROGRESS, { percent: percent }, true);
            }

            function complete() {
                if (++loaded === loaders.length) self.events.fire(Events.COMPLETE, null, true);
            }

            _this18.push = function (loader) {
                loaders.push(loader);
                _this18.events.add(loader, Events.PROGRESS, progress);
                _this18.events.add(loader, Events.COMPLETE, complete);
            };

            _this18.complete = function () {
                _this18.events.fire(Events.PROGRESS, { percent: 1 }, true);
                _this18.events.fire(Events.COMPLETE, null, true);
            };
            return _this18;
        }

        return MultiLoader;
    }(Component);

    /**
     * Font loader with promise method.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var FontLoader = function (_Component4) {
        _inherits(FontLoader, _Component4);

        function FontLoader(fonts, callback) {
            _classCallCheck(this, FontLoader);

            var _this19 = _possibleConstructorReturn(this, (FontLoader.__proto__ || Object.getPrototypeOf(FontLoader)).call(this));

            var self = _this19;
            var context = void 0;

            initFonts();

            function initFonts() {
                if (!Array.isArray(fonts)) fonts = [fonts];
                context = document.createElement('canvas').getContext('2d');
                fonts.forEach(function (font) {
                    return renderText(font.replace(/"/g, '\''));
                });
                finish();
            }

            function renderText(font) {
                context.font = '12px "' + font + '"';
                context.fillText('LOAD', 0, 0);
            }

            function finish() {
                var ready = function ready() {
                    self.percent = 1;
                    self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
                    self.events.fire(Events.COMPLETE, null, true);
                    if (callback) callback();
                };
                if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);else self.delayedCall(ready, 500);
            }
            return _this19;
        }

        _createClass(FontLoader, null, [{
            key: 'loadFonts',
            value: function loadFonts(fonts, callback) {
                var promise = Promise.create();
                if (!callback) callback = promise.resolve;
                promise.loader = new FontLoader(fonts, callback);
                return promise;
            }
        }]);

        return FontLoader;
    }(Component);

    /**
     * State dispatcher.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var StateDispatcher = function (_Component5) {
        _inherits(StateDispatcher, _Component5);

        function StateDispatcher(forceHash) {
            _classCallCheck(this, StateDispatcher);

            var _this20 = _possibleConstructorReturn(this, (StateDispatcher.__proto__ || Object.getPrototypeOf(StateDispatcher)).call(this));

            var self = _this20;
            _this20.locked = false;
            var storePath = void 0,
                storeState = void 0,
                rootPath = '/';

            createListener();
            storePath = getPath();

            function createListener() {
                if (forceHash) window.addEventListener('hashchange', hashChange, true);else window.addEventListener('popstate', popState, true);
            }

            function hashChange() {
                handleStateChange(null, getPath());
            }

            function popState(e) {
                handleStateChange(e.state, getPath());
            }

            function getPath() {
                if (forceHash) return location.hash.slice(3);
                return rootPath !== '/' ? location.pathname.split(rootPath)[1] : location.pathname.slice(1) || '';
            }

            function handleStateChange(state, path) {
                if (path !== storePath) {
                    if (!self.locked) {
                        storePath = path;
                        storeState = state;
                        self.events.fire(Events.UPDATE, { value: state, path: path }, true);
                    } else if (storePath) {
                        if (forceHash) location.hash = '!/' + storePath;else history.pushState(storeState, null, rootPath + storePath);
                    }
                }
            }

            _this20.getState = function () {
                var path = getPath();
                return { value: storeState, path: path };
            };

            _this20.setState = function (state, path) {
                if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') {
                    path = state;
                    state = null;
                }
                if (path !== storePath) {
                    storePath = path;
                    storeState = state;
                    if (forceHash) location.hash = '!/' + path;else history.pushState(state, null, rootPath + path);
                }
            };

            _this20.replaceState = function (state, path) {
                if ((typeof state === 'undefined' ? 'undefined' : _typeof(state)) !== 'object') {
                    path = state;
                    state = null;
                }
                if (path !== storePath) {
                    storePath = path;
                    storeState = state;
                    if (forceHash) history.replaceState(null, null, '#!/' + path);else history.replaceState(state, null, rootPath + path);
                }
            };

            _this20.setTitle = function (title) {
                return document.title = title;
            };

            _this20.lock = function () {
                return _this20.locked = true;
            };

            _this20.unlock = function () {
                return _this20.locked = false;
            };

            _this20.forceHash = function () {
                return forceHash = true;
            };

            _this20.setPathRoot = function (path) {
                if (path.charAt(0) === '/') rootPath = path;else rootPath = '/' + path;
            };

            _this20.destroy = function () {
                window.removeEventListener('hashchange', hashChange, true);
                window.removeEventListener('popstate', popState, true);
                return _get(StateDispatcher.prototype.__proto__ || Object.getPrototypeOf(StateDispatcher.prototype), 'destroy', _this20).call(_this20);
            };
            return _this20;
        }

        return StateDispatcher;
    }(Component);

    /**
     * Storage helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Storage = function () {
        function Storage() {
            _classCallCheck(this, Storage);
        }

        _createClass(Storage, null, [{
            key: 'set',
            value: function set(key, value) {
                if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') value = JSON.stringify(value);
                if (value === null) window.localStorage.removeItem(key);else window.localStorage[key] = value;
            }
        }, {
            key: 'get',
            value: function get(key) {
                var value = window.localStorage[key];
                if (value) {
                    var char0 = void 0;
                    if (value.charAt) char0 = value.charAt(0);
                    if (char0 === '{' || char0 === '[') value = JSON.parse(value);
                    if (value === 'true' || value === 'false') value = value === 'true';
                }
                return value;
            }
        }]);

        return Storage;
    }();

    /**
     * Canvas values.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasValues = function () {
        function CanvasValues(style) {
            _classCallCheck(this, CanvasValues);

            this.styles = {};
            if (!style) this.data = new Float32Array(6);else this.styled = false;
        }

        _createClass(CanvasValues, [{
            key: 'setTRSA',
            value: function setTRSA(x, y, r, sx, sy, a) {
                var m = this.data;
                m[0] = x;
                m[1] = y;
                m[2] = r;
                m[3] = sx;
                m[4] = sy;
                m[5] = a;
            }
        }, {
            key: 'calculate',
            value: function calculate(values) {
                var v = values.data,
                    m = this.data;
                m[0] = m[0] + v[0];
                m[1] = m[1] + v[1];
                m[2] = m[2] + v[2];
                m[3] = m[3] * v[3];
                m[4] = m[4] * v[4];
                m[5] = m[5] * v[5];
            }
        }, {
            key: 'calculateStyle',
            value: function calculateStyle(parent) {
                if (!parent.styled) return false;
                this.styled = true;
                var values = parent.values;
                for (var key in values) {
                    if (!this.styles[key]) this.styles[key] = values[key];
                }
            }
        }, {
            key: 'shadowOffsetX',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowOffsetX = val;
            },
            get: function get() {
                return this.styles.shadowOffsetX;
            }
        }, {
            key: 'shadowOffsetY',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowOffsetY = val;
            },
            get: function get() {
                return this.styles.shadowOffsetY;
            }
        }, {
            key: 'shadowBlur',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowBlur = val;
            },
            get: function get() {
                return this.styles.shadowBlur;
            }
        }, {
            key: 'shadowColor',
            set: function set(val) {
                this.styled = true;
                this.styles.shadowColor = val;
            },
            get: function get() {
                return this.styles.shadowColor;
            }
        }, {
            key: 'values',
            get: function get() {
                return this.styles;
            }
        }]);

        return CanvasValues;
    }();

    /**
     * Canvas object.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasObject = function () {
        function CanvasObject() {
            _classCallCheck(this, CanvasObject);

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

        _createClass(CanvasObject, [{
            key: 'updateValues',
            value: function updateValues() {
                this.values.setTRSA(this.x, this.y, Math.radians(this.rotation), this.scaleX || this.scale, this.scaleY || this.scale, this.opacity);
                if (this.parent.values) this.values.calculate(this.parent.values);
                if (this.parent.styles) this.styles.calculateStyle(this.parent.styles);
            }
        }, {
            key: 'render',
            value: function render(override) {
                if (!this.visible) return false;
                this.updateValues();
                if (this.draw) this.draw(override);
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].render(override);
                }
            }
        }, {
            key: 'startDraw',
            value: function startDraw() {
                var ox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var oy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var override = arguments[2];

                var context = this.canvas.context,
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
                    var values = this.styles.values;
                    for (var key in values) {
                        context[key] = values[key];
                    }
                }
            }
        }, {
            key: 'endDraw',
            value: function endDraw() {
                this.canvas.context.restore();
            }
        }, {
            key: 'add',
            value: function add(child) {
                child.setCanvas(this.canvas);
                child.parent = this;
                this.children.push(child);
                child.z = this.children.length;
            }
        }, {
            key: 'setCanvas',
            value: function setCanvas(canvas) {
                this.canvas = canvas;
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].setCanvas(canvas);
                }
            }
        }, {
            key: 'remove',
            value: function remove(child) {
                child.canvas = null;
                child.parent = null;
                this.children.remove(child);
            }
        }, {
            key: 'isMask',
            value: function isMask() {
                var obj = this;
                while (obj) {
                    if (obj.masked) return true;
                    obj = obj.parent;
                }
                return false;
            }
        }, {
            key: 'unmask',
            value: function unmask() {
                this.masked.mask(null);
                this.masked = null;
            }
        }, {
            key: 'setZ',
            value: function setZ(z) {
                this.z = z;
                this.parent.children.sort(function (a, b) {
                    return a.z - b.z;
                });
            }
        }, {
            key: 'follow',
            value: function follow(object) {
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
        }, {
            key: 'visible',
            value: function visible() {
                this.visible = true;
                return this;
            }
        }, {
            key: 'invisible',
            value: function invisible() {
                this.visible = false;
                return this;
            }
        }, {
            key: 'transform',
            value: function transform(props) {
                for (var key in props) {
                    if (typeof props[key] === 'number') this[key] = props[key];
                }return this;
            }
        }, {
            key: 'transformPoint',
            value: function transformPoint(x, y) {
                this.px = typeof x === 'number' ? x : this.width * (parseFloat(x) / 100);
                this.py = typeof y === 'number' ? y : this.height * (parseFloat(y) / 100);
                return this;
            }
        }, {
            key: 'clip',
            value: function clip(x, y, w, h) {
                this.clipX = x;
                this.clipY = y;
                this.clipWidth = w;
                this.clipHeight = h;
                return this;
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                if (this.children) for (var i = this.children.length - 1; i >= 0; i--) {
                    this.children[i].destroy();
                }return Utils.nullObject(this);
            }
        }]);

        return CanvasObject;
    }();

    /**
     * Canvas graphics.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasGraphics = function (_CanvasObject) {
        _inherits(CanvasGraphics, _CanvasObject);

        function CanvasGraphics() {
            var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;

            _classCallCheck(this, CanvasGraphics);

            var _this21 = _possibleConstructorReturn(this, (CanvasGraphics.__proto__ || Object.getPrototypeOf(CanvasGraphics)).call(this));

            var self = _this21;
            _this21.width = w;
            _this21.height = h;
            _this21.props = {};
            var draw = [],
                mask = void 0;

            function setProperties(context) {
                for (var key in self.props) {
                    context[key] = self.props[key];
                }
            }

            _this21.draw = function (override) {
                if (_this21.isMask() && !override) return false;
                var context = _this21.canvas.context;
                _this21.startDraw(_this21.px, _this21.py, override);
                setProperties(context);
                if (_this21.clipWidth && _this21.clipHeight) {
                    context.beginPath();
                    context.rect(_this21.clipX, _this21.clipY, _this21.clipWidth, _this21.clipHeight);
                    context.clip();
                }
                for (var i = 0; i < draw.length; i++) {
                    var cmd = draw[i];
                    if (!cmd) continue;
                    var fn = cmd.shift();
                    context[fn].apply(context, cmd);
                    cmd.unshift(fn);
                }
                _this21.endDraw();
                if (mask) {
                    context.globalCompositeOperation = mask.blendMode;
                    mask.render(true);
                }
            };

            _this21.clear = function () {
                for (var i = draw.length - 1; i >= 0; i--) {
                    draw[i].length = 0;
                }draw.length = 0;
            };

            _this21.arc = function () {
                var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this21.radius || _this21.width / 2;
                var startAngle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
                var endAngle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Math.PI * 2;
                var anti = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

                if (x && !y) {
                    startAngle = Math.radians(-90), endAngle = x;
                    x = 0;
                    y = 0;
                }
                draw.push(['arc', x, y, radius, startAngle, endAngle, anti]);
            };

            _this21.quadraticCurveTo = function (cpx, cpy, x, y) {
                draw.push(['quadraticCurveTo', cpx, cpy, x, y]);
            };

            _this21.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                draw.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
            };

            _this21.fillRect = function (x, y, w, h) {
                draw.push(['fillRect', x, y, w, h]);
            };

            _this21.clearRect = function (x, y, w, h) {
                draw.push(['clearRect', x, y, w, h]);
            };

            _this21.strokeRect = function (x, y, w, h) {
                draw.push(['strokeRect', x, y, w, h]);
            };

            _this21.moveTo = function (x, y) {
                draw.push(['moveTo', x, y]);
            };

            _this21.lineTo = function (x, y) {
                draw.push(['lineTo', x, y]);
            };

            _this21.stroke = function () {
                draw.push(['stroke']);
            };

            _this21.fill = function () {
                if (!mask) draw.push(['fill']);
            };

            _this21.beginPath = function () {
                draw.push(['beginPath']);
            };

            _this21.closePath = function () {
                draw.push(['closePath']);
            };

            _this21.fillText = function (text) {
                var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

                draw.push(['fillText', text, x, y]);
            };

            _this21.strokeText = function (text) {
                var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

                draw.push(['strokeText', text, x, y]);
            };

            _this21.setLineDash = function (value) {
                draw.push(['setLineDash', value]);
            };

            _this21.drawImage = function (img) {
                var sx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var sy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var sWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : img.width;
                var sHeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : img.height;
                var dx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
                var dy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
                var dWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : img.width;
                var dHeight = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : img.height;

                draw.push(['drawImage', img, sx, sy, sWidth, sHeight, dx + -_this21.px, dy + -_this21.py, dWidth, dHeight]);
            };

            _this21.mask = function (object) {
                if (!object) return mask = null;
                mask = object;
                object.masked = _this21;
                for (var i = 0; i < draw.length; i++) {
                    if (draw[i][0] === 'fill' || draw[i][0] === 'stroke') {
                        draw[i].length = 0;
                        draw.splice(i, 1);
                    }
                }
            };

            _this21.clone = function () {
                var object = new CanvasGraphics(_this21.width, _this21.height);
                object.visible = _this21.visible;
                object.blendMode = _this21.blendMode;
                object.opacity = _this21.opacity;
                object.follow(_this21);
                object.props = Utils.cloneObject(_this21.props);
                object.setDraw(Utils.cloneArray(draw));
                return object;
            };

            _this21.setDraw = function (array) {
                draw = array;
            };
            return _this21;
        }

        _createClass(CanvasGraphics, [{
            key: 'strokeStyle',
            set: function set(val) {
                this.props.strokeStyle = val;
            },
            get: function get() {
                return this.props.strokeStyle;
            }
        }, {
            key: 'fillStyle',
            set: function set(val) {
                this.props.fillStyle = val;
            },
            get: function get() {
                return this.props.fillStyle;
            }
        }, {
            key: 'lineWidth',
            set: function set(val) {
                this.props.lineWidth = val;
            },
            get: function get() {
                return this.props.lineWidth;
            }
        }, {
            key: 'lineCap',
            set: function set(val) {
                this.props.lineCap = val;
            },
            get: function get() {
                return this.props.lineCap;
            }
        }, {
            key: 'lineDashOffset',
            set: function set(val) {
                this.props.lineDashOffset = val;
            },
            get: function get() {
                return this.props.lineDashOffset;
            }
        }, {
            key: 'lineJoin',
            set: function set(val) {
                this.props.lineJoin = val;
            },
            get: function get() {
                return this.props.lineJoin;
            }
        }, {
            key: 'miterLimit',
            set: function set(val) {
                this.props.miterLimit = val;
            },
            get: function get() {
                return this.props.miterLimit;
            }
        }, {
            key: 'font',
            set: function set(val) {
                this.props.font = val;
            },
            get: function get() {
                return this.props.font;
            }
        }, {
            key: 'textAlign',
            set: function set(val) {
                this.props.textAlign = val;
            },
            get: function get() {
                return this.props.textAlign;
            }
        }, {
            key: 'textBaseline',
            set: function set(val) {
                this.props.textBaseline = val;
            },
            get: function get() {
                return this.props.textBaseline;
            }
        }]);

        return CanvasGraphics;
    }(CanvasObject);

    /**
     * Canvas interface.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Canvas = function Canvas(w) {
        var _this22 = this;

        var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : w;
        var whiteAlpha = arguments[2];

        _classCallCheck(this, Canvas);

        var self = this;
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.object = new Interface(this.element);
        this.children = [];

        size(w, h);

        function size(w, h) {
            self.element.width = w * 2;
            self.element.height = h * 2;
            self.width = w;
            self.height = h;
            self.scale = 2;
            self.object.size(self.width, self.height);
            self.context.scale(2, 2);
            self.element.style.width = w + 'px';
            self.element.style.height = h + 'px';
            if (whiteAlpha) {
                var alpha = new CanvasGraphics(self.width, self.height);
                alpha.fillStyle = 'rgba(255, 255, 255, 0.002)';
                alpha.fillRect(0, 0, self.width, self.height);
                alpha.setCanvas(self);
                alpha.parent = self;
                self.children[0] = alpha;
                alpha.z = 1;
            }
        }

        this.size = size;

        this.toDataURL = function (type, quality) {
            return _this22.element.toDataURL(type, quality);
        };

        this.render = function (noClear) {
            if (!(typeof noClear === 'boolean' && noClear)) _this22.clear();
            for (var i = 0; i < _this22.children.length; i++) {
                _this22.children[i].render();
            }
        };

        this.clear = function () {
            _this22.context.clearRect(0, 0, _this22.element.width, _this22.element.height);
        };

        this.add = function (child) {
            child.setCanvas(_this22);
            child.parent = _this22;
            _this22.children.push(child);
            child.z = _this22.children.length;
        };

        this.remove = function (child) {
            child.canvas = null;
            child.parent = null;
            _this22.children.remove(child);
        };

        this.destroy = function () {
            if (_this22.children) for (var i = _this22.children.length - 1; i >= 0; i--) {
                _this22.children[i].destroy();
            }_this22.object.destroy();
            return Utils.nullObject(_this22);
        };

        this.getImageData = function () {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this22.element.width;
            var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _this22.element.height;

            _this22.imageData = _this22.context.getImageData(x, y, w, h);
            return _this22.imageData;
        };

        this.getPixel = function (x, y, dirty) {
            if (!_this22.imageData || dirty) _this22.getImageData();
            var imgData = {},
                index = (x + y * _this22.element.width) * 4,
                pixels = _this22.imageData.data;
            imgData.r = pixels[index];
            imgData.g = pixels[index + 1];
            imgData.b = pixels[index + 2];
            imgData.a = pixels[index + 3];
            return imgData;
        };

        this.putImageData = function (imageData) {
            _this22.context.putImageData(imageData, 0, 0);
        };
    };

    /**
     * Canvas texture.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasTexture = function (_CanvasObject2) {
        _inherits(CanvasTexture, _CanvasObject2);

        function CanvasTexture(texture) {
            var w = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var h = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : w;

            _classCallCheck(this, CanvasTexture);

            var _this23 = _possibleConstructorReturn(this, (CanvasTexture.__proto__ || Object.getPrototypeOf(CanvasTexture)).call(this));

            var self = _this23;
            _this23.width = w;
            _this23.height = h;
            var mask = void 0;

            initTexture();

            function initTexture() {
                if (typeof texture === 'string') {
                    Assets.loadImage(texture).then(function (image) {
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

            _this23.draw = function (override) {
                if (_this23.isMask() && !override) return false;
                var context = _this23.canvas.context;
                if (_this23.texture) {
                    _this23.startDraw(_this23.px, _this23.py, override);
                    context.drawImage(_this23.texture, -_this23.px, -_this23.py, _this23.width, _this23.height);
                    _this23.endDraw();
                }
                if (mask) {
                    context.globalCompositeOperation = 'source-in';
                    mask.render(true);
                    context.globalCompositeOperation = 'source-over';
                }
            };

            _this23.mask = function (object) {
                if (!object) return mask = null;
                mask = object;
                object.masked = _this23;
            };
            return _this23;
        }

        return CanvasTexture;
    }(CanvasObject);

    /**
     * Canvas font utilities.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var CanvasFont = function () {
        function CanvasFont() {
            _classCallCheck(this, CanvasFont);
        }

        _createClass(CanvasFont, null, [{
            key: 'createText',
            value: function createText(canvas, width, height, str, font, fillStyle, _ref) {
                var _ref$textBaseline = _ref.textBaseline,
                    textBaseline = _ref$textBaseline === undefined ? 'alphabetic' : _ref$textBaseline,
                    _ref$lineHeight = _ref.lineHeight,
                    lineHeight = _ref$lineHeight === undefined ? height : _ref$lineHeight,
                    _ref$letterSpacing = _ref.letterSpacing,
                    letterSpacing = _ref$letterSpacing === undefined ? 0 : _ref$letterSpacing,
                    _ref$textAlign = _ref.textAlign,
                    textAlign = _ref$textAlign === undefined ? 'start' : _ref$textAlign;

                var context = canvas.context;
                if (height === lineHeight) {
                    return createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign);
                } else {
                    var text = new CanvasGraphics(width, height),
                        words = str.split(' '),
                        lines = [];
                    var line = '';
                    text.totalWidth = 0;
                    text.totalHeight = 0;
                    context.font = font;
                    for (var n = 0; n < words.length; n++) {
                        var testLine = line + words[n] + ' ',
                            characters = testLine.split('');
                        var testWidth = 0;
                        for (var i = 0; i < characters.length; i++) {
                            testWidth += context.measureText(characters[i]).width + letterSpacing;
                        }if (testWidth > width && n > 0) {
                            lines.push(line);
                            line = words[n] + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    lines.push(line);
                    lines.forEach(function (line, i) {
                        var graphics = createText(canvas, width, lineHeight, line.slice(0, -1), font, fillStyle, textBaseline, letterSpacing, textAlign);
                        graphics.y = i * lineHeight;
                        text.add(graphics);
                        text.totalWidth = Math.max(graphics.totalWidth, text.totalWidth);
                        text.totalHeight += lineHeight;
                    });
                    return text;
                }

                function createText(canvas, width, height, str, font, fillStyle, textBaseline, letterSpacing, textAlign) {
                    var context = canvas.context,
                        graphics = new CanvasGraphics(width, height);
                    graphics.font = font;
                    graphics.fillStyle = fillStyle;
                    graphics.textBaseline = textBaseline;
                    graphics.totalWidth = 0;
                    graphics.totalHeight = height;
                    var characters = str.split('');
                    var chr = void 0,
                        index = 0,
                        currentPosition = 0;
                    context.font = font;
                    for (var _i2 = 0; _i2 < characters.length; _i2++) {
                        graphics.totalWidth += context.measureText(characters[_i2]).width + letterSpacing;
                    }switch (textAlign) {
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
        }]);

        return CanvasFont;
    }();

    /**
     * Color helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Color = function Color(value) {
        var _this24 = this;

        _classCallCheck(this, Color);

        var self = this;
        this.r = 1;
        this.g = 1;
        this.b = 1;

        set(value);

        function set(value) {
            if (value instanceof Color) copy(value);else if (typeof value === 'number') setHex(value);else if (Array.isArray(value)) setRGB(value);else setHex(Number('0x' + value.slice(1)));
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
            if (t < 0) t += 1;else if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
            return p;
        }

        this.set = function (value) {
            set(value);
            return _this24;
        };

        this.setRGB = function (r, g, b) {
            _this24.r = r;
            _this24.g = g;
            _this24.b = b;
            return _this24;
        };

        this.setHSL = function (h, s, l) {
            if (s === 0) {
                _this24.r = _this24.g = _this24.b = l;
            } else {
                var p = l <= 0.5 ? l * (1 + s) : l + s - l * s,
                    q = 2 * l - p;
                _this24.r = hue2rgb(q, p, h + 1 / 3);
                _this24.g = hue2rgb(q, p, h);
                _this24.b = hue2rgb(q, p, h - 1 / 3);
            }
            return _this24;
        };

        this.offsetHSL = function (h, s, l) {
            var hsl = _this24.getHSL();
            hsl.h += h;
            hsl.s += s;
            hsl.l += l;
            _this24.setHSL(hsl.h, hsl.s, hsl.l);
            return _this24;
        };

        this.getStyle = function (a) {
            if (a) return 'rgba(' + (_this24.r * 255 | 0) + ', ' + (_this24.g * 255 | 0) + ', ' + (_this24.b * 255 | 0) + ', ' + a + ')';else return 'rgb(' + (_this24.r * 255 | 0) + ', ' + (_this24.g * 255 | 0) + ', ' + (_this24.b * 255 | 0) + ')';
        };

        this.getHex = function () {
            return _this24.r * 255 << 16 ^ _this24.g * 255 << 8 ^ _this24.b * 255 << 0;
        };

        this.getHexString = function () {
            return '#' + ('000000' + _this24.getHex().toString(16)).slice(-6);
        };

        this.getHSL = function () {
            if (!_this24.hsl) _this24.hsl = { h: 0, s: 0, l: 0 };
            var hsl = _this24.hsl,
                r = _this24.r,
                g = _this24.g,
                b = _this24.b,
                min = Math.min(r, g, b),
                max = Math.max(r, g, b),
                lightness = (min + max) / 2;
            var hue = void 0,
                saturation = void 0;
            if (min === max) {
                hue = 0;
                saturation = 0;
            } else {
                var delta = max - min;
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

        this.add = function (color) {
            _this24.r += color.r;
            _this24.g += color.g;
            _this24.b += color.b;
        };

        this.mix = function (color, percent) {
            _this24.r *= 1 - percent + color.r * percent;
            _this24.g *= 1 - percent + color.g * percent;
            _this24.b *= 1 - percent + color.b * percent;
        };

        this.addScalar = function (s) {
            _this24.r += s;
            _this24.g += s;
            _this24.b += s;
        };

        this.multiply = function (color) {
            _this24.r *= color.r;
            _this24.g *= color.g;
            _this24.b *= color.b;
        };

        this.multiplyScalar = function (s) {
            _this24.r *= s;
            _this24.g *= s;
            _this24.b *= s;
        };

        this.clone = function () {
            return new Color([_this24.r, _this24.g, _this24.b]);
        };

        this.toArray = function () {
            if (!_this24.array) _this24.array = [];
            _this24.array[0] = _this24.r;
            _this24.array[1] = _this24.g;
            _this24.array[2] = _this24.b;
            return _this24.array;
        };

        this.random = function () {
            var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            if (color.length < 7) color = _this24.random();
            return color;
        };
    };

    /**
     * Video interface.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Video = function (_Component6) {
        _inherits(Video, _Component6);

        function Video(params) {
            _classCallCheck(this, Video);

            var _this25 = _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this));

            var self = _this25;
            _this25.loaded = {
                start: 0,
                end: 0,
                percent: 0
            };
            var event = {};
            var lastTime = void 0,
                buffering = void 0,
                seekTo = void 0,
                forceRender = void 0,
                tick = 0;

            createElement();
            if (params.preload !== false) preload();

            function createElement() {
                var src = params.src;
                self.element = document.createElement('video');
                if (src) self.element.src = Assets.getPath(src);
                self.element.controls = params.controls;
                self.element.id = params.id || '';
                self.element.width = params.width;
                self.element.height = params.height;
                self.element.loop = params.loop;
                self.object = new Interface(self.element);
                self.width = params.width;
                self.height = params.height;
                self.object.size(self.width, self.height);
                if (Device.mobile) {
                    self.object.attr('webkit-playsinline', true);
                    self.object.attr('playsinline', true);
                }
            }

            function preload() {
                self.element.preload = 'auto';
                self.element.load();
            }

            function step() {
                if (!self.element) return self.stopRender(step);
                self.duration = self.element.duration;
                self.time = self.element.currentTime;
                if (self.element.currentTime === lastTime) {
                    tick++;
                    if (tick > 30 && !buffering) {
                        buffering = true;
                        self.events.fire(Events.ERROR, null, true);
                    }
                } else {
                    tick = 0;
                    if (buffering) {
                        self.events.fire(Events.READY, null, true);
                        buffering = false;
                    }
                }
                lastTime = self.element.currentTime;
                if (self.element.currentTime >= (self.duration || self.element.duration) - 0.001) {
                    if (!self.loop) {
                        if (!forceRender) self.stopRender(step);
                        self.events.fire(Events.COMPLETE, null, true);
                    }
                }
                event.time = self.element.currentTime;
                event.duration = self.element.duration;
                event.loaded = self.loaded;
                self.events.fire(Events.UPDATE, event, true);
            }

            function checkReady() {
                if (!self.element) return false;
                if (!seekTo) {
                    self.buffered = self.element.readyState === self.element.HAVE_ENOUGH_DATA;
                } else {
                    var seekable = self.element.seekable;
                    var max = -1;
                    if (seekable) {
                        for (var i = 0; i < seekable.length; i++) {
                            if (seekable.start(i) < seekTo) max = seekable.end(i) - 0.5;
                        }if (max >= seekTo) self.buffered = true;
                    } else {
                        self.buffered = true;
                    }
                }
                if (self.buffered) {
                    self.stopRender(checkReady);
                    self.events.fire(Events.READY, null, true);
                }
            }

            function handleProgress() {
                if (!self.ready()) return;
                var bf = self.element.buffered,
                    time = self.element.currentTime;
                var range = 0;
                while (!(bf.start(range) <= time && time <= bf.end(range))) {
                    range += 1;
                }self.loaded.start = bf.start(range) / self.element.duration;
                self.loaded.end = bf.end(range) / self.element.duration;
                self.loaded.percent = self.loaded.end - self.loaded.start;
                self.events.fire(Events.PROGRESS, self.loaded, true);
            }

            _this25.play = function () {
                _this25.playing = true;
                _this25.element.play();
                _this25.startRender(step);
            };

            _this25.pause = function () {
                _this25.playing = false;
                _this25.element.pause();
                _this25.stopRender(step);
            };

            _this25.stop = function () {
                _this25.playing = false;
                _this25.element.pause();
                _this25.stopRender(step);
                if (_this25.ready()) _this25.element.currentTime = 0;
            };

            _this25.volume = function (v) {
                _this25.element.volume = v;
                if (_this25.muted) {
                    _this25.muted = false;
                    _this25.object.attr('muted', '');
                }
            };

            _this25.mute = function () {
                _this25.volume(0);
                _this25.muted = true;
                _this25.object.attr('muted', true);
            };

            _this25.seek = function (t) {
                if (_this25.element.readyState <= 1) {
                    _this25.delayedCall(function () {
                        if (_this25.seek) _this25.seek(t);
                    }, 32);
                    return;
                }
                _this25.element.currentTime = t;
            };

            _this25.canPlayTo = function (t) {
                seekTo = null;
                if (t) seekTo = t;
                if (!_this25.buffered) _this25.startRender(checkReady);
                return _this25.buffered;
            };

            _this25.ready = function () {
                return _this25.element.readyState > _this25.element.HAVE_CURRENT_DATA;
            };

            _this25.size = function (w, h) {
                _this25.element.width = _this25.width = w;
                _this25.element.height = _this25.height = h;
                _this25.object.size(_this25.width, _this25.height);
            };

            _this25.forceRender = function () {
                forceRender = true;
                _this25.startRender(step);
            };

            _this25.trackProgress = function () {
                _this25.element.addEventListener('progress', handleProgress, true);
            };

            _this25.destroy = function () {
                _this25.element.removeEventListener('progress', handleProgress, true);
                _this25.stop();
                _this25.element.src = '';
                _this25.object.destroy();
                return _get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), 'destroy', _this25).call(_this25);
            };
            return _this25;
        }

        _createClass(Video, [{
            key: 'loop',
            set: function set(bool) {
                this.element.loop = bool;
            },
            get: function get() {
                return this.element.loop;
            }
        }, {
            key: 'src',
            set: function set(src) {
                this.element.src = Assets.getPath(src);
            },
            get: function get() {
                return this.element.src;
            }
        }]);

        return Video;
    }(Component);

    /**
     * SVG interface.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var SVG = function SVG(name, type, params) {
        var _this26 = this;

        _classCallCheck(this, SVG);

        var self = this;
        var svg = void 0;

        createSVG();

        function createSVG() {
            switch (type) {
                case 'svg':
                    createView();
                    break;
                case 'radialGradient':
                    createGradient();
                    break;
                case 'linearGradient':
                    createGradient();
                    break;
                default:
                    createElement();
                    break;
            }
        }

        function createView() {
            svg = new Interface(name, 'svg');
            svg.element.setAttribute('preserveAspectRatio', 'xMinYMid meet');
            svg.element.setAttribute('version', '1.1');
            svg.element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            if (params.width) {
                svg.element.setAttribute('viewBox', '0 0 ' + params.width + ' ' + params.height);
                svg.element.style.width = params.width + 'px';
                svg.element.style.height = params.height + 'px';
            }
            self.object = svg;
        }

        function createElement() {
            svg = new Interface(name, 'svg', type);
            if (type === 'circle') setCircle();else if (type === 'radialGradient') setGradient();
            self.object = svg;
        }

        function setCircle() {
            ['cx', 'cy', 'r'].forEach(function (attr) {
                if (params.stroke && attr === 'r') svg.element.setAttributeNS(null, attr, params.width / 2 - params.stroke);else svg.element.setAttributeNS(null, attr, params.width / 2);
            });
        }

        function setGradient() {
            ['cx', 'cy', 'r', 'fx', 'fy', 'name'].forEach(function (attr) {
                svg.element.setAttributeNS(null, attr === 'name' ? 'id' : attr, params[attr]);
            });
            svg.element.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
        }

        function createColorStop(obj) {
            var stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            ['offset', 'style'].forEach(function (attr) {
                stop.setAttributeNS(null, attr, attr === 'style' ? 'stop-color:' + obj[attr] : obj[attr]);
            });
            return stop;
        }

        function createGradient() {
            createElement();
            params.colors.forEach(function (param) {
                svg.element.appendChild(createColorStop(param));
            });
        }

        this.addTo = function (element) {
            if (element.points) element = element.points;else if (element.element) element = element.element;else if (element.object) element = element.object.element;
            element.appendChild(svg.element);
        };

        this.destroy = function () {
            _this26.object.destroy();
            return Utils.nullObject(_this26);
        };
    };

    /**
     * Scroll interaction.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Scroll = function (_Component7) {
        _inherits(Scroll, _Component7);

        function Scroll(object, params) {
            _classCallCheck(this, Scroll);

            if (!object || !object.element) {
                params = object;
                object = null;
            }
            if (!params) params = {};

            var _this27 = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this));

            var self = _this27;
            _this27.x = 0;
            _this27.y = 0;
            _this27.max = {
                x: 0,
                y: 0
            };
            _this27.delta = {
                x: 0,
                y: 0
            };
            _this27.enabled = true;
            var scrollTarget = {
                x: 0,
                y: 0
            };
            var axes = ['x', 'y'];

            initParameters();
            addListeners();
            _this27.startRender(loop);

            function initParameters() {
                self.object = object;
                self.hitObject = params.hitObject || self.object;
                self.max.y = params.height || 0;
                self.max.x = params.width || 0;
                if (Array.isArray(params.axes)) axes = params.axes;
                if (self.object) self.object.css({ overflow: 'auto' });
            }

            function addListeners() {
                window.addEventListener('wheel', scroll, true);
                if (self.hitObject) self.hitObject.bind('touchstart', function (e) {
                    return e.preventDefault();
                });
                var input = self.hitObject ? self.hitObject.initClass(Interaction) : Mouse.input;
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
                axes.forEach(function (axis) {
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
                axes.forEach(function (axis) {
                    if (!self.max[axis]) return;
                    scrollTarget[axis] -= Mouse.input.delta[axis];
                });
            }

            function up() {
                if (!self.enabled) return;
                var m = function () {
                    if (Device.os === 'android') return 35;
                    return 25;
                }(),
                    obj = {};
                axes.forEach(function (axis) {
                    if (!self.max[axis]) return;
                    obj[axis] = scrollTarget[axis] - Mouse.input.delta[axis] * m;
                });
                TweenManager.tween(scrollTarget, obj, 2500, 'easeOutQuint');
            }

            function resize() {
                if (!self.enabled) return;
                stopInertia();
                if (!self.object) return;
                var p = {};
                if (Device.mobile) axes.forEach(function (axis) {
                    return p[axis] = self.max[axis] ? scrollTarget[axis] / self.max[axis] : 0;
                });
                if (typeof params.height === 'undefined') self.max.y = self.object.element.scrollHeight - self.object.element.clientHeight;
                if (typeof params.width === 'undefined') self.max.x = self.object.element.scrollWidth - self.object.element.clientWidth;
                if (Device.mobile) axes.forEach(function (axis) {
                    return self[axis] = scrollTarget[axis] = p[axis] * self.max[axis];
                });
            }

            function loop() {
                axes.forEach(function (axis) {
                    if (!self.max[axis]) return;
                    scrollTarget[axis] = Math.clamp(scrollTarget[axis], 0, self.max[axis]);
                    self.delta[axis] = scrollTarget[axis] - self[axis];
                    self[axis] += self.delta[axis];
                    if (self.object) {
                        if (axis === 'x') self.object.element.scrollLeft = self.x;
                        if (axis === 'y') self.object.element.scrollTop = self.y;
                    }
                });
            }

            _this27.destroy = function () {
                window.removeEventListener('wheel', scroll, true);
                return _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'destroy', _this27).call(_this27);
            };
            return _this27;
        }

        return Scroll;
    }(Component);

    /**
     * Slide interaction.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Slide = function (_Component8) {
        _inherits(Slide, _Component8);

        function Slide() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Slide);

            var _this28 = _possibleConstructorReturn(this, (Slide.__proto__ || Object.getPrototypeOf(Slide)).call(this));

            var self = _this28;
            _this28.x = 0;
            _this28.y = 0;
            _this28.max = {
                x: 0,
                y: 0
            };
            _this28.delta = {
                x: 0,
                y: 0
            };
            _this28.direction = {
                x: 0,
                y: 0
            };
            _this28.position = 0;
            _this28.progress = 0;
            _this28.floor = 0;
            _this28.ceil = 0;
            _this28.index = 0;
            _this28.enabled = true;
            var scrollTarget = {
                x: 0,
                y: 0
            },
                scrollInertia = {
                x: 0,
                y: 0
            },
                event = {};
            var axes = ['x', 'y'],
                slideIndex = void 0;

            initParameters();
            addListeners();
            _this28.startRender(loop);

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
                window.addEventListener('wheel', scroll, true);
                self.events.add(Mouse.input, Interaction.START, down);
                self.events.add(Mouse.input, Interaction.DRAG, drag);
                self.events.add(Events.KEYBOARD_DOWN, keyPress);
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
                axes.forEach(function (axis) {
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
                axes.forEach(function (axis) {
                    if (!self.max[axis]) return;
                    scrollTarget[axis] += -Mouse.input.delta[axis] * 4;
                    scrollInertia[axis] = -Mouse.input.delta[axis] * 4;
                    self.isInertia = true;
                });
            }

            function keyPress(e) {
                if (!self.enabled) return;
                if (e.keyCode === 40) self.next(); // Down
                if (e.keyCode === 39) self.next(); // Right
                if (e.keyCode === 38) self.prev(); // Up
                if (e.keyCode === 37) self.prev(); // Left
            }

            function resize() {
                if (!self.enabled) return;
                stopInertia();
            }

            function loop() {
                axes.forEach(function (axis) {
                    if (!self.max[axis]) return;
                    var progress = self[axis] / self.max[axis],
                        i = Math.round(progress);
                    if (scrollTarget[axis] === i * self.max[axis]) return;
                    if (scrollInertia[axis] !== 0) {
                        scrollInertia[axis] *= 0.9;
                        if (Math.abs(scrollInertia[axis]) < 0.001) scrollInertia[axis] = 0;
                        scrollTarget[axis] += scrollInertia[axis];
                    }
                    var limit = self.max[axis] * 0.035;
                    scrollTarget[axis] += Interpolation.Sine.Out(Math.round(self.progress) - self.progress) * limit;
                    if (Math.abs(scrollTarget[axis] - self[axis]) > limit) scrollTarget[axis] -= (scrollTarget[axis] - self[axis]) * 0.5;else if (Math.abs(scrollTarget[axis] - self[axis]) < 0.001) scrollTarget[axis] = i * self.max[axis];
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

            _this28.goto = function (i) {
                var obj = {};
                obj.x = i * _this28.max.x;
                obj.y = i * _this28.max.y;
                TweenManager.tween(scrollTarget, obj, 2500, 'easeOutQuint');
            };

            _this28.next = function () {
                var progress = (_this28.x + _this28.y) / (_this28.max.x + _this28.max.y),
                    i = Math.round(progress);
                _this28.goto(i + 1);
            };

            _this28.prev = function () {
                var progress = (_this28.x + _this28.y) / (_this28.max.x + _this28.max.y),
                    i = Math.round(progress);
                _this28.goto(i - 1);
            };

            _this28.destroy = function () {
                window.removeEventListener('wheel', scroll, true);
                return _get(Slide.prototype.__proto__ || Object.getPrototypeOf(Slide.prototype), 'destroy', _this28).call(_this28);
            };
            return _this28;
        }

        return Slide;
    }(Component);

    /**
     * Slide video.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var SlideVideo = function (_Component9) {
        _inherits(SlideVideo, _Component9);

        function SlideVideo(params, callback) {
            _classCallCheck(this, SlideVideo);

            if (!SlideVideo.initialized) {
                SlideVideo.test = SlideVideo.test || !Device.mobile && Device.browser !== 'safari' && !Device.detect('trident');

                SlideVideo.initialized = true;
            }

            var _this29 = _possibleConstructorReturn(this, (SlideVideo.__proto__ || Object.getPrototypeOf(SlideVideo)).call(this));

            var self = _this29;

            createElement();

            function createElement() {
                var src = params.src;
                if (src && SlideVideo.test) {
                    window.fetch(Assets.getPath(src)).then(function (response) {
                        if (!response.ok) return error();
                        response.blob().then(function (data) {
                            self.element = document.createElement('video');
                            self.element.src = URL.createObjectURL(data);
                            self.element.muted = true;
                            self.element.loop = true;
                            ready();
                            if (callback) callback();
                        });
                    }).catch(function () {
                        error();
                        if (callback) callback();
                    });
                } else {
                    var img = Assets.createImage(params.img);
                    img.onload = function () {
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
                self.element.addEventListener('playing', playing, true);
                self.element.addEventListener('pause', pause, true);
                if (self.willPlay) self.play();
            }

            function playing() {
                self.playing = true;
                self.events.fire(Events.READY, null, true);
            }

            function pause() {
                self.playing = false;
            }

            _this29.resume = function () {
                _this29.play(true);
            };

            _this29.play = function () {
                var resume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                _this29.willPlay = true;
                if (_this29.element && _this29.element.paused && !_this29.playing) {
                    if (!resume) _this29.element.currentTime = 0;
                    _this29.element.play();
                }
            };

            _this29.pause = function () {
                _this29.willPlay = false;
                if (_this29.element && !_this29.element.paused && _this29.playing) _this29.element.pause();
            };

            _this29.ready = function () {
                return _this29.element.readyState > _this29.element.HAVE_CURRENT_DATA;
            };

            _this29.destroy = function () {
                _this29.element.removeEventListener('playing', playing, true);
                _this29.element.removeEventListener('pause', pause, true);
                _this29.pause();
                _this29.element.src = '';
                return _get(SlideVideo.prototype.__proto__ || Object.getPrototypeOf(SlideVideo.prototype), 'destroy', _this29).call(_this29);
            };
            return _this29;
        }

        return SlideVideo;
    }(Component);

    /**
     * Slide loader with promise method.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var SlideLoader = function (_Component10) {
        _inherits(SlideLoader, _Component10);

        function SlideLoader(slides, callback) {
            _classCallCheck(this, SlideLoader);

            var _this30 = _possibleConstructorReturn(this, (SlideLoader.__proto__ || Object.getPrototypeOf(SlideLoader)).call(this));

            var self = _this30;
            _this30.list = [];
            _this30.pathList = [];
            var loaded = 0;

            slides.forEach(function (params) {
                _this30.list.push(new SlideVideo(params, slideLoaded));
                _this30.pathList.push(params.path);
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
            return _this30;
        }

        _createClass(SlideLoader, null, [{
            key: 'loadSlides',
            value: function loadSlides(slides, callback) {
                var promise = Promise.create();
                if (!callback) callback = promise.resolve;
                promise.loader = new SlideLoader(slides, callback);
                return promise;
            }
        }]);

        return SlideLoader;
    }(Component);

    /**
     * Linked list.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var LinkedList = function LinkedList() {
        var _this31 = this;

        _classCallCheck(this, LinkedList);

        this.first = null;
        this.last = null;
        this.current = null;
        this.prev = null;
        var nodes = [];

        function add(object) {
            return nodes[nodes.push({ object: object, prev: null, next: null }) - 1];
        }

        function remove(object) {
            for (var i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].object === object) {
                    nodes[i] = null;
                    nodes.splice(i, 1);
                    break;
                }
            }
        }

        function destroy() {
            for (var i = nodes.length - 1; i >= 0; i--) {
                nodes[i] = null;
                nodes.splice(i, 1);
            }
            return Utils.nullObject(this);
        }

        function find(object) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].object === object) return nodes[i];
            }return null;
        }

        this.push = function (object) {
            var obj = add(object);
            if (!_this31.first) {
                obj.next = obj.prev = _this31.last = _this31.first = obj;
            } else {
                obj.next = _this31.first;
                obj.prev = _this31.last;
                _this31.last.next = obj;
                _this31.last = obj;
            }
        };

        this.remove = function (object) {
            var obj = find(object);
            if (!obj || !obj.next) return;
            if (nodes.length <= 1) {
                _this31.empty();
            } else {
                if (obj === _this31.first) {
                    _this31.first = obj.next;
                    _this31.last.next = _this31.first;
                    _this31.first.prev = _this31.last;
                } else if (obj == _this31.last) {
                    _this31.last = obj.prev;
                    _this31.last.next = _this31.first;
                    _this31.first.prev = _this31.last;
                } else {
                    obj.prev.next = obj.next;
                    obj.next.prev = obj.prev;
                }
            }
            remove(object);
        };

        this.empty = function () {
            _this31.first = null;
            _this31.last = null;
            _this31.current = null;
            _this31.prev = null;
        };

        this.start = function () {
            _this31.current = _this31.first;
            _this31.prev = _this31.current;
            return _this31.current;
        };

        this.next = function () {
            if (!_this31.current) return;
            if (nodes.length === 1 || _this31.prev.next === _this31.first) return;
            _this31.current = _this31.current.next;
            _this31.prev = _this31.current;
            return _this31.current;
        };

        this.destroy = destroy;
    };

    /**
     * Object pool.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var ObjectPool = function ObjectPool(type, number) {
        var _this32 = this;

        _classCallCheck(this, ObjectPool);

        var pool = [];
        this.array = pool;

        if (type) for (var i = 0; i < number || 10; i++) {
            pool.push(new type());
        }this.get = function () {
            return pool.shift() || (type ? new type() : null);
        };

        this.empty = function () {
            pool.length = 0;
        };

        this.put = function (object) {
            pool.push(object);
        };

        this.insert = function (array) {
            if (!Array.isArray(array)) array = [array];
            pool.push.apply(pool, _toConsumableArray(array));
        };

        this.length = function () {
            return pool.length;
        };

        this.destroy = function () {
            for (var _i3 = pool.length - 1; _i3 >= 0; _i3--) {
                if (pool[_i3].destroy) pool[_i3].destroy();
            }return Utils.nullObject(_this32);
        };
    };

    /**
     * 3D vector.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Vector3 = function () {
        function Vector3(x, y, z, w) {
            _classCallCheck(this, Vector3);

            this.x = typeof x === 'number' ? x : 0;
            this.y = typeof y === 'number' ? y : 0;
            this.z = typeof z === 'number' ? z : 0;
            this.w = typeof w === 'number' ? w : 1;
            this.type = 'vector3';
        }

        _createClass(Vector3, [{
            key: 'set',
            value: function set(x, y, z, w) {
                this.x = x || 0;
                this.y = y || 0;
                this.z = z || 0;
                this.w = w || 1;
                return this;
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 1;
                return this;
            }
        }, {
            key: 'copyTo',
            value: function copyTo(p) {
                p.x = this.x;
                p.y = this.y;
                p.z = this.z;
                p.w = this.w;
                return p;
            }
        }, {
            key: 'copyFrom',
            value: function copyFrom(p) {
                this.x = p.x || 0;
                this.y = p.y || 0;
                this.z = p.z || 0;
                this.w = p.w || 1;
                return this;
            }
        }, {
            key: 'lengthSq',
            value: function lengthSq() {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            }
        }, {
            key: 'length',
            value: function length() {
                return Math.sqrt(this.lengthSq());
            }
        }, {
            key: 'normalize',
            value: function normalize() {
                var m = 1 / this.length();
                this.set(this.x * m, this.y * m, this.z * m);
                return this;
            }
        }, {
            key: 'setLength',
            value: function setLength(length) {
                this.normalize().multiply(length);
                return this;
            }
        }, {
            key: 'addVectors',
            value: function addVectors(a, b) {
                this.x = a.x + b.x;
                this.y = a.y + b.y;
                this.z = a.z + b.z;
                return this;
            }
        }, {
            key: 'subVectors',
            value: function subVectors(a, b) {
                this.x = a.x - b.x;
                this.y = a.y - b.y;
                this.z = a.z - b.z;
                return this;
            }
        }, {
            key: 'multiplyVectors',
            value: function multiplyVectors(a, b) {
                this.x = a.x * b.x;
                this.y = a.y * b.y;
                this.z = a.z * b.z;
                return this;
            }
        }, {
            key: 'add',
            value: function add(v) {
                this.x += v.x;
                this.y += v.y;
                this.z += v.z;
                return this;
            }
        }, {
            key: 'sub',
            value: function sub(v) {
                this.x -= v.x;
                this.y -= v.y;
                this.z -= v.z;
                return this;
            }
        }, {
            key: 'multiply',
            value: function multiply(v) {
                this.x *= v;
                this.y *= v;
                this.z *= v;
                return this;
            }
        }, {
            key: 'divide',
            value: function divide(v) {
                this.x /= v;
                this.y /= v;
                this.z /= v;
                return this;
            }
        }, {
            key: 'limit',
            value: function limit(max) {
                if (this.length() > max) {
                    this.normalize();
                    this.multiply(max);
                }
            }
        }, {
            key: 'heading2D',
            value: function heading2D() {
                return -Math.atan2(-this.y, this.x);
            }
        }, {
            key: 'lerp',
            value: function lerp(v, alpha) {
                this.x += (v.x - this.x) * alpha;
                this.y += (v.y - this.y) * alpha;
                this.z += (v.z - this.z) * alpha;
                return this;
            }
        }, {
            key: 'deltaLerp',
            value: function deltaLerp(v, alpha) {
                var delta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

                for (var i = 0; i < delta; i++) {
                    this.lerp(v, alpha);
                }return this;
            }
        }, {
            key: 'interp',
            value: function interp(v, alpha, ease) {
                var dist = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 5000;

                if (!this.calc) this.calc = new Vector3();
                this.calc.subVectors(this, v);
                var fn = Interpolation.convertEase(ease),
                    a = fn(Math.clamp(Math.range(this.calc.lengthSq(), 0, dist * dist, 1, 0), 0, 1) * (alpha / 10));
                return this.lerp(v, a);
            }
        }, {
            key: 'setAngleRadius',
            value: function setAngleRadius(a, r) {
                this.x = Math.cos(a) * r;
                this.y = Math.sin(a) * r;
                this.z = Math.sin(a) * r;
                return this;
            }
        }, {
            key: 'addAngleRadius',
            value: function addAngleRadius(a, r) {
                this.x += Math.cos(a) * r;
                this.y += Math.sin(a) * r;
                this.z += Math.sin(a) * r;
                return this;
            }
        }, {
            key: 'applyQuaternion',
            value: function applyQuaternion(q) {
                var x = this.x,
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
        }, {
            key: 'dot',
            value: function dot(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

                return a.x * b.x + a.y * b.y + a.z * b.z;
            }
        }, {
            key: 'clone',
            value: function clone() {
                return new Vector3(this.x, this.y, this.z);
            }
        }, {
            key: 'cross',
            value: function cross(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

                var x = a.y * b.z - a.z * b.y,
                    y = a.z * b.x - a.x * b.z,
                    z = a.x * b.y - a.y * b.x;
                this.set(x, y, z, this.w);
                return this;
            }
        }, {
            key: 'distanceTo',
            value: function distanceTo(v, noSq) {
                var dx = this.x - v.x,
                    dy = this.y - v.y,
                    dz = this.z - v.z;
                if (!noSq) return Math.sqrt(dx * dx + dy * dy + dz * dz);
                return dx * dx + dy * dy + dz * dz;
            }
        }, {
            key: 'solveAngle',
            value: function solveAngle(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

                return Math.acos(a.dot(b) / (a.length() * b.length() || 0.00001));
            }
        }, {
            key: 'solveAngle2D',
            value: function solveAngle2D(a) {
                var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;

                var calc = new Vector2(),
                    calc2 = new Vector2();
                calc.copyFrom(a);
                calc2.copyFrom(b);
                return calc.solveAngle(calc2);
            }
        }, {
            key: 'equals',
            value: function equals(v) {
                return this.x === v.x && this.y === v.y && this.z === v.z;
            }
        }, {
            key: 'toString',
            value: function toString() {
                var split = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';

                return this.x + split + this.y + split + this.z;
            }
        }]);

        return Vector3;
    }();

    /**
     * 3D utilities.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /* global THREE */

    var Utils3D = function () {
        function Utils3D() {
            _classCallCheck(this, Utils3D);
        }

        _createClass(Utils3D, null, [{
            key: 'decompose',
            value: function decompose(local, world) {
                local.matrixWorld.decompose(world.position, world.quaternion, world.scale);
            }
        }, {
            key: 'createDebug',
            value: function createDebug() {
                var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;
                var color = arguments[1];

                var geom = new THREE.IcosahedronGeometry(size, 1),
                    mat = color ? new THREE.MeshBasicMaterial({ color: color }) : new THREE.MeshNormalMaterial();
                return new THREE.Mesh(geom, mat);
            }
        }, {
            key: 'createRT',
            value: function createRT(width, height) {
                var params = {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat,
                    stencilBuffer: false
                };
                return new THREE.WebGLRenderTarget(width, height, params);
            }
        }, {
            key: 'getTexture',
            value: function getTexture(src) {
                if (!this.textures) this.textures = {};
                if (!this.textures[src]) {
                    var img = Assets.createImage(src),
                        texture = new THREE.Texture(img);
                    img.onload = function () {
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
        }, {
            key: 'setInfinity',
            value: function setInfinity(v) {
                var inf = Number.POSITIVE_INFINITY;
                v.set(inf, inf, inf);
                return v;
            }
        }, {
            key: 'freezeMatrix',
            value: function freezeMatrix(mesh) {
                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
            }
        }, {
            key: 'getCubemap',
            value: function getCubemap(src) {
                var _this33 = this;

                var path = 'cube_' + (Array.isArray(src) ? src[0] : src);
                if (!this.textures) this.textures = {};
                if (!this.textures[path]) {
                    var images = [];
                    for (var i = 0; i < 6; i++) {
                        var img = Assets.createImage(Array.isArray(src) ? src[i] : src);
                        images.push(img);
                        img.onload = function () {
                            return _this33.textures[path].needsUpdate = true;
                        };
                    }
                    this.textures[path] = new THREE.Texture(images);
                    this.textures[path].minFilter = THREE.LinearFilter;
                }
                return this.textures[path];
            }
        }, {
            key: 'loadObject',
            value: function loadObject(data) {
                if (!this.objectLoader) this.objectLoader = new THREE.ObjectLoader();
                return this.objectLoader.parse(data);
            }
        }, {
            key: 'loadGeometry',
            value: function loadGeometry(data) {
                if (!this.geomLoader) this.geomLoader = new THREE.JSONLoader();
                if (!this.bufferGeomLoader) this.bufferGeomLoader = new THREE.BufferGeometryLoader();
                if (data.type === 'BufferGeometry') return this.bufferGeomLoader.parse(data);else return this.geomLoader.parse(data.data).geometry;
            }
        }, {
            key: 'disposeAllTextures',
            value: function disposeAllTextures() {
                for (var key in this.textures) {
                    this.textures[key].dispose();
                }
            }
        }, {
            key: 'loadBufferGeometry',
            value: function loadBufferGeometry(data) {
                var geometry = new THREE.BufferGeometry();
                if (data.data) data = data.data;
                geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
                geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal || data.position.length), 3));
                geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv || data.position.length / 3 * 2), 2));
                return geometry;
            }
        }, {
            key: 'loadSkinnedGeometry',
            value: function loadSkinnedGeometry(data) {
                var geometry = new THREE.BufferGeometry();
                geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
                geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal), 3));
                geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv), 2));
                geometry.addAttribute('skinIndex', new THREE.BufferAttribute(new Float32Array(data.skinIndices), 4));
                geometry.addAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(data.skinWeights), 4));
                geometry.bones = data.bones;
                return geometry;
            }
        }, {
            key: 'loadCurve',
            value: function loadCurve(data) {
                var points = [];
                for (var i = 0; i < data.length; i += 3) {
                    points.push(new THREE.Vector3(data[i + 0], data[i + 1], data[i + 2]));
                }return new THREE.CatmullRomCurve3(points);
            }
        }, {
            key: 'setLightCamera',
            value: function setLightCamera(light, size, near, far, texture) {
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
        }, {
            key: 'getRepeatTexture',
            value: function getRepeatTexture(src) {
                var texture = this.getTexture(src);
                texture.onload = function () {
                    return texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                };
                return texture;
            }
        }]);

        return Utils3D;
    }();

    /**
     * Raycaster.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /* global THREE */

    var Raycaster = function (_Component11) {
        _inherits(Raycaster, _Component11);

        function Raycaster(camera) {
            _classCallCheck(this, Raycaster);

            var _this34 = _possibleConstructorReturn(this, (Raycaster.__proto__ || Object.getPrototypeOf(Raycaster)).call(this));

            _this34.camera = camera;
            var calc = new THREE.Vector2(),
                raycaster = new THREE.Raycaster();
            var debug = void 0;

            function ascSort(a, b) {
                return a.distance - b.distance;
            }

            function intersectObject(object, raycaster, intersects, recursive) {
                if (object.visible === false) return;
                var parent = object.parent;
                while (parent) {
                    if (parent.visible === false) return;
                    parent = parent.parent;
                }
                object.raycast(raycaster, intersects);
                if (recursive === true) object.children.forEach(function (object) {
                    return intersectObject(object, raycaster, intersects, true);
                });
            }

            function intersect(objects) {
                if (!Array.isArray(objects)) objects = [objects];
                var intersects = [];
                objects.forEach(function (object) {
                    return intersectObject(object, raycaster, intersects, false);
                });
                intersects.sort(ascSort);
                if (debug) updateDebug();
                return intersects;
            }

            function updateDebug() {
                var vertices = debug.geometry.vertices;
                vertices[0].copy(raycaster.ray.origin.clone());
                vertices[1].copy(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(10000)));
                debug.geometry.verticesNeedUpdate = true;
            }

            _this34.pointsThreshold = function (value) {
                raycaster.params.Points.threshold = value;
            };

            _this34.debug = function (scene) {
                var geom = new THREE.Geometry();
                geom.vertices.push(new THREE.Vector3(-100, 0, 0));
                geom.vertices.push(new THREE.Vector3(100, 0, 0));
                var mat = new THREE.LineBasicMaterial({ color: 0x0000ff });
                debug = new THREE.Line(geom, mat);
                scene.add(debug);
            };

            _this34.checkHit = function (objects) {
                var mouse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Mouse;

                var rect = _this34.rect || Stage;
                if (mouse === Mouse && rect === Stage) {
                    calc.copy(Mouse.tilt);
                } else {
                    calc.x = mouse.x / rect.width * 2 - 1;
                    calc.y = -(mouse.y / rect.height) * 2 + 1;
                }
                raycaster.setFromCamera(calc, camera);
                return intersect(objects);
            };

            _this34.checkFromValues = function (objects, origin, direction) {
                raycaster.set(origin, direction, 0, Number.POSITIVE_INFINITY);
                return intersect(objects);
            };
            return _this34;
        }

        return Raycaster;
    }(Component);

    /**
     * 3D interaction.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    var Interaction3D = function (_Component12) {
        _inherits(Interaction3D, _Component12);

        function Interaction3D(camera) {
            _classCallCheck(this, Interaction3D);

            if (!Interaction3D.initialized) {
                Interaction3D.HOVER = 'interaction3d_hover';
                Interaction3D.CLICK = 'interaction3d_click';

                Interaction3D.initialized = true;
            }

            var _this35 = _possibleConstructorReturn(this, (Interaction3D.__proto__ || Object.getPrototypeOf(Interaction3D)).call(this));

            var self = _this35;
            _this35.ray = new Raycaster(camera);
            _this35.meshes = [];
            _this35.meshCallbacks = [];
            _this35.cursor = 'auto';
            _this35.enabled = true;
            var event = {};
            var hoverTarget = void 0,
                clickTarget = void 0;

            addListeners();

            function addListeners() {
                self.events.add(Mouse.input, Interaction.START, start);
                self.events.add(Mouse.input, Interaction.MOVE, move);
                self.events.add(Mouse.input, Interaction.CLICK, click);
            }

            function start() {
                if (!self.enabled) return;
                var hit = move();
                if (hit) {
                    clickTarget = hit.object;
                    clickTarget.time = Render.TIME;
                } else {
                    clickTarget = null;
                }
            }

            function move() {
                if (!self.enabled) return;
                var hit = self.ray.checkHit(self.meshes)[0];
                if (hit) {
                    var mesh = hit.object;
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
                var hit = self.ray.checkHit(self.meshes)[0];
                if (hit && hit.object === clickTarget) triggerClick(clickTarget);
                clickTarget = null;
            }

            function triggerHover(action, mesh) {
                event.action = action;
                event.mesh = mesh;
                self.events.fire(Interaction3D.HOVER, event, true);
                var i = self.meshes.indexOf(hoverTarget);
                if (self.meshCallbacks[i].hoverCallback) self.meshCallbacks[i].hoverCallback(event);
            }

            function triggerClick(mesh) {
                event.action = 'click';
                event.mesh = mesh;
                self.events.fire(Interaction3D.CLICK, event, true);
                var i = self.meshes.indexOf(clickTarget);
                if (self.meshCallbacks[i].clickCallback) self.meshCallbacks[i].clickCallback(event);
            }

            function parseMeshes(meshes) {
                if (!Array.isArray(meshes)) meshes = [meshes];
                var output = [];
                meshes.forEach(checkMesh);

                function checkMesh(mesh) {
                    if (mesh.type === 'Mesh' && mesh.mouseEnabled) output.push(mesh);
                    if (mesh.children.length) mesh.children.forEach(checkMesh);
                }

                return output;
            }

            _this35.add = function (meshes, hoverCallback, clickCallback, parse) {
                if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
                meshes.forEach(function (mesh) {
                    _this35.meshes.push(mesh);
                    _this35.meshCallbacks.push({ hoverCallback: hoverCallback, clickCallback: clickCallback });
                });
            };

            _this35.remove = function (meshes, parse) {
                if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
                meshes.forEach(function (mesh) {
                    if (mesh === hoverTarget) {
                        triggerHover('out', hoverTarget);
                        hoverTarget = null;
                        Stage.css('cursor', _this35.cursor);
                    }
                    for (var i = _this35.meshes.length - 1; i >= 0; i--) {
                        if (_this35.meshes[i] === mesh) {
                            _this35.meshes.splice(i, 1);
                            _this35.meshCallbacks.splice(i, 1);
                        }
                    }
                });
            };
            return _this35;
        }

        _createClass(Interaction3D, [{
            key: 'camera',
            set: function set(c) {
                this.ray.camera = c;
            }
        }]);

        return Interaction3D;
    }(Component);

    /**
     * Screen projection.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /* global THREE */

    var ScreenProjection = function (_Component13) {
        _inherits(ScreenProjection, _Component13);

        function ScreenProjection(camera) {
            _classCallCheck(this, ScreenProjection);

            var _this36 = _possibleConstructorReturn(this, (ScreenProjection.__proto__ || Object.getPrototypeOf(ScreenProjection)).call(this));

            var v3 = new THREE.Vector3(),
                v32 = new THREE.Vector3(),
                value = new THREE.Vector3();

            _this36.set = function (v) {
                camera = v;
            };

            _this36.unproject = function (mouse, distance) {
                var rect = _this36.rect || Stage;
                v3.set(mouse.x / rect.width * 2 - 1, -(mouse.y / rect.height) * 2 + 1, 0.5);
                v3.unproject(camera);
                var pos = camera.position;
                v3.sub(pos).normalize();
                var dist = distance || -pos.z / v3.z;
                value.copy(pos).add(v3.multiplyScalar(dist));
                return value;
            };

            _this36.project = function (pos) {
                var rect = _this36.rect || Stage;
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
            return _this36;
        }

        return ScreenProjection;
    }(Component);

    /**
     * Shader helper class.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /* global THREE */

    var Shader = function (_Component14) {
        _inherits(Shader, _Component14);

        function Shader(vertexShader, fragmentShader, props) {
            _classCallCheck(this, Shader);

            var _this37 = _possibleConstructorReturn(this, (Shader.__proto__ || Object.getPrototypeOf(Shader)).call(this));

            var self = _this37;
            _this37.uniforms = {};
            _this37.properties = {};

            initProperties();
            initShaders();

            function initProperties() {
                for (var key in props) {
                    if (typeof props[key].value !== 'undefined') self.uniforms[key] = props[key];else self.properties[key] = props[key];
                }
            }

            function initShaders() {
                var params = {};
                params.vertexShader = process(vertexShader, 'vs');
                params.fragmentShader = process(fragmentShader, 'fs');
                params.uniforms = self.uniforms;
                for (var key in self.properties) {
                    params[key] = self.properties[key];
                }self.material = new THREE.RawShaderMaterial(params);
                self.material.shader = self;
                self.uniforms = self.material.uniforms;
            }

            function process(code, type) {
                var header = void 0;
                if (type === 'vs') {
                    header = ['precision highp float;', 'precision highp int;', 'attribute vec2 uv;', 'attribute vec3 position;', 'attribute vec3 normal;', 'uniform mat4 modelViewMatrix;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelMatrix;', 'uniform mat4 viewMatrix;', 'uniform mat3 normalMatrix;', 'uniform vec3 cameraPosition;'].join('\n');
                } else {
                    header = [~code.indexOf('dFdx') ? '#extension GL_OES_standard_derivatives : enable' : '', 'precision highp float;', 'precision highp int;', 'uniform mat4 modelViewMatrix;', 'uniform mat4 projectionMatrix;', 'uniform mat4 modelMatrix;', 'uniform mat4 viewMatrix;', 'uniform mat3 normalMatrix;', 'uniform vec3 cameraPosition;'].join('\n');
                }
                code = header + '\n\n' + code;
                var threeChunk = function threeChunk(a, b) {
                    return THREE.ShaderChunk[b] + '\n';
                };
                return code.replace(/#s?chunk\(\s?(\w+)\s?\);/g, threeChunk);
            }
            return _this37;
        }

        _createClass(Shader, [{
            key: 'set',
            value: function set(key, value) {
                TweenManager.clearTween(this.uniforms[key]);
                this.uniforms[key].value = value;
            }
        }, {
            key: 'tween',
            value: function tween(key, value, time, ease, delay, callback, update) {
                return TweenManager.tween(this.uniforms[key], { value: value }, time, ease, delay, callback, update);
            }
        }, {
            key: 'getValues',
            value: function getValues() {
                var out = {};
                for (var key in this.uniforms) {
                    out[key] = this.uniforms[key].value;
                }return out;
            }
        }, {
            key: 'copyUniformsTo',
            value: function copyUniformsTo(object) {
                for (var key in this.uniforms) {
                    object.uniforms[key] = this.uniforms[key];
                }
            }
        }, {
            key: 'cloneUniformsTo',
            value: function cloneUniformsTo(object) {
                for (var key in this.uniforms) {
                    object.uniforms[key] = { type: this.uniforms[key].type, value: this.uniforms[key].value };
                }
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.material.dispose();
                return _get(Shader.prototype.__proto__ || Object.getPrototypeOf(Shader.prototype), 'destroy', this).call(this);
            }
        }]);

        return Shader;
    }(Component);

    /**
     * Post processing effects.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    /* global THREE */

    var Effects = function (_Component15) {
        _inherits(Effects, _Component15);

        function Effects(stage, params) {
            _classCallCheck(this, Effects);

            var _this38 = _possibleConstructorReturn(this, (Effects.__proto__ || Object.getPrototypeOf(Effects)).call(this));

            var self = _this38;
            _this38.stage = stage;
            _this38.renderer = params.renderer;
            _this38.scene = params.scene;
            _this38.camera = params.camera;
            _this38.shader = params.shader;
            _this38.dpr = params.dpr || 1;
            var renderTarget = void 0,
                camera = void 0,
                scene = void 0,
                mesh = void 0;

            initEffects();
            addListeners();

            function initEffects() {
                renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
                self.texture = renderTarget.texture;
                self.texture.minFilter = THREE.LinearFilter;
                camera = new THREE.OrthographicCamera(self.stage.width / -2, self.stage.width / 2, self.stage.height / 2, self.stage.height / -2, 1, 1000);
                scene = new THREE.Scene();
                mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), self.shader.material);
                scene.add(mesh);
            }

            function addListeners() {
                self.events.add(Events.RESIZE, resize);
            }

            function resize() {
                renderTarget.dispose();
                renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
                camera.left = self.stage.width / -2;
                camera.right = self.stage.width / 2;
                camera.top = self.stage.height / 2;
                camera.bottom = self.stage.height / -2;
                camera.updateProjectionMatrix();
            }

            _this38.render = function () {
                _this38.renderer.render(_this38.scene, _this38.camera, renderTarget, true);
                mesh.material.uniforms.texture.value = renderTarget.texture;
                _this38.renderer.render(scene, camera);
            };
            return _this38;
        }

        return Effects;
    }(Component);

    /**
     * Alien abduction point.
     *
     * @author Patrick Schroen / https://github.com/pschroen
     */

    exports.Utils = Utils;
    exports.Render = Render;
    exports.Timer = Timer;
    exports.Events = Events;
    exports.Device = Device;
    exports.Component = Component;
    exports.Interface = Interface;
    exports.Interaction = Interaction;
    exports.Accelerometer = Accelerometer;
    exports.Mouse = Mouse;
    exports.Assets = Assets;
    exports.AssetLoader = AssetLoader;
    exports.MultiLoader = MultiLoader;
    exports.FontLoader = FontLoader;
    exports.StateDispatcher = StateDispatcher;
    exports.Storage = Storage;
    exports.WebAudio = WebAudio;
    exports.TweenManager = TweenManager;
    exports.Interpolation = Interpolation;
    exports.Canvas = Canvas;
    exports.CanvasGraphics = CanvasGraphics;
    exports.CanvasTexture = CanvasTexture;
    exports.CanvasFont = CanvasFont;
    exports.Color = Color;
    exports.Video = Video;
    exports.SVG = SVG;
    exports.Scroll = Scroll;
    exports.Slide = Slide;
    exports.SlideLoader = SlideLoader;
    exports.SlideVideo = SlideVideo;
    exports.LinkedList = LinkedList;
    exports.ObjectPool = ObjectPool;
    exports.Vector2 = Vector2;
    exports.Vector3 = Vector3;
    exports.Utils3D = Utils3D;
    exports.Interaction3D = Interaction3D;
    exports.Raycaster = Raycaster;
    exports.ScreenProjection = ScreenProjection;
    exports.Shader = Shader;
    exports.Effects = Effects;
    exports.Stage = Stage;

    Object.defineProperty(exports, '__esModule', { value: true });
});
