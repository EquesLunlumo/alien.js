/**
 * Stage instance.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events';
import { Interface } from '../util/Interface';
import { Accelerometer } from '../mobile/Accelerometer';
import { Mouse } from '../util/Mouse';
import { WebAudio } from '../util/WebAudio';

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

        this.destroy = () => {
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
            return super.destroy();
        };
    }
})();

export { Stage };
