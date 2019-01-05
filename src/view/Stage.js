/**
 * Stage instance.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Render } from '../util/Render.js';
import { Events } from '../util/Events.js';
import { Device } from '../util/Device.js';
import { Interface } from '../util/Interface.js';

const Stage = new (class extends Interface {

    constructor() {
        super('Stage');
        const self = this;
        let last;

        addListeners();

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
            Render.destroy();
            return super.destroy();
        };
    }
})();

export { Stage };
