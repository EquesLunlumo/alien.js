/**
 * Shader 2D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Device } from '../util/Device.js';
import { Component } from '../util/Component.js';
import { Interaction } from '../util/Interaction.js';
import { Mouse } from '../util/Mouse.js';
import { Stage } from '../view/Stage.js';
import { Raycaster } from './Raycaster.js';

class ShaderInteraction2D extends Component {

    constructor(camera) {
        super();
        const self = this;
        const test = [],
            hold = new THREE.Vector2(),
            calc = new THREE.Vector2();
        let over, click, preventHit;

        this.ray = this.initClass(Raycaster, camera);
        this.meshes = [];
        this.objects = [];
        this.enabled = true;

        addListeners();
        if (!Device.mobile) this.startRender(() => move(), 10);

        function testObjects() {
            test.length = 0;
            for (let i = self.objects.length - 1; i >= 0; i--) {
                const object = self.objects[i];
                if (object.determineVisible()) test.push(object.mesh);
            }
            return test;
        }

        function addListeners() {
            self.events.add(Mouse.input, Interaction.MOVE, move);
            self.events.add(Mouse.input, Interaction.START, start);
            self.events.add(Mouse.input, Interaction.END, end);
        }

        function move(e = Mouse) {
            if (!self.enabled) return;
            const hit = self.ray.checkHit(testObjects(), e)[0];
            if (hit) {
                const object = self.objects[self.meshes.indexOf(hit.object)];
                if (!over) {
                    over = object;
                    over.onOver({ action: 'over', object });
                    Stage.css('cursor', 'pointer');
                } else if (over !== object) {
                    over.onOver({ action: 'out', object: over });
                    over = object;
                    over.onOver({ action: 'over', object });
                    Stage.css('cursor', 'pointer');
                }
            } else if (over) {
                over.onOver({ action: 'out', object: over });
                over = null;
                Stage.css('cursor', '');
            }
        }

        function start(e) {
            const element = document.elementFromPoint(Mouse.x, Mouse.y);
            if (element && element.className === 'hit') return preventHit = true;
            if (!self.enabled) return;
            if (Device.mobile) move(e);
            if (over) {
                click = over;
                hold.copy(e);
                hold.time = performance.now();
            }
        }

        function end(e) {
            if (preventHit) return preventHit = false;
            if (!self.enabled) return;
            preventHit = false;
            if (click) {
                if (performance.now() - hold.time > 750 || calc.subVectors(e, hold).length() > 50) return click = null;
                if (click === over) click.onClick({ action: 'click', object: click });
            }
            if (over) {
                over.onOver({ action: 'out', object: over });
                over = null;
                Stage.css('cursor', '');
            }
            click = null;
        }

        this.add = object => {
            this.meshes.push(object.mesh);
            this.objects.push(object);
        };

        this.remove = object => {
            if (object === over) {
                over.onOver({ action: 'out', object: over });
                over = null;
                Stage.css('cursor', '');
            }
            const i = this.meshes.indexOf(object.mesh);
            if (~i) {
                this.meshes.splice(i, 1);
                this.objects.splice(i, 1);
            }
        };
    }
}

export { ShaderInteraction2D };
