// Based on https://www.shadertoy.com/view/Mslfz4 by DonKarlssonSan

uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform float uAlpha;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

#pragma glslify: snoise = require('glsl-noise/simplex/2d')

void main() {
    vec2 uv = vUv;
    uv.x += snoise(vec2(uv.x, uTime / 10.0)) / 10.0;
    uv.y += snoise(vec2(uv.y, uTime / 10.0 + 5555.0)) / 10.0;

    vec4 c0 = texture2D(tMap1, uv);
    vec4 c1 = texture2D(tMap2, uv);
    float t0 = uTime / 10.0;
    float t = snoise(vec2(t0, t0 + 1000.0));
    float m = snoise(uv + t);
    vec4 color = mix(c0, c1, m);
    color.a *= uAlpha;
    gl_FragColor = color;
}
