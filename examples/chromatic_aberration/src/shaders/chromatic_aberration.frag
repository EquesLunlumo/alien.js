uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float opacity;
uniform float progress;

varying vec2 vUv;

#pragma glslify: chromatic_aberration = require('./chromatic-aberration')

void main() {
    vec4 color = chromatic_aberration(texture, vUv, progress);
    color.a *= opacity;
    gl_FragColor = color;
}
