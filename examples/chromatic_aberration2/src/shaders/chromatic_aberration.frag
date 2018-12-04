uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D tDiffuse;
uniform float uDistortion;

varying vec2 vUv;

#pragma glslify: chromatic_aberration = require('./chromatic-aberration')

void main() {
    gl_FragColor = chromatic_aberration(tDiffuse, vUv, uDistortion);
}
