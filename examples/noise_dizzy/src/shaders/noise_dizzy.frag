// Based on https://www.shadertoy.com/view/ldjcR1 by dcbrwn

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: cnoise = require('glsl-noise/classic/2d')

void main() {
    vec2 displace = vec2(cnoise(vUv * 10.0 + time), cnoise(vUv * 10.0 + time));
    gl_FragColor = texture2D(texture, vUv + displace / 50.0, 0.0);
}
