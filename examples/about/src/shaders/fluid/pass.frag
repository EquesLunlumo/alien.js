// Based on https://www.shadertoy.com/view/XlsBDf by davidar

uniform float time;
uniform int frame;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec2 velocity;
uniform vec2 strength;
uniform sampler2D texture;

#define T(p) texture2D(texture, (p) / resolution.xy)
#define length2(p) dot(p, p)

#define dt 0.15
#define K 0.2
#define nu 0.5
#define kappa 0.1

void main() {
    if (frame < 10) {
        gl_FragColor = vec4(0, 0, 1, 0);
        return;
    }

    vec2 p = gl_FragCoord.xy;
    vec4 color = T(p);

    vec4 n = T(p + vec2(0, 1));
    vec4 e = T(p + vec2(1, 0));
    vec4 s = T(p - vec2(0, 1));
    vec4 w = T(p - vec2(1, 0));

    vec4 laplacian = (n + e + s + w - 4.0 * color);

    vec4 dx = (e - w) / 2.0;
    vec4 dy = (n - s) / 2.0;

    // velocity field divergence
    float div = dx.x + dy.y;

    // mass conservation, Euler method step
    color.z -= dt * (dx.z * color.x + dy.z * color.y + div * color.z);

    // semi-Langrangian advection
    color.xyw = T(p - dt * color.xy).xyw;

    // viscosity/diffusion
    color.xyw += dt * vec3(nu, nu, kappa) * laplacian.xyw;

    // nullify divergence with pressure field gradient
    color.xy -= K * vec2(dx.z, dy.z);

    // external source
    vec2 m = mouse.xy * resolution.xy;
    color.xyw += dt * exp(-length2(p - m) / strength.x) * vec3(p - m + (velocity.xy * strength.y), 1);

    // dissipation
    color.w -= dt * 0.0005;

    color.xyzw = clamp(color.xyzw, vec4(-5, -5, 0.5, 0), vec4(5, 5, 3, 5));

    gl_FragColor = color;
}
