/**
 * Shader helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Component } from '../util/Component.js';

class Shader extends Component {

    constructor(vertexShader, fragmentShader, props) {
        super();
        const self = this;

        this.uniforms = {};
        this.properties = {};

        initProperties();
        initShader();

        function initProperties() {
            for (let key in props) {
                if (typeof props[key].value !== 'undefined') self.uniforms[key] = props[key];
                else self.properties[key] = props[key];
            }
        }

        function initShader() {
            const params = {};
            params.vertexShader = process(vertexShader, 'vs');
            params.fragmentShader = process(fragmentShader, 'fs');
            params.uniforms = self.uniforms;
            for (let key in self.properties) params[key] = self.properties[key];
            self.material = new THREE.RawShaderMaterial(params);
            self.material.shader = self;
            self.uniforms = self.material.uniforms;
        }

        function process(code, type) {
            let header;
            if (type === 'vs') {
                header = [
                    'precision highp float;',
                    'precision highp int;',
                    'attribute vec2 uv;',
                    'attribute vec3 position;',
                    'attribute vec3 normal;',
                    'uniform mat4 modelViewMatrix;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 modelMatrix;',
                    'uniform mat4 viewMatrix;',
                    'uniform mat3 normalMatrix;',
                    'uniform vec3 cameraPosition;'
                ].join('\n');
            } else {
                header = [
                    ~code.indexOf('dFdx') ? '#extension GL_OES_standard_derivatives : enable' : '',
                    'precision highp float;',
                    'precision highp int;',
                    'uniform mat4 modelViewMatrix;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 modelMatrix;',
                    'uniform mat4 viewMatrix;',
                    'uniform mat3 normalMatrix;',
                    'uniform vec3 cameraPosition;'
                ].join('\n');
            }
            return header + '\n\n' + code;
        }

        this.clone = () => {
            const shader = new Shader(vertexShader, fragmentShader, props);
            shader.properties = this.properties;
            this.copyUniformsTo(shader);
            return shader;
        };

        this.copyUniformsTo = shader => {
            for (let key in this.uniforms) shader.uniforms[key] = { type: this.uniforms[key].type, value: this.uniforms[key].value };
        };

        this.destroy = () => {
            this.material.dispose();
            return super.destroy();
        };
    }
}

export { Shader };
