uniform sampler2D tMap;
uniform float uActive;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: crange = require('./modules/range/crange')
#pragma glslify: cnoise = require('glsl-noise/classic/2d')

void main() {
    vec2 uv = vUv;
    float warp = crange(uActive, 0.0, 0.5, 0.0, 1.0) * crange(uActive, 0.5, 1.0, 1.0, 0.0);
    uv.x += cnoise(uv.yy * 1.2 + uTime) * 0.0022 * warp;
    uv.y += cnoise(uv.yy * 1.2 + uTime) * 0.022 * warp;
    gl_FragColor = texture2D(tMap, uv);
}
