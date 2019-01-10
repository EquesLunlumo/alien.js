// Based on https://www.shadertoy.com/view/XlsGWf by whiteskull

uniform sampler2D tDiffuse;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uBeam;
uniform float uBeamWidth;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

const float speed = 0.1;

void main() {
    vec2 uv = vUv;
    float rotate = radians(uTime * speed * -45.0);
    uv -= 0.5;
    mat2 m = mat2(cos(rotate), -sin(rotate), sin(rotate), cos(rotate));
    uv = m * uv;
    uv += 0.5;

    vec2 p = (gl_FragCoord.xy - uMouse.xy * uResolution.xy) / uResolution.y;
    float r = length(p) - uRadius;

    gl_FragColor = mix(vec4(0.0), texture2D(tDiffuse, uv), smoothstep(0.0, 1.0, abs(uBeam / (uBeamWidth * r))));
}
