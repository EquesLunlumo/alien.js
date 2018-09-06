/**
 * Random Euler rotation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Render } from '../util/Render.js';

class RandomEulerRotation {

    constructor(container) {
        const euler = ['x', 'y', 'z'];
        let rot;

        this.speed = 1;

        initRotation();

        function initRotation() {
            rot = {};
            rot.x = Math.random(0, 2);
            rot.y = Math.random(0, 2);
            rot.z = Math.random(0, 2);
            rot.vx = Math.random(-5, 5) * 0.0025;
            rot.vy = Math.random(-5, 5) * 0.0025;
            rot.vz = Math.random(-5, 5) * 0.0025;
        }

        this.update = () => {
            const t = Render.TIME;
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
