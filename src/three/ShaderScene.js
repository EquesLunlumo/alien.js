/**
 * Shader 3D scene.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Component } from '../util/Component.js';
import { ShaderInteraction3D } from './ShaderInteraction3D.js';

class ShaderScene extends Component {

    constructor(scene) {
        super();

        this.group = new THREE.Group();
        this.interaction = this.initClass(ShaderInteraction3D);
        this.scene = scene;
        this.children = [];

        scene.add(this.group);

        this.add = child => {
            child.setStage(this);
            child.parent = this;
            this.children.push(child);
            this.group.add(child.group);
        };

        this.remove = child => {
            child.stage = null;
            child.parent = null;
            this.children.remove(child);
            this.interaction.remove(child);
            this.group.remove(child.group);
            child.mesh.material.dispose();
            child.mesh.geometry.dispose();
        };

        this.destroy = () => {
            if (this.children) for (let i = this.children.length - 1; i >= 0; i--) this.children[i].destroy();
            if (this.group.parent) this.group.parent.remove(this.group);
            return super.destroy();
        };
    }
}

export { ShaderScene };
