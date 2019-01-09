/**
 * Shader 2D scene.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Stage } from '../view/Stage.js';
import { ShaderInteraction2D } from './ShaderInteraction2D.js';

class ShaderStage extends Component {

    constructor(renderer) {
        super();
        const self = this;
        const scene = new THREE.Scene(),
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.interaction = this.initClass(ShaderInteraction2D, camera);
        this.alpha = 1;
        this.children = [];

        addListeners();

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
            if (!scene.children.length) return;
            const clear = renderer.autoClear;
            renderer.autoClear = false;
            renderer.render(scene, camera, rt || this.rt);
            renderer.autoClear = clear;
        };

        this.add = child => {
            child.setStage(this);
            child.parent = this;
            this.children.push(child);
            scene.add(child.group);
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
