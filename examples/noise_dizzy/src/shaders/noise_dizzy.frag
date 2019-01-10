// Based on https://www.shadertoy.com/view/ldjcR1 by dcbrwn

uniform sampler2D tDiffuse;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: cnoise = require('glsl-noise/classic/2d')

void main() {
    vec2 displace = vec2(cnoise(vUv * 10.0 + uTime), cnoise(vUv * 10.0 + uTime));
    gl_FragColor = texture2D(tDiffuse, vUv + displace / 50.0);
}
