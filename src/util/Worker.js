/**
 * Render worker.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Component } from './Component.js';

class Worker extends Component {

    constructor(callback, budget = 4) {
        super();
        const self = this;
        let elapsed = 0;

        this.startRender(loop);

        function loop() {
            while (elapsed < budget) {
                if (self.dead) return;
                const start = performance.now();
                if (callback) callback();
                elapsed += performance.now() - start;
            }
            elapsed = 0;
        }

        this.stop = () => {
            this.dead = true;
            this.stopRender(loop);
        };

        this.pause = () => {
            this.stopRender(loop);
        };

        this.resume = () => {
            this.startRender(loop);
        };
    }
}

export { Worker };
