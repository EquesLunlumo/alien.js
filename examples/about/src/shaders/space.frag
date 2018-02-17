// Based on https://www.shadertoy.com/view/XlsGWf by whiteskull

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D texture;
uniform float opacity;
uniform float radius;
uniform float beam;
uniform float beamWidth;

varying vec2 vUv;

const float speed = 0.1;

void main() {
    vec2 uv = vUv;
    float rotate = radians(time * speed * -45.0);
    uv -= 0.5;
    mat2 m = mat2(cos(rotate), -sin(rotate), sin(rotate), cos(rotate));
    uv = m * uv;
    uv += 0.5;

    vec2 p = (gl_FragCoord.xy - mouse.xy * resolution.xy) / resolution.y;
    float r = length(p) - radius;

    vec4 rgba = mix(vec4(0.0), texture2D(texture, uv), smoothstep(0.0, 1.0, abs(beam / (beamWidth * r))));
    rgba.a *= opacity;
    gl_FragColor = rgba;
}
