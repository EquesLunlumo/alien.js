/**
 * Screen projection.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Component } from '../util/Component.js';
import { Stage } from '../view/Stage.js';

class ScreenProjection extends Component {

    constructor(camera) {
        super();
        const v3 = new THREE.Vector3(),
            v32 = new THREE.Vector3(),
            value = new THREE.Vector3;

        this.camera = camera;

        this.unproject = (mouse, distance) => {
            const rect = this.rect || Stage;
            v3.set(mouse.x / rect.width * 2 - 1, -(mouse.y / rect.height) * 2 + 1, 0.5);
            v3.unproject(this.camera);
            const pos = this.camera.position;
            v3.sub(pos).normalize();
            const dist = distance || -pos.z / v3.z;
            value.copy(pos).add(v3.multiplyScalar(dist));
            return value;
        };

        this.project = pos => {
            const rect = this.rect || Stage;
            if (pos instanceof THREE.Object3D) {
                pos.updateMatrixWorld();
                v32.set(0, 0, 0).setFromMatrixPosition(pos.matrixWorld);
            } else {
                v32.copy(pos);
            }
            v32.project(this.camera);
            v32.x = (v32.x + 1) / 2 * rect.width;
            v32.y = -(v32.y - 1) / 2 * rect.height;
            return v32;
        };
    }
}

export { ScreenProjection };
