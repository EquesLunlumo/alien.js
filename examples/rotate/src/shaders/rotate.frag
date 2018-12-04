// Based on https://www.shadertoy.com/view/XlsGWf by whiteskull

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;

const float speed = 0.1;

void main() {
    vec2 uv = vUv;
    float rotate = radians(uTime * speed * 45.0);
    uv -= 0.5;
    mat2 m = mat2(cos(rotate), -sin(rotate), sin(rotate), cos(rotate));
    uv = m * uv;
    uv += 0.5;
    vec4 color = texture2D(uTexture, uv);
    color.a *= uAlpha;
    gl_FragColor = color;
}
