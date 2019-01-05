export default `
uniform sampler2D tMap;
uniform float uAlpha;
uniform vec4 uMask;

varying vec2 vUv;
varying vec2 vWorldPos;

void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position.xy, 0.0, 1.0)).xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
