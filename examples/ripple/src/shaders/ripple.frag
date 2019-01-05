// Based on https://gl-transitions.com/editor/ripple by gre

uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform float uAlpha;
uniform float uTransition;
uniform vec2 uDirection;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

const float amplitude = 100.0;
const float speed = 10.0;
const vec2 center = vec2(0.5, 0.5);

void main() {
    vec2 v = normalize(uDirection);
    v /= abs(v.x) + abs(v.y);
    float d = v.x * center.x * vUv.x + v.y * center.y * vUv.y;
    vec2 dir = vUv / 2.0;
    vec2 offset = dir * (sin((1.0 - uTransition) * d * amplitude - (1.0 - uTransition) * speed) + 0.5) / 30.0;
    vec4 color = mix(texture2D(tMap1, vUv + offset), texture2D(tMap2, vUv), smoothstep(0.2, 1.0, uTransition));
    color.a *= uAlpha;
    gl_FragColor = color;
}
