uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float distortion;

varying vec2 vUv;

#pragma glslify: chromatic_aberration = require('./chromatic-aberration')

void main() {
    gl_FragColor = chromatic_aberration(texture, vUv, distortion);
}
