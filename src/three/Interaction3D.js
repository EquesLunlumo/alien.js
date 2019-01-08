/**
 * 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Render } from '../util/Render.js';
import { Events } from '../util/Events.js';
import { Device } from '../util/Device.js';
import { Component } from '../util/Component.js';
import { Interaction } from '../util/Interaction.js';
import { Mouse } from '../util/Mouse.js';
import { Stage } from '../view/Stage.js';
import { Raycaster } from './Raycaster.js';

class Interaction3D extends Component {

    constructor(camera) {

        if (!Interaction3D.initialized) {
            Interaction3D.HOVER = 'interaction3d_hover';
            Interaction3D.CLICK = 'interaction3d_click';

            const map = new Map();
            let input = Mouse;

            Interaction3D.find = camera => {
                if (!map.has(camera)) {
                    const interaction = new Interaction3D(camera);
                    interaction.input(input);
                    map.set(camera, interaction);
                }
                return map.get(camera);
            };

            Interaction3D.useInput = v => {
                for (let [interaction] of map) interaction.input(v);
                input = v;
            };

            Interaction3D.initialized = true;
        }

        super();
        const self = this;
        const test = [],
            event = {},
            v3 = new THREE.Vector3();
        let hoverTarget, clickTarget, input;

        this.ray = this.initClass(Raycaster, camera);
        this.meshes = [];
        this.callbacks = [];
        this.enabled = true;

        function canTest(mesh) {
            if (!mesh.visible) return false;
            let parent = mesh.parent;
            while (parent) {
                if (!parent.visible) return false;
                parent = parent.parent;
            }
            return true;
        }

        function testObjects() {
            test.length = 0;
            for (let i = self.meshes.length - 1; i >= 0; i--) {
                const mesh = self.meshes[i];
                if (canTest(mesh)) test.push(mesh);
            }
            return test;
        }

        function addListeners() {
            self.events.add(Mouse.input, Interaction.START, start);
            self.events.add(Mouse.input, Interaction.MOVE, move);
            self.events.add(Mouse.input, Interaction.CLICK, click);
            if (Device.mobile) self.events.add(Mouse.input, Interaction.END, end);
        }

        function removeListeners() {
            self.events.remove(Mouse.input, Interaction.START, start);
            self.events.remove(Mouse.input, Interaction.MOVE, move);
            self.events.remove(Mouse.input, Interaction.CLICK, click);
            if (Device.mobile) self.events.remove(Mouse.input, Interaction.END, end);
        }

        function start() {
            if (!self.enabled) return;
            const hit = move();
            if (hit) {
                clickTarget = hit.object;
                clickTarget.time = Render.time;
            } else {
                clickTarget = null;
            }
        }

        function move() {
            if (!self.enabled) return;
            let hit;
            if (input.type === '3d') {
                v3.set(0, 0, -1).applyQuaternion(input.quaternion);
                hit = self.ray.checkFromValues(testObjects(), input.position, v3)[0];
            } else {
                hit = self.ray.checkHit(testObjects(), input.position)[0];
            }
            if (hit) {
                const mesh = hit.object;
                if (input.object && input.object.setHitPosition) input.object.setHitPosition(hit);
                if (mesh !== hoverTarget) {
                    if (hoverTarget) triggerHover('out', hoverTarget, hit);
                    hoverTarget = mesh;
                    triggerHover('over', hoverTarget, hit);
                    Stage.css('cursor', self.callbacks[self.meshes.indexOf(hoverTarget)].clickCallback ? 'pointer' : '');
                }
                return hit;
            } else {
                end();
                if (input.object && input.object.setHitPosition) input.object.setHitPosition(false);
                return false;
            }
        }

        function end() {
            if (!self.enabled) return;
            if (hoverTarget) {
                triggerHover('out', hoverTarget, null);
                hoverTarget = null;
                Stage.css('cursor', '');
            }
        }

        function click(e) {
            if (!self.enabled) return;
            if (!clickTarget) return;
            let hit;
            if (input.type === '3d') {
                v3.set(0, 0, -1).applyQuaternion(input.quaternion);
                hit = self.ray.checkFromValues(testObjects(), input.position, v3)[0];
            } else {
                const element = document.elementFromPoint(e.x, e.y);
                if (element && element.className === 'hit') return;
                hit = self.ray.checkHit(testObjects(), input.position)[0];
            }
            if (hit && hit.object === clickTarget) {
                triggerClick(clickTarget, hit);
                clickTarget = null;
            }
        }

        function triggerHover(action, mesh, hit) {
            event.action = action;
            event.mesh = mesh;
            event.hit = hit;
            self.events.fire(Interaction3D.HOVER, event, true);
            const i = self.meshes.indexOf(hoverTarget);
            if (self.callbacks[i].overCallback) self.callbacks[i].overCallback(event);
        }

        function triggerClick(mesh, hit) {
            event.action = 'click';
            event.mesh = mesh;
            event.hit = hit;
            self.events.fire(Interaction3D.CLICK, event, true);
            const i = self.meshes.indexOf(clickTarget);
            if (self.callbacks[i].clickCallback) self.callbacks[i].clickCallback(event);
        }

        this.add = (meshes, overCallback, clickCallback) => {
            if (!Array.isArray(meshes)) meshes = [meshes];
            meshes.forEach(mesh => {
                this.meshes.push(mesh);
                this.callbacks.push({ overCallback, clickCallback });
            });
        };

        this.remove = meshes => {
            if (!Array.isArray(meshes)) meshes = [meshes];
            meshes.forEach(mesh => {
                if (mesh === hoverTarget) {
                    hoverTarget = null;
                    Stage.css('cursor', '');
                }
                const i = this.meshes.indexOf(mesh);
                if (~i) {
                    this.meshes.splice(i, 1);
                    this.callbacks.splice(i, 1);
                }
            });
        };

        this.input = object => {
            input = {};
            input.object = object;
            input.position = object.group && object.group.position || object;
            input.quaternion = object.group && object.group.quaternion;
            input.type = typeof input.position.z === 'number' ? '3d' : '2d';
            if (object === Mouse) {
                addListeners();
            } else {
                removeListeners();
                this.events.add(object, Events.SELECT, start);
                this.events.add(object, Events.END, click);
                this.startRender(move, 24);
            }
        };
    }
}

export { Interaction3D };
