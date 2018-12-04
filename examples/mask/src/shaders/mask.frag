uniform float uTime;
uniform sampler2D tDiffuse;
uniform sampler2D tMask;
uniform float uAlpha;

varying vec2 vUv;

#pragma glslify: animateLevels = require('./modules/levelmask/levelmask')

void main() {
    float levels = animateLevels(texture2D(tMask, vUv), uAlpha);
    vec4 color = texture2D(tDiffuse, vUv) * pow(levels, 3.0);
    color.a *= levels;
    gl_FragColor = color;
}
