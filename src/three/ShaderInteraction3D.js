/**
 * Shader 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Component } from '../util/Component.js';
import { Interaction } from '../util/Interaction.js';
import { Mouse } from '../util/Mouse.js';
import { Stage } from '../view/Stage.js';
import { Raycaster } from './Raycaster.js';

class ShaderInteraction3D extends Component {

    constructor(camera) {
        super();
        const v3 = new THREE.Vector3();
        let over, click, input, hold;

        this.ray = new Raycaster(camera);
        this.meshes = [];
        this.objects = [];
        this.enabled = true;

        this.startRender(loop, 24);

        function loop() {
            if (!self.enabled) return;
            if (!input) return;
            let hit;
            if (input.type === '3d') {
                v3.set(0, 0, -1).applyQuaternion(input.quaternion);
                hit = self.ray.checkFromValues(self.meshes, input.position, v3);
            } else {
                hit = self.ray.checkHit(self.meshes, input.position);
            }
            if (hit[0]) {
                const i = self.meshes.indexOf(hit[0].object),
                    object = self.objects[i];
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

        function start() {
            if (!self.enabled) return;
            if (over) {
                click = over;
                hold.copy(input.position);
                hold.time = performance.now();
            }
        }

        function end() {
            if (!self.enabled) return;
            if (click) {
                if (performance.now() - hold.time > 750) return click = null;
                if (click === over) click.onClick({ action: 'click', object: click });
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

        this.input = object => {
            input = {};
            input.position = object.position || object;
            input.quaternion = object.quaternion;
            input.type = typeof input.position.z === 'number' ? '3d' : '2d';
            const Vector = input.type === '3d' ? THREE.Vector3 : THREE.Vector2;
            hold = new Vector();
            if (object === Mouse) {
                this.events.add(Mouse.input, Interaction.START, start);
                this.events.add(Mouse.input, Interaction.END, end);
            } else {
                object.startClick = start;
                object.endClick = end;
            }
        };
    }
}

export { ShaderInteraction3D };
