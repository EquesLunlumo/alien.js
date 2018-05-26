/**
 * Particle.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { LinkedList } from '../util/LinkedList.js';
import { Vector2 } from '../util/Vector2.js';
import { Vector3 } from '../util/Vector3.js';

class Particle {

    constructor(pos, mass = 1, radius = 1) {
        const self = this;
        this.mass = mass;
        this.massInv = 1 / this.mass;
        this.radius = radius;
        this.radiusSq = this.radius * this.radius;
        this.behaviors = new LinkedList();
        this.fixed = false;
        this.enabled = true;

        initVectors();

        function initVectors() {
            const Vector = typeof pos.z === 'number' ? Vector3 : Vector2,
                vel = new Vector(),
                acc = new Vector(),
                old = {};
            old.pos = new Vector();
            old.vel = new Vector();
            old.acc = new Vector();
            self.pos = self.position = pos;
            self.vel = self.velocity = vel;
            self.acc = self.acceleration = acc;
            self.old = old;
            self.old.pos.copy(pos);
        }
    }

    moveTo(pos) {
        this.pos.copy(pos);
        this.old.pos.copy(pos);
        this.acc.clear();
        this.vel.clear();
    }

    setMass(mass = 1) {
        this.mass = mass;
        this.massInv = 1 / this.mass;
    }

    setRadius(radius) {
        this.radius = radius;
        this.radiusSq = this.radius * this.radius;
    }

    update(dt) {
        if (!this.behaviors.length) return;
        let b = this.behaviors.start();
        while (b) {
            b.applyBehavior(this, dt);
            b = this.behaviors.next();
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    addBehavior(behavior) {
        this.behaviors.push(behavior);
    }

    removeBehavior(behavior) {
        this.behaviors.remove(behavior);
    }

    addParticle(p) {
        if (!this.children) {
            this.children = [];
            this.childList = new LinkedList();
        }
        this.children.push(p);
        this.childList.push(p);
    }
}

export { Particle };
