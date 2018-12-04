// Based on https://gl-transitions.com/editor/perlin by Rich-Harris

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uAlpha;
uniform float uTransition;

varying vec2 vUv;

const float scale = 4.0;
const float smoothness = 0.01;
const float seed = 12.9898;

#pragma glslify: noise = require('./modules/noise/noise')

void main() {
    float n = noise(vUv * scale);

    float p = mix(-smoothness, 1.0 + smoothness, uTransition);
    float lower = p - smoothness;
    float higher = p + smoothness;

    float q = smoothstep(lower, higher, n);

    vec4 color = mix(texture2D(uTexture1, vUv), texture2D(uTexture2, vUv), 1.0 - q);
    color.a *= uAlpha;
    gl_FragColor = color;
}
