// Based on https://www.shadertoy.com/view/XlsGWf by whiteskull

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float opacity;

varying vec2 vUv;

const float speed = 0.1;

void main() {
    vec2 uv = vUv;
    float rotate = radians(time * speed * 45.0);
    uv -= 0.5;
    mat2 m = mat2(cos(rotate), -sin(rotate), sin(rotate), cos(rotate));
    uv = m * uv;
    uv += 0.5;
    vec4 color = texture2D(texture, uv);
    color.a *= opacity;
    gl_FragColor = color;
}
