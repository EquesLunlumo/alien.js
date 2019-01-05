/**
 * 3D utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Assets } from '../util/Assets.js';

class Utils3D {

    static decompose(local, world) {
        local.matrixWorld.decompose(world.position, world.quaternion, world.scale);
    }

    static createRT(width, height) {
        const params = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false
        };
        return new THREE.WebGLRenderTarget(width, height, params);
    }

    static getTexture(src) {
        if (!this.textures) this.textures = {};
        if (!this.textures[src]) {
            const img = Assets.createImage(src),
                texture = new THREE.Texture(img);
            img.onload = () => {
                texture.needsUpdate = true;
                if (texture.onload) {
                    texture.onload();
                    texture.onload = null;
                }
                if (!THREE.Math.isPowerOfTwo(img.width * img.height)) texture.minFilter = THREE.LinearFilter;
            };
            this.textures[src] = texture;
        }
        return this.textures[src];
    }

    static getRepeatTexture(src) {
        const texture = this.getTexture(src);
        texture.onload = () => texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
}

export { Utils3D };
