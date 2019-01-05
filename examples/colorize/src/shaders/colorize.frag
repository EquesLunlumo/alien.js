// Based on https://www.shadertoy.com/view/ldBfRR by dcbrwn

uniform sampler2D tMap;
uniform float uAlpha;
uniform float uTransition;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec4 top = vec4(1.0, 0.8, 0.4, 1.0);
    vec4 bottom = vec4(0.4, 0.8, 1.0, 1.0);
    vec4 tex = texture2D(tMap, vUv);
    //vec4 color = tex * mix(bottom, top, vUv.y);
    vec4 color = tex * mix(bottom, top, uTransition);
    color.a *= uAlpha;
    gl_FragColor = color;
}
