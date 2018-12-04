uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);
    color.a = 1.0;
    gl_FragColor = color;
}
