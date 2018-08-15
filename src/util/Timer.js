/**
 * Timer helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils.js';
import { Render } from './Render.js';

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

export { Timer };
