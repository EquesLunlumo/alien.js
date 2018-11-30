/**
 * Wiggle behavior.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils.js';
import { Render } from '../util/Render.js';
import { Vector3 } from '../util/Vector3.js';

class WiggleBehavior {

    constructor(position, angle = Math.radians(Utils.random(0, 360))) {
        const wobble = new Vector3(),
            origin = new Vector3();

        this.target = wobble;
        this.scale = 1;
        this.alpha = 0.025;
        this.speed = 1;
        this.zMove = 2;

        if (position) origin.copy(position);

        this.update = copy => {
            const t = Render.time;
            if (copy) origin.copy(position);
            wobble.x = Math.cos(angle + t * (0.00075 * this.speed)) * (angle + Math.sin(t * (0.00095 * this.speed)) * 200);
            wobble.y = Math.sin(Math.asin(Math.cos(angle + t * (0.00085 * this.speed)))) * (Math.sin(angle + t * (0.00075 * this.speed)) * 150);
            wobble.x *= Math.sin(angle + t * (0.00075 * this.speed)) * 2;
            wobble.y *= Math.cos(angle + t * (0.00065 * this.speed)) * 1.75;
            wobble.x *= Math.cos(angle + t * (0.00075 * this.speed)) * 1.1;
            wobble.y *= Math.sin(angle + t * (0.00025 * this.speed)) * 1.15;
            wobble.z = Math.sin(angle + wobble.x * 0.0025) * (100 * this.zMove);
            wobble.multiplyScalar(this.scale * 0.1);
            wobble.add(origin);
            if (position) {
                if (this.ease) position.interp(wobble, this.alpha, this.ease);
                else position.lerp(wobble, this.alpha);
            }
        };
    }
}

export { WiggleBehavior };
