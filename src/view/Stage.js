/**
 * Stage instance.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Interface } from '../util/Interface.js';
import { Accelerometer } from '../mobile/Accelerometer.js';
import { Mouse } from '../util/Mouse.js';
import { WebAudio } from '../util/WebAudio.js';

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

        function resize() {
            self.size();
            self.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            Events.emitter.fire(Events.RESIZE);
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

export { Stage };
