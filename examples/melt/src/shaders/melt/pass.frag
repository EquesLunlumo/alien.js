// Based on https://www.shadertoy.com/view/ldcGDX by DanielPettersso

uniform float uTime;
uniform int uFrame;
uniform vec2 uResolution;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying vec2 vUv;

#define PI 3.141592653589793

void main() {
    if (uFrame < 10) {
        gl_FragColor = texture2D(uTexture2, vUv);
        return;
    }

    vec2 texel = 1.0 / uResolution.xy;

    vec3 uv = texture2D(uTexture1, vUv).xyz;

    float gt = mod(uTime * vUv.x * vUv.y, 2.0 * PI);

    vec2 d1 = vec2(uv.x * vec2(texel.x * sin(gt * uv.z), texel.y * cos(gt * uv.x)));
    vec2 d2 = vec2(uv.y * vec2(texel.x * sin(gt * uv.x), texel.y * cos(gt * uv.y)));
    vec2 d3 = vec2(uv.z * vec2(texel.x * sin(gt * uv.y), texel.y * cos(gt * uv.z)));

    float bright = (uv.x + uv.y + uv.z) / 3.0 + 0.5;

    float r = texture2D(uTexture1, vUv + d1 * bright).x;
    float g = texture2D(uTexture1, vUv + d2 * bright).y;
    float b = texture2D(uTexture1, vUv + d3 * bright).z;

    vec3 uvMix = mix(uv, vec3(r, g, b), 0.2);

    vec3 orig = texture2D(uTexture2, vUv).xyz;

    gl_FragColor = vec4(mix(uvMix, orig, 0.007), 1.0);
}
