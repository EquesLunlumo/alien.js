export default `
uniform sampler2D tMap;
uniform float uAlpha;
uniform vec4 uMask;

varying vec2 vUv;
varying vec2 vWorldPos;

void main() {
    gl_FragColor = texture2D(tMap, vUv);
    gl_FragColor.a *= uAlpha;

    if (vWorldPos.x > uMask.x + uMask.z) discard;
    if (vWorldPos.x < uMask.x) discard;
    if (vWorldPos.y > uMask.y) discard;
    if (vWorldPos.y < uMask.y - uMask.w) discard;
}
`;
