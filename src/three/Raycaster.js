/**
 * Raycaster.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Component } from '../util/Component.js';
import { Mouse } from '../util/Mouse.js';
import { Stage } from '../view/Stage.js';

class Raycaster extends Component {

    constructor(camera) {
        super();
        const calc = new THREE.Vector2(),
            raycaster = new THREE.Raycaster();
        let debug;

        this.camera = camera;

        function ascSort(a, b) {
            return Math.round(a.distance * 100) / 100 - Math.round(b.distance * 100) / 100;
        }

        function intersectObject(object, raycaster, intersects, recursive) {
            if (!object.visible) return;
            let parent = object.parent;
            while (parent) {
                if (!parent.visible) return;
                parent = parent.parent;
            }
            object.raycast(raycaster, intersects);
            if (recursive) object.children.forEach(object => intersectObject(object, raycaster, intersects, true));
        }

        function intersect(objects) {
            if (!Array.isArray(objects)) objects = [objects];
            const intersects = [];
            objects.forEach(object => intersectObject(object, raycaster, intersects, false));
            intersects.sort(ascSort);
            if (debug) updateDebug();
            return intersects;
        }

        function updateDebug() {
            const vertices = debug.geometry.vertices;
            vertices[0].copy(raycaster.ray.origin.clone());
            vertices[1].copy(raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(10000)));
            debug.geometry.verticesNeedUpdate = true;
        }

        this.pointsThreshold = value => {
            raycaster.params.Points.threshold = value;
        };

        this.debug = scene => {
            const geom = new THREE.Geometry();
            geom.vertices.push(new THREE.Vector3(-100, 0, 0));
            geom.vertices.push(new THREE.Vector3(100, 0, 0));
            const mat = new THREE.LineBasicMaterial({ color: 0xff0000 });
            debug = new THREE.Line(geom, mat);
            scene.add(debug);
        };

        this.checkHit = (objects, mouse = Mouse) => {
            const rect = this.rect || Stage;
            if (mouse === Mouse && rect === Stage) {
                calc.copy(Mouse.tilt);
            } else {
                calc.x = mouse.x / rect.width * 2 - 1;
                calc.y = -(mouse.y / rect.height) * 2 + 1;
            }
            raycaster.setFromCamera(calc, this.camera);
            return intersect(objects);
        };

        this.checkFromValues = (objects, origin, direction) => {
            raycaster.set(origin, direction, 0, Number.POSITIVE_INFINITY);
            return intersect(objects);
        };
    }
}

export { Raycaster };
