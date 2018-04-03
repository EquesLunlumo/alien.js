#pragma glslify: range = require('../range/range')
#pragma glslify: levels = require('../util/levels')

float animateLevels(vec4 maskColor, float t) {
    float inBlack = 0.0;
    float inGamma = range(t, 0.0, 1.0, 0.0, 3.0);
    float inWhite = range(t, 0.0, 1.0, 20.0, 255.0);
    float outBlack = 0.0;
    float outWhite = 255.0;

    float mask = 1.0 - levels(maskColor.rgb, inBlack, inGamma, inWhite, outBlack, outWhite).r;
    mask = max(0.0, min(1.0, mask));
    return mask;
}

#pragma glslify: export(animateLevels)
