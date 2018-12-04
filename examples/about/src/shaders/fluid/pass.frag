// Based on https://www.shadertoy.com/view/XlsBDf by davidar

uniform float uTime;
uniform int uFrame;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uLast;
uniform vec2 uVelocity;
uniform vec2 uStrength;
uniform sampler2D uTexture;

#define MAX_ITERATIONS 5.0

#define T(p) texture2D(uTexture, (p) / uResolution.xy)
#define length2(p) dot(p, p)

#define dt 0.15
#define K 0.2
#define nu 0.5
#define kappa 0.1

void main() {
    if (uFrame < 10) {
        gl_FragColor = vec4(0, 0, 1, 0);
        return;
    }

    vec2 p = gl_FragCoord.xy;
    vec4 c = T(p);

    vec4 n = T(p + vec2(0, 1));
    vec4 e = T(p + vec2(1, 0));
    vec4 s = T(p - vec2(0, 1));
    vec4 w = T(p - vec2(1, 0));

    vec4 laplacian = (n + e + s + w - 4.0 * c);

    vec4 dx = (e - w) / 2.0;
    vec4 dy = (n - s) / 2.0;

    // velocity field divergence
    float div = dx.x + dy.y;

    // mass conservation, Euler method step
    c.z -= dt * (dx.z * c.x + dy.z * c.y + div * c.z);

    // semi-Langrangian advection
    c.xyw = T(p - dt * c.xy).xyw;

    // viscosity/diffusion
    c.xyw += dt * vec3(nu, nu, kappa) * laplacian.xyw;

    // nullify divergence with pressure field gradient
    c.xy -= K * vec2(dx.z, dy.z);

    // external source
    vec2 pos = uLast.xy;
    float iterations = clamp((length(uVelocity) / 40.0) * MAX_ITERATIONS, 1.0, MAX_ITERATIONS);
    for (float i = 0.0; i < MAX_ITERATIONS; i += 1.0) {
        if (i >= iterations) break;
        pos += (uMouse.xy - pos.xy) * ((i + 1.0) / iterations);
        vec2 m = pos.xy * uResolution.xy;
        c.xyw += dt * exp(-length2(p - m) / uStrength.x) * vec3(p - m + (uVelocity.xy * uStrength.y), 1);
    }

    // dissipation
    c.w -= dt * 0.0005;

    c.xyzw = clamp(c.xyzw, vec4(-5, -5, 0.5, 0), vec4(5, 5, 3, 5));

    gl_FragColor = c;
}
