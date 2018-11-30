/**
 * Random Euler rotation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils.js';
import { Render } from '../util/Render.js';

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
            const t = Render.time;
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

export { RandomEulerRotation };
