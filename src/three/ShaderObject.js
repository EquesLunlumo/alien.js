/**
 * Shader object.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Utils } from '../util/Utils.js';
import { Utils3D } from './Utils3D.js';
import { Shader } from './Shader.js';

import vertShaderObject from './shaders/shader_object_vert.glsl.js';
import fragShaderObject from './shaders/shader_object_frag.glsl.js';
import vertShaderObjectMask from './shaders/shader_object_mask_vert.glsl.js';
import fragShaderObjectMask from './shaders/shader_object_mask_frag.glsl.js';

class ShaderObject {

    constructor(width = 0, height = width, map = null) {

        if (!ShaderObject.initialized) {
            let geom2d, geom3d;

            ShaderObject.getGeometry = type => {
                if (type === '3d') {
                    if (!geom3d) geom3d = new THREE.PlaneBufferGeometry(1, 1);
                    return geom3d;
                } else {
                    if (!geom2d) {
                        geom2d = new THREE.PlaneBufferGeometry(1, 1);
                        geom2d.translate(0.5, -0.5, 0);
                    }
                    return geom2d;
                }
            };

            ShaderObject.initialized = true;
        }

        const self = this;

        const shader = new Shader(vertShaderObject, fragShaderObject, {
            tMap: { value: typeof map === 'string' ? Utils3D.getTexture(map) : map },
            uAlpha: { value: 1 },
            transparent: true,
            depthWrite: false,
            depthTest: false
        });

        this.usingMap = !!map;
        this.tMap = shader.uniforms.tMap;
        this.group = new THREE.Group();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scale = 1;
        this.alpha = 1;
        this.dimensions = new THREE.Vector3(width, height, 1);
        this.children = [];
        this.shader = shader;
        this.mesh = new THREE.Mesh(ShaderObject.getGeometry('2d'), map ? shader.material : new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }));
        this.mesh.frustumCulled = false;
        this.group.add(this.mesh);

        function getAlpha() {
            let alpha = self.alpha,
                parent = self.parent;
            while (parent) {
                alpha *= parent.alpha;
                parent = parent.parent;
            }
            return alpha;
        }

        function update() {
            self.group.position.x = self.x;
            self.group.position.y = -self.y;
            self.group.position.z = self.z;
            self.group.rotation.z = Math.radians(-self.rotation);
            if (self.scale !== 1) {
                self.group.position.x += (self.dimensions.x - (self.dimensions.x * self.scale)) / 2;
                self.group.position.y -= (self.dimensions.y - (self.dimensions.y * self.scale)) / 2;
            }
            if (map) {
                self.mesh.scale.set(1, 1, 1).multiply(self.dimensions);
                self.group.scale.x = self.scaleX * self.scale;
                self.group.scale.y = self.scaleY * self.scale;
            } else {
                self.group.scale.set(self.scaleX * self.scale, self.scaleY * self.scale, 1);
            }
            const shader = self.mesh.material.shader;
            if (shader && shader.uniforms && shader.uniforms.uAlpha) shader.uniforms.uAlpha.value = getAlpha();
            if (self.calcMask) {
                const v = self.isMasked;
                v.copy(v.origin);
                self.group.localToWorld(v);
                v.z = v.width;
                v.w = v.height;
            }
        }

        this.mesh.onBeforeRender = update;
        update();
    }

    add(child) {
        child.setStage(this.stage);
        child.parent = this;
        this.children.push(child);
        this.group.add(child.group);
        if (this.isMasked) child.mask(this.isMasked, this.maskVertexShader, this.maskFragmentShader);
        if (this.type === '3d') child.enable3D();
    }

    setStage(stage) {
        this.stage = stage;
        for (let i = 0; i < this.children.length; i++) this.children[i].setStage(stage);
    }

    interact(overCallback, clickCallback) {
        this.onOver = overCallback;
        this.onClick = clickCallback;
        if (overCallback) this.stage.interaction.add(this);
        else this.stage.interaction.remove(this);
        return this;
    }

    remove(child) {
        child.stage = null;
        child.parent = null;
        this.children.remove(child);
        this.stage.interaction.remove(child);
        this.group.remove(child.group);
    }

    create(width, height, map) {
        const child = new ShaderObject(width, height, map);
        this.add(child);
        return child;
    }

    tween(props, time, ease, delay, complete, update) {
        return tween(this, props, time, ease, delay, complete, update);
    }

    clearTween() {
        clearTween(this);
        return this;
    }

    enable3D() {
        this.type = '3d';
        this.dimensions.x *= 0.005;
        this.dimensions.y *= 0.005;
        this.mesh.geometry = ShaderObject.getGeometry('3d');
        this.mesh.material.depthWrite = true;
        this.mesh.material.depthTest = true;
        return this;
    }

    setZ(z) {
        this.mesh.renderOrder = z;
        return this;
    }

    show() {
        this.group.visible = true;
        return this;
    }

    hide() {
        this.group.visible = false;
        return this;
    }

    useShader(shader) {
        this.mesh.material = shader.material;
    }

    useGeometry(geom) {
        this.mesh.geometry = geom;
    }

    updateMap(map = null) {
        this.shader.uniforms.tMap.value = typeof map === 'string' ? Utils3D.getTexture(map) : map;
    }

    mask(d, vertexShader, fragmentShader) {
        let v;
        if (!(d instanceof THREE.Vector4)) {
            v = new THREE.Vector4(d.x, d.y, 0, 1);
            v.origin = new THREE.Vector4().copy(v);
            v.width = d.width;
            v.height = d.height;
            this.calcMask = true;
            this.isMasked = v;
        } else {
            this.isMasked = true;
            v = d;
        }
        if (this.usingMap) {
            const shader = new Shader(vertexShader || vertShaderObjectMask, fragmentShader || fragShaderObjectMask, {
                tMap: this.tMap,
                uAlpha: { value: 1 },
                uMask: { value: v },
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            this.useShader(shader);
        }
        this.maskVertexShader = vertexShader;
        this.maskFragmentShader = fragmentShader;
        for (let i = 0; i < this.children.length; i++) this.children[i].mask(v, vertexShader, fragmentShader);
        return v;
    }

    getScreenCoords() {
        const v3 = new THREE.Vector3();
        this.mesh.localToWorld(v3);
        v3.y *= -1;
        return v3;
    }

    destroy() {
        if (this.children) for (let i = this.children.length - 1; i >= 0; i--) this.children[i].destroy();
        if (this.parent) this.parent.remove(this);
        return Utils.nullObject(this);
    }
}

export { ShaderObject };
