// Based on https://gl-transitions.com/editor/perlin by Rich-Harris

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float opacity;
uniform float progress;

varying vec2 vUv;

const float scale = 4.0;
const float smoothness = 0.01;
const float seed = 12.9898;

#pragma glslify: noise = require('./noise/noise')

void main() {
    float n = noise(vUv * scale);

    float p = mix(-smoothness, 1.0 + smoothness, progress);
    float lower = p - smoothness;
    float higher = p + smoothness;

    float q = smoothstep(lower, higher, n);

    vec4 color = mix(texture2D(texture1, vUv), texture2D(texture2, vUv), 1.0 - q);
    color.a *= opacity;
    gl_FragColor = color;
}
