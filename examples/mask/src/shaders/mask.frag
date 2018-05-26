uniform float time;
uniform sampler2D texture;
uniform sampler2D mask;
uniform float opacity;

varying vec2 vUv;

#pragma glslify: animateLevels = require('./modules/levelmask/levelmask')

void main() {
    float levels = animateLevels(texture2D(mask, vUv), opacity);
    vec4 color = texture2D(texture, vUv) * pow(levels, 3.0);
    color.a *= levels;
    gl_FragColor = color;
}
