/**
 * Post processing effects.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Utils3D } from './Utils3D.js';

class Effects extends Component {

    constructor(stage, params) {
        super();
        const self = this;
        this.stage = stage;
        this.renderer = params.renderer;
        this.scene = params.scene;
        this.camera = params.camera;
        this.shader = params.shader;
        this.dpr = params.dpr || 1;
        let renderTarget, scene, camera, mesh;

        initEffects();
        addListeners();

        function initEffects() {
            renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            self.texture = renderTarget.texture;
            self.texture.minFilter = THREE.LinearFilter;
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(self.stage.width / -2, self.stage.width / 2, self.stage.height / 2, self.stage.height / -2, 1, 1000);
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), self.shader.material);
            scene.add(mesh);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
        }

        function resize() {
            renderTarget.dispose();
            renderTarget = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            camera.left = self.stage.width / -2;
            camera.right = self.stage.width / 2;
            camera.top = self.stage.height / 2;
            camera.bottom = self.stage.height / -2;
            camera.updateProjectionMatrix();
        }

        this.render = () => {
            this.renderer.render(this.scene, this.camera, renderTarget, true);
            mesh.material.uniforms.texture.value = renderTarget.texture;
            this.renderer.render(scene, camera);
        };

        this.destroy = () => {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            renderTarget.dispose();
            renderTarget = null;
            mesh = null;
            camera = null;
            scene = null;
            return super.destroy();
        };
    }
}

export { Effects };
