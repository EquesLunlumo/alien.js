// Based on https://www.shadertoy.com/view/4s3GWj by NemoKradXNA

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float opacity;
uniform float progress;

varying vec2 vUv;

void main() {
    vec4 color = mix(texture2D(texture1, vUv), texture2D(texture2, vUv), progress);
    color.a *= opacity;
    gl_FragColor = color;
}
