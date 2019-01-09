/**
 * Shader 3D scene.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Component } from '../util/Component.js';
import { ShaderInteraction3D } from './ShaderInteraction3D.js';

class ShaderScene extends Component {

    constructor(renderer, camera) {
        super();
        const scene = new THREE.Scene();

        this.interaction = this.initClass(ShaderInteraction3D, camera);
        this.alpha = 1;
        this.children = [];

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
            if (child.type !== '3d') child.enable3D();
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

export { ShaderScene };
