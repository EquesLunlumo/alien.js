// Based on https://www.shadertoy.com/view/4s3GWj by NemoKradXNA

uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform float uAlpha;
uniform float uTransition;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec4 color = mix(texture2D(tMap1, vUv), texture2D(tMap2, vUv), uTransition);
    color.a *= uAlpha;
    gl_FragColor = color;
}
