/**
 * 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Render } from '../util/Render.js';
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

            Interaction3D.initialized = true;
        }

        super();
        const self = this;
        const event = {};
        let hoverTarget, clickTarget;

        this.ray = new Raycaster(camera);
        this.meshes = [];
        this.callbacks = [];
        this.enabled = true;

        addListeners();

        function addListeners() {
            self.events.add(Mouse.input, Interaction.START, start);
            self.events.add(Mouse.input, Interaction.MOVE, move);
            self.events.add(Mouse.input, Interaction.CLICK, click);
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
            const hit = self.ray.checkHit(self.meshes);
            if (hit[0]) {
                const mesh = hit[0].object;
                if (mesh !== hoverTarget) {
                    if (hoverTarget) triggerHover('out', hoverTarget);
                    hoverTarget = mesh;
                    triggerHover('over', hoverTarget);
                    Stage.css('cursor', 'pointer');
                }
                return hit[0];
            } else {
                if (hoverTarget) {
                    triggerHover('out', hoverTarget);
                    hoverTarget = null;
                    Stage.css('cursor', '');
                }
                return false;
            }
        }

        function click() {
            if (!self.enabled) return;
            if (!clickTarget) return;
            const hit = self.ray.checkHit(self.meshes)[0];
            if (hit && hit.object === clickTarget) triggerClick(clickTarget);
            clickTarget = null;
        }

        function triggerHover(action, mesh) {
            event.action = action;
            event.mesh = mesh;
            self.events.fire(Interaction3D.HOVER, event, true);
            const i = self.meshes.indexOf(hoverTarget);
            if (self.callbacks[i].overCallback) self.callbacks[i].overCallback(event);
        }

        function triggerClick(mesh) {
            event.action = 'click';
            event.mesh = mesh;
            self.events.fire(Interaction3D.CLICK, event, true);
            const i = self.meshes.indexOf(clickTarget);
            if (self.callbacks[i].clickCallback) self.callbacks[i].clickCallback(event);
        }

        function parseMeshes(meshes) {
            if (!Array.isArray(meshes)) meshes = [meshes];
            const output = [];

            function checkMesh(mesh) {
                if (mesh.type === 'Mesh' && mesh.mouseEnabled) output.push(mesh);
                if (mesh.children.length) mesh.children.forEach(checkMesh);
            }

            meshes.forEach(checkMesh);
            return output;
        }

        this.add = (meshes, overCallback, clickCallback, parse) => {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(mesh => {
                this.meshes.push(mesh);
                this.callbacks.push({ overCallback, clickCallback });
            });
        };

        this.remove = (meshes, parse) => {
            if (!Array.isArray(meshes) || parse) meshes = parseMeshes(meshes);
            meshes.forEach(mesh => {
                if (mesh === hoverTarget) {
                    triggerHover('out', hoverTarget);
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
    }
}

export { Interaction3D };
