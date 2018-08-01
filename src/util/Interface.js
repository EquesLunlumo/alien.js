/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils.js';
import { Render } from './Render.js';
import { Timer } from './Timer.js';
import { Events } from './Events.js';
import { Device } from './Device.js';
import { Assets } from './Assets.js';
import { TweenManager } from '../tween/TweenManager.js';
import { CSSTransition } from '../tween/CSSTransition.js';

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
                    if (name[0] !== '.') this.element.id = name;
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
        if (this.classes) {
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
        }
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
        if (props) this.element.style['will-change'] = string ? props : 'transform, opacity';
        else this.element.style['will-change'] = '';
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

export { Interface };
