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

    constructor(width, height, map) {

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

        if (typeof height !== 'number') {
            map = height;
            height = width;
        }
        if (typeof width !== 'number') {
            map = width;
            height = 0;
            width = 0;
        }
        if (typeof map === 'undefined') map = null;

        this.type = '2d';
        this.shader = new Shader(vertShaderObject, fragShaderObject, {
            tMap: { value: typeof map === 'string' ? Utils3D.getTexture(map) : map },
            uAlpha: { value: 1 },
            blending: THREE.NoBlending,
            transparent: true,
            depthWrite: false,
            depthTest: false
        });
        this.usingMap = !!map;
        this.tMap = this.shader.uniforms.tMap;
        this.alpha = 1;
        this.values = {
            x: 0,
            y: 0,
            z: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            scale: 1
        };
        this.dimensions = new THREE.Vector3(width, height, 1);
        this.group = new THREE.Group();
        this.mesh = new THREE.Mesh(ShaderObject.getGeometry('2d'), this.shader.material);
        this.mesh.frustumCulled = false;
        this.mesh.onBeforeRender = () => this.updateValues();
        this.group.add(this.mesh);
        this.children = [];
        this.isDirty = true;
    }

    updateValues() {
        if (!this.determineVisible()) return;
        if (this.mesh.material.uniforms.uAlpha) this.mesh.material.uniforms.uAlpha.value = this.getAlpha();
        if (!this.isDirty) return;
        this.group.position.x = this.values.x;
        this.group.position.y = this.type === '3d' ? this.values.y : -this.values.y;
        this.group.position.z = this.values.z;
        if (this.type !== '3d') this.group.rotation.z = Math.radians(-this.values.rotation);
        if (this.values.scale !== 1) {
            this.group.position.x += (this.dimensions.x - this.dimensions.x * this.values.scale) / 2;
            this.group.position.y -= (this.dimensions.y - this.dimensions.y * this.values.scale) / 2;
        }
        if (this.usingMap) {
            this.mesh.scale.set(1, 1, 1).multiply(this.dimensions);
            this.group.scale.x = this.values.scaleX * this.values.scale;
            this.group.scale.y = this.values.scaleY * this.values.scale;
        } else {
            this.group.scale.set(this.values.scaleX * this.values.scale, this.values.scaleY * this.values.scale, 1);
        }
        if (this.calcMask) {
            const v = this.isMasked;
            v.copy(v.origin);
            this.group.localToWorld(v);
            v.z = v.width;
            v.w = v.height;
        }
        this.isDirty = false;
    }

    size(width, height = width) {
        this.width = width;
        this.height = height;
        return this;
    }

    add(child) {
        child.setStage(this.stage);
        child.parent = this;
        this.children.push(child);
        this.group.add(child.group);
        if (this.isMasked) child.mask(this.isMasked, this.maskVertexShader, this.maskFragmentShader);
        if (this.type === '3d' && child.type !== '3d') child.enable3D();
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

    enable3D(style2d) {
        this.type = '3d';
        this.mesh.geometry = ShaderObject.getGeometry(style2d ? '2d' : '3d');
        this.mesh.material.depthWrite = true;
        this.mesh.material.depthTest = true;
        this.mesh.frustumCulled = true;
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

    useGeometry(geom) {
        this.mesh.geometry = geom;
        return this;
    }

    useShader(shader) {
        if (shader) {
            shader.uniforms.tMap = this.shader.uniforms.tMap;
            shader.uniforms.uAlpha = this.shader.uniforms.uAlpha;
            this.mesh.material = shader.material;
        } else {
            this.mesh.material = this.shader.material;
        }
        return this;
    }

    mask(d, vertexShader, fragmentShader) {
        let v;
        if (d instanceof THREE.Vector4) {
            this.isMasked = true;
            v = d;
        } else {
            v = new THREE.Vector4(d.x, d.y, 0, 1);
            v.origin = (new THREE.Vector4).copy(v);
            v.width = d.width;
            v.height = d.height;
            this.calcMask = true;
            this.isMasked = v;
        }
        this.maskVertexShader = vertexShader;
        this.maskFragmentShader = fragmentShader;
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
        for (let i = 0; i < this.children.length; i++) this.children[i].mask(v, vertexShader, fragmentShader);
        return v;
    }

    determineVisible() {
        let mesh = this.mesh;
        if (!mesh.visible) return false;
        let parent = mesh.parent;
        while (parent) {
            if (!parent.visible) return false;
            parent = parent.parent;
        }
        return true;
    }

    getAlpha() {
        let alpha = this.alpha,
            parent = this.parent;
        while (parent && parent.alpha) {
            alpha *= parent.alpha;
            parent = parent.parent;
        }
        return alpha;
    }

    destroy() {
        if (this.children) for (let i = this.children.length - 1; i >= 0; i--) this.children[i].destroy();
        if (this.parent) this.parent.remove(this);
        return Utils.nullObject(this);
    }

    get width() {
        return this.dimensions.x;
    }

    set width(v) {
        this.dimensions.x = v;
        this.isDirty = true;
    }

    get height() {
        return this.dimensions.y;
    }

    set height(v) {
        this.dimensions.y = v;
        this.isDirty = true;
    }

    get x() {
        return this.values.x;
    }

    set x(v) {
        this.values.x = v;
        this.isDirty = true;
    }

    get y() {
        return this.values.y;
    }

    set y(v) {
        this.values.y = v;
        this.isDirty = true;
    }

    get z() {
        return this.values.z;
    }

    set z(v) {
        this.values.z = v;
        this.isDirty = true;
    }

    get rotation() {
        return this.values.rotation;
    }

    set rotation(v) {
        this.values.rotation = v;
        this.isDirty = true;
    }

    get scale() {
        return this.values.scale;
    }

    set scale(v) {
        this.values.scale = v;
        this.isDirty = true;
    }

    get scaleX() {
        return this.values.scaleX;
    }

    set scaleX(v) {
        this.values.scaleX = v;
        this.isDirty = true;
    }

    get scaleY() {
        return this.values.scaleY;
    }

    set scaleY(v) {
        this.values.scaleY = v;
        this.isDirty = true;
    }
}

export { ShaderObject };
