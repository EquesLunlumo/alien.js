/**
 * Shader 2D or 3D scene.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Stage } from '../view/Stage.js';
import { ShaderInteraction2D } from './ShaderInteraction2D.js';
import { ShaderInteraction3D } from './ShaderInteraction3D.js';

class ShaderStage extends Component {

    constructor(renderer, camera) {
        super();
        const self = this;
        const scene = new THREE.Scene();

        this.alpha = 1;
        this.children = [];
        this.enabled = true;

        if (camera) {
            this.type = '3d';
            this.interaction = this.initClass(ShaderInteraction3D, camera);
        } else {
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            this.type = '2d';
            this.interaction = this.initClass(ShaderInteraction2D, camera);
            addListeners();
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            camera.left = -Stage.width / 2;
            camera.right = Stage.width / 2;
            camera.top = Stage.height / 2;
            camera.bottom = -Stage.height / 2;
            camera.updateProjectionMatrix();
            camera.position.x = Stage.width / 2;
            camera.position.y = -Stage.height / 2;
        }

        this.render = rt => {
            if (!this.enabled || !scene.children.length) return;
            const clear = renderer.autoClear;
            renderer.autoClear = false;
            renderer.render(scene, camera, rt || this.rt, this.forceClear);
            renderer.autoClear = clear;
        };

        this.add = child => {
            child.setStage(this);
            child.parent = this;
            this.children.push(child);
            scene.add(child.group);
            if (this.type === '3d' && child.type !== '3d') child.enable3D();
        };

        this.remove = child => {
            child.stage = null;
            child.parent = null;
            this.children.remove(child);
            this.interaction.remove(child);
            scene.remove(child.group);
            child.mesh.material.dispose();
            child.mesh.geometry.dispose();
        };

        this.destroy = () => {
            if (this.children) for (let i = this.children.length - 1; i >= 0; i--) this.children[i].destroy();
            for (let i = scene.children.length - 1; i >= 0; i--) {
                const object = scene.children[i];
                scene.remove(object);
                if (object.material) object.material.dispose();
                if (object.geometry) object.geometry.dispose();
            }
            return super.destroy();
        };
    }
}

export { ShaderStage };
