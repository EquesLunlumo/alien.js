uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uAlpha;
uniform float uTransition;

varying vec2 vUv;

#pragma glslify: chromatic_aberration = require('./chromatic-aberration')

void main() {
    vec4 color = chromatic_aberration(uTexture, vUv, uTransition);
    color.a *= uAlpha;
    gl_FragColor = color;
}
