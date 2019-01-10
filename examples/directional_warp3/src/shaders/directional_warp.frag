// Based on https://gl-transitions.com/editor/directionalwarp by pschroen

uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform float uAlpha;
uniform float uTransition;
uniform vec2 uDirection;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

const float smoothness = 0.5;
const vec2 center = vec2(0.5, 0.5);

void main() {
    vec2 v = normalize(uDirection);
    v /= abs(v.x) + abs(v.y);
    float d = v.x * center.x + v.y * center.y;
    float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * vUv.x + v.y * vUv.y - (d - 0.5 + uTransition * (1.0 + smoothness)));
    vec4 color = mix(texture2D(tMap1, (vUv - 0.5) * (1.0 - m) + 0.5), texture2D(tMap2, (vUv - 0.5) * m + 0.5), m);
    //color.rgb *= 0.65;
    color.a *= uAlpha;
    gl_FragColor = color;
}
