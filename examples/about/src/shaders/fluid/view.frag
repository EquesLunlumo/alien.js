// Based on https://www.shadertoy.com/view/XlsBDf by davidar

uniform float time;
uniform int frame;
uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D texture;

#define PI 3.141592653589793

void main() {
    vec4 c = texture2D(texture, gl_FragCoord.xy / resolution.xy);

    // velocity
    gl_FragColor.rgb = 0.6 + 0.6 * cos(6.3 * atan(c.y, c.x) / (2.0 * PI) + vec3(0, 23, 21));

    // ink
    gl_FragColor.rgb *= c.w / 5.0;

    // local fluid density
    gl_FragColor.rgb += clamp(c.z - 1.0, 0.0, 1.0) / 10.0;
    gl_FragColor.a = 1.0;
}
