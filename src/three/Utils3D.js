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

    static createRT(width, height, type, format) {
        const rt = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: format || THREE.RGBAFormat,
            type,
            depthBuffer: false,
            stencilBuffer: false
        });
        rt.texture.generateMipmaps = false;
        return rt;
    }

    static getTexture(path) {
        if (!this.textures) this.textures = {};
        if (!this.textures[path]) {
            const texture = new THREE.Texture();
            texture.format = /jpe?g/.test(path) ? THREE.RGBFormat : THREE.RGBAFormat;
            const img = Assets.createImage(path);
            img.onload = () => {
                texture.image = img;
                texture.needsUpdate = true;
                if (!THREE.Math.isPowerOfTwo(img.width * img.height)) {
                    texture.minFilter = texture.magFilter = THREE.LinearFilter;
                    texture.generateMipmaps = false;
                }
            };
            this.textures[path] = texture;
        }
        return this.textures[path];
    }

    static getRepeatTexture(path) {
        const texture = this.getTexture(path);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }
}

export { Utils3D };
