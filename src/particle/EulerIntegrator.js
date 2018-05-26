/**
 * Euler integrator.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Vector2 } from '../util/Vector2.js';
import { Vector3 } from '../util/Vector3.js';

class EulerIntegrator {

    constructor() {
        const self = this;
        this.useDeltaTime = false;
        let vel, acc;

        function createVectors() {
            const Vector = self.type === '3D' ? Vector3 : Vector2;
            vel = new Vector();
            acc = new Vector();
        }

        this.integrate = (particles, dt, drag) => {
            if (!vel) createVectors();
            const dtSq = dt * dt;
            let p = particles.start();
            while (p) {
                if (!p.fixed && p.enabled) {
                    p.old.pos.copy(p.pos);
                    p.acc.multiply(p.massInv);
                    vel.copy(p.vel);
                    acc.copy(p.acc);
                    if (this.useDeltaTime) {
                        p.pos.add(vel.multiply(dt)).add(acc.multiply(0.5 * dtSq));
                        p.vel.add(p.acc.multiply(dt));
                    } else {
                        p.pos.add(vel).add(acc.multiply(0.5));
                        p.vel.add(p.acc);
                    }
                    if (drag) p.vel.multiply(drag);
                    p.acc.clear();
                }
                if (p.saveTo) p.saveTo.copy(p.pos);
                p = particles.next();
            }
        };
    }
}

export { EulerIntegrator };
