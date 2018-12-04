// Based on https://www.shadertoy.com/view/4s3GWj by NemoKradXNA

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uAlpha;
uniform float uTransition;

varying vec2 vUv;

void main() {
    vec4 color = mix(texture2D(uTexture1, vUv), texture2D(uTexture2, vUv), uTransition);
    color.a *= uAlpha;
    gl_FragColor = color;
}
