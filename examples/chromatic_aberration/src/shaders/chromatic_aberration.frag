uniform sampler2D tMap;
uniform float uAlpha;
uniform float uTransition;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

#pragma glslify: chromatic_aberration = require('./chromatic-aberration')

void main() {
    vec4 color = chromatic_aberration(tMap, vUv, uTransition);
    color.a *= uAlpha;
    gl_FragColor = color;
}
