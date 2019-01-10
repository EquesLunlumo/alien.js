uniform sampler2D tMap;
uniform float uActive;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
