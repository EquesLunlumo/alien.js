/**
 * Alien interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenMax } from '../gsap/TweenMax.js';
import { Utils } from './Utils.js';
import { Render } from './Render.js';
import { Events } from './Events.js';
import { Device } from './Device.js';
import { Assets } from './Assets.js';

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
        if (!this.classes) return;
        if (child.destroy) {
            this.classes.push(child);
            child.parent = this;
        }
        if (child.element) this.element.appendChild(child.element);
        else if (child.nodeName) this.element.appendChild(child);
    }

    delayedCall(callback, time = 0, ...params) {
        if (!this.timers) return;
        TweenMax.delayedCall(time * 0.001, callback, params);
        this.timers.push(callback);
        if (this.timers.length > 50) this.timers.shift();
        return callback;
    }

    clearTimeout(callback) {
        TweenMax.killDelayedCallsTo(callback);
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
        if (!this.classes) return;
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

    show() {
        TweenMax.set(this.element, { clearProps: 'display' });
        return this;
    }

    hide() {
        TweenMax.set(this.element, { display: 'none' });
        return this;
    }

    visible() {
        TweenMax.set(this.element, { visibility: 'visible' });
        return this;
    }

    invisible() {
        TweenMax.set(this.element, { visibility: 'hidden' });
        return this;
    }

    setZ(z) {
        TweenMax.set(this.element, { zIndex: z });
        return this;
    }

    mouseEnabled(bool) {
        TweenMax.set(this.element, { pointerEvents: bool ? 'auto' : 'none' });
        return this;
    }

    size(w, h = w, noScale) {
        if (typeof h === 'boolean') {
            noScale = h;
            h = w;
        }
        if (typeof w !== 'undefined') {
            const style = {};
            if (typeof w === 'string' || typeof h === 'string') {
                if (typeof w !== 'string') w = w + 'px';
                if (typeof h !== 'string') h = h + 'px';
                style.width = w;
                style.height = h;
            } else {
                style.width = w + 'px';
                style.height = h + 'px';
                if (!noScale) style.backgroundSize = w + 'px ' + h + 'px';
            }
            TweenMax.set(this.element, style);
        }
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        return this;
    }

    bg(src, x, y, repeat) {
        const style = {};
        if (~src.indexOf('.')) src = Assets.getPath(src);
        if (src.includes(['data:', '.'])) style.backgroundImage = 'url(' + src + ')';
        else style.backgroundColor = src;
        if (typeof x !== 'undefined') {
            x = typeof x === 'number' ? x + 'px' : x;
            y = typeof y === 'number' ? y + 'px' : y;
            style.backgroundPosition = x + ' ' + y;
        }
        if (repeat) {
            style.clearProps = 'backgroundSize';
            style.backgroundRepeat = repeat;
        }
        if (x === 'cover' || x === 'contain') {
            repeat = typeof repeat === 'number' ? repeat + 'px' : repeat;
            style.backgroundSize = x;
            style.backgroundRepeat = 'no-repeat';
            style.backgroundPosition = typeof y !== 'undefined' ? y + ' ' + repeat : 'center';
        }
        TweenMax.set(this.element, style);
        return this;
    }

    center(x, y, noPos) {
        const style = {};
        if (typeof x === 'undefined') {
            style.left = '50%';
            style.top = '50%';
            style.marginLeft = -this.width / 2;
            style.marginTop = -this.height / 2;
        } else {
            if (x) {
                style.left = '50%';
                style.marginLeft = -this.width / 2;
            }
            if (y) {
                style.top = '50%';
                style.marginTop = -this.height / 2;
            }
        }
        if (noPos) {
            delete style.left;
            delete style.top;
        }
        this.css(style);
        return this;
    }

    mask(src) {
        if (~src.indexOf('.')) src = Assets.getPath(src);
        const mask = (src.includes(['data:', '.']) ? 'url(' + src + ')' : src) + ' center / contain no-repeat';
        TweenMax.set(this.element, {
            mask,
            '-webkit-mask': mask
        });
        return this;
    }

    blendMode(mode, bg) {
        TweenMax.set(this.element, { [bg ? 'background-blend-mode' : 'mix-blend-mode']: mode });
        return this;
    }

    fontStyle(fontFamily, fontSize, color, fontStyle) {
        this.css({ fontFamily, fontSize, color, fontStyle });
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
                TweenMax.set(this.element, { [props]: value });
                return this;
            }
        }
        for (let key in props) {
            let val = props[key];
            if (!(typeof val === 'string' || typeof val === 'number')) continue;
            if (typeof val !== 'string' && key !== 'opacity' && key !== 'zIndex') props[key] += 'px';
        }
        for (let key in props) if (typeof props[key] === 'undefined') delete props[key];
        TweenMax.set(this.element, props);
        return this;
    }

    transform(props) {
        if (!props) props = this;
        else for (let key in props) if (typeof props[key] === 'number') this[key] = props[key];
        const style = {};
        for (let key in props) if (typeof props[key] !== 'undefined' && ~['x', 'y', 'z', 'scale', 'scaleX', 'scaleY', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'skewX', 'skewY', 'perspective'].indexOf(key)) style[key] = props[key];
        TweenMax.set(this.element, style);
        return this;
    }

    transformPoint(x, y, z) {
        let transformOrigin = '';
        if (typeof x !== 'undefined') transformOrigin += typeof x === 'number' ? x + 'px' : x;
        if (typeof y !== 'undefined') transformOrigin += typeof y === 'number' ? ' ' + y + 'px' : ' ' + y;
        if (typeof z !== 'undefined') transformOrigin += typeof z === 'number' ? ' ' + z + 'px' : ' ' + z;
        if (transformOrigin === '') TweenMax.set(this.element, { clearProps: 'transformOrigin' });
        else TweenMax.set(this.element, { transformOrigin });
        return this;
    }

    clearOpacity() {
        TweenMax.set(this.element, { clearProps: 'opacity' });
        return this;
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
        if (typeof this.perspective === 'number') this.perspective = 0;
        TweenMax.set(this.element, { clearProps: 'transform' });
        return this;
    }

    willChange(props) {
        if (!props) TweenMax.set(this.element, { clearProps: 'willChange' });
        else TweenMax.set(this.element, { willChange: typeof props === 'string' ? props : 'transform, opacity' });
        return this;
    }

    backfaceVisibility(visible) {
        TweenMax.set(this.element, { backfaceVisibility: visible ? 'visible' : 'hidden' });
        return this;
    }

    enable3D(perspective, x, y) {
        const style = {};
        style.transformStyle = 'preserve-3d';
        if (perspective) style.perspective = perspective + 'px';
        if (typeof x !== 'undefined') {
            x = typeof x === 'number' ? x + 'px' : x;
            y = typeof y === 'number' ? y + 'px' : y;
            style.perspectiveOrigin = x + ' ' + y;
        }
        TweenMax.set(this.element, style);
        return this;
    }

    disable3D() {
        TweenMax.set(this.element, { clearProps: 'transformStyle, perspective, perspectiveOrigin' });
        return this;
    }

    tween(props, time, ease, delay, complete, update) {
        tween(this.element, props, time, ease, delay, complete, update);
        return this;
    }

    clearTween() {
        clearTween(this.element);
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

    bind(event, callback) {
        if (event === 'touchstart' && !Device.mobile) event = 'mousedown';
        else if (event === 'touchmove' && !Device.mobile) event = 'mousemove';
        else if (event === 'touchend' && !Device.mobile) event = 'mouseup';
        if (!this.events['bind_' + event]) this.events['bind_' + event] = [];
        const events = this.events['bind_' + event];
        events.push({ target: this.element, callback });

        const touchEvent = e => {
            if (!this.element) return false;
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

    click(callback) {
        const click = e => {
            if (!this.element) return false;
            e.object = this.element.className === 'hit' ? this.parent : this;
            e.action = 'click';
            if (callback) callback(e);
        };
        this.element.addEventListener('click', click, true);
        TweenMax.set(this.element, { cursor: 'pointer' });
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

        const touchMove = e => {
            if (!this.element) return false;
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

        const touchStart = e => {
            if (!this.element) return false;
            const touch = this.convertTouchEvent(e);
            if (e.touches.length === 1) {
                startX = touch.x;
                startY = touch.y;
                moving = true;
                this.element.addEventListener('touchmove', touchMove, { passive: true });
            }
        };

        const touchEnd = () => {
            if (!this.element) return false;
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
            style = {};
        if ((!x && !y) || (x && y)) style.overflow = 'scroll';
        if (!x && y) {
            style.overflowY = 'scroll';
            style.overflowX = 'hidden';
        }
        if (x && !y) {
            style.overflowX = 'scroll';
            style.overflowY = 'hidden';
        }
        if (Device.mobile) {
            style['-webkit-overflow-scrolling'] = 'touch';
            this.element.scrollParent = true;
            this.element.preventEvent = e => e.stopPropagation();
            this.bind('touchmove', this.element.preventEvent);
        }
        this.css(style);
    }

    removeOverflowScroll() {
        TweenMax.set(this.element, { clearProps: 'overflow, overflowX, overflowY, -webkit-overflow-scrolling' });
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

export { Interface };
