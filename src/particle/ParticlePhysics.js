/**
 * Particle physics.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Render } from '../util/Render.js';
import { Component } from '../util/Component.js';
import { LinkedList } from '../util/LinkedList.js';
import { EulerIntegrator } from './EulerIntegrator.js';

class ParticlePhysics extends Component {

    constructor(integrator = new EulerIntegrator()) {
        super();
        const self = this;
        const timestep = 1 / 60,
            toDelete = [];
        let clock = null,
            buffer = 0;

        this.friction = 1;
        this.maxSteps = 1;
        this.emitters = new LinkedList();
        this.initializers = new LinkedList();
        this.behaviors = new LinkedList();
        this.particles = new LinkedList();
        this.springs = new LinkedList();

        function init(p) {
            let i = self.initializers.start();
            while (i) {
                i(p);
                i = self.initializers.next();
            }
        }

        function updateSprings(dt) {
            let s = self.springs.start();
            while (s) {
                s.update(dt);
                s = self.springs.next();
            }
        }

        function deleteParticles() {
            for (let i = toDelete.length - 1; i >= 0; i--) {
                const particle = toDelete[i];
                self.particles.remove(particle);
                particle.system = null;
            }
        }

        function updateParticles(dt, list = self.particles) {
            let index = 0,
                p = list.start();
            while (p) {
                if (p.enabled) {
                    let b = self.behaviors.start();
                    while (b) {
                        b.applyBehavior(p, dt, index);
                        b = self.behaviors.next();
                    }
                    if (p.behaviors.length) p.update(dt, index);
                    if (p.childList) updateParticles(dt, p.childList);
                }
                index++;
                p = list.next();
            }
        }

        function integrate(dt) {
            updateParticles(dt);
            if (self.springs.length) updateSprings(dt);
            if (!self.skipIntegration) integrator.integrate(self.particles, dt, self.friction);
        }

        this.addEmitter = emitter => {
            this.emitters.push(emitter);
            emitter.parent = emitter.system = this;
        };

        this.removeEmitter = emitter => {
            this.emitters.remove(emitter);
            emitter.parent = emitter.system = null;
        };

        this.addInitializer = init => {
            this.initializers.push(init);
        };

        this.removeInitializer = init => {
            this.initializers.remove(init);
        };

        this.addBehavior = b => {
            this.behaviors.push(b);
            b.system = this;
        };

        this.removeBehavior = b => {
            this.behaviors.remove(b);
        };

        this.addParticle = p => {
            if (!integrator.type) integrator.type = typeof p.pos.z === 'number' ? '3D' : '2D';
            p.system = this;
            this.particles.push(p);
            if (this.initializers.length) init(p);
        };

        this.removeParticle = p => {
            p.system = null;
            toDelete.push(p);
        };

        this.addSpring = s => {
            s.system = this;
            this.springs.push(s);
        };

        this.removeSpring = s => {
            s.system = null;
            this.springs.remove(s);
        };

        this.update = force => {
            if (!clock) clock = Render.TIME;
            let time = Render.TIME,
                delta = time - clock;
            if (!force && delta <= 0) return;
            delta *= 0.001;
            clock = time;
            buffer += delta;
            if (!force) {
                let i = 0;
                while (buffer >= timestep && i++ < this.maxSteps) {
                    integrate(timestep);
                    buffer -= timestep;
                    time += timestep;
                }
            } else {
                integrate(0.016);
            }
            if (toDelete.length) deleteParticles();
        };
    }
}

export { ParticlePhysics };
