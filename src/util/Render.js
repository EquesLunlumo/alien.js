/**
 * Render loop.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { TweenMax } from '../gsap/TweenMax.js';

class Render {

    static init() {
        const self = this;
        const render = [],
            skipLimit = 200;
        let last = performance.now();

        function tick() {
            const t = TweenMax.ticker.time * 1000,
                delta = Math.min(skipLimit, t - last);
            last = t;
            self.time = t;
            self.delta = delta;
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
        }

        TweenMax.ticker.addEventListener('tick', tick);

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

        this.destroy = () => {
            TweenMax.ticker.removeEventListener('tick', tick);
        };
    }
}

Render.init();

export { Render };
