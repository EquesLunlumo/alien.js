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
        this.enabled = params.enabled !== false;
        this.passes = params.passes || [];
        this.dpr = params.dpr || 1;
        this.rt = params.rt;
        let renderTarget1, renderTarget2, scene, camera, mesh;

        initEffects();
        addListeners();

        function initEffects() {
            renderTarget1 = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            renderTarget2 = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(self.stage.width / -2, self.stage.width / 2, self.stage.height / 2, self.stage.height / -2, 1, 1000);
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.MeshBasicMaterial());
            scene.add(mesh);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
        }

        function resize() {
            renderTarget1.dispose();
            renderTarget2.dispose();
            renderTarget1 = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            renderTarget2 = Utils3D.createRT(self.stage.width * self.dpr, self.stage.height * self.dpr);
            camera.left = self.stage.width / -2;
            camera.right = self.stage.width / 2;
            camera.top = self.stage.height / 2;
            camera.bottom = self.stage.height / -2;
            camera.updateProjectionMatrix();
        }

        this.add = (pass, index) => {
            if (typeof index === 'number') {
                this.passes.splice(index, 0, pass);
                return;
            }
            this.passes.push(pass);
        };

        this.remove = pass => {
            if (typeof pass === 'number') this.passes.splice(pass);
            else this.passes.remove(pass);
        };

        this.render = rt => {
            if (!this.enabled || !this.passes.length) {
                this.renderer.render(this.scene, this.camera, rt || this.rt);
                return;
            }
            this.renderer.render(this.scene, this.camera, renderTarget1, true);
            for (let i = 0; i < this.passes.length - 1; i++) {
                mesh.material = this.passes[i].material;
                mesh.material.uniforms.texture.value = renderTarget1.texture;
                this.renderer.render(scene, camera, renderTarget2);
                const renderTarget = renderTarget1;
                renderTarget1 = renderTarget2;
                renderTarget2 = renderTarget;
            }
            mesh.material = this.passes[this.passes.length - 1].material;
            mesh.material.uniforms.texture.value = renderTarget1.texture;
            this.renderer.render(scene, camera, rt || this.rt);
        };

        this.destroy = () => {
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            renderTarget1.dispose();
            renderTarget2.dispose();
            renderTarget1 = null;
            renderTarget2 = null;
            mesh = null;
            camera = null;
            scene = null;
            return super.destroy();
        };
    }
}

export { Effects };
