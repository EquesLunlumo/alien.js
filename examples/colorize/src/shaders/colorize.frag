// Based on https://www.shadertoy.com/view/ldBfRR by dcbrwn

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float opacity;
uniform float progress;

varying vec2 vUv;

void main() {
    vec4 top = vec4(1.0, 0.8, 0.4, 1.0);
    vec4 bottom = vec4(0.4, 0.8, 1.0, 1.0);
    vec4 tex = texture2D(texture, vUv, 0.0);
    //vec4 rgba = tex * mix(bottom, top, vUv.y);
    vec4 rgba = tex * mix(bottom, top, progress);
    rgba.a *= opacity;
    gl_FragColor = rgba;
}
