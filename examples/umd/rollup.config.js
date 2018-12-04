import { regex } from 'rollup-plugin-bundleutils';

import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

export default {
    input: 'src/Main.js',
    external(id) {
        return /^three$/.test(id);
    },
    onwarn(warning, warn) {
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
    },
    output: {
        file: 'public/assets/js/lib/project.js',
        format: 'umd',
        name: 'Project',
        globals: { three: 'THREE' }
    },
    plugins: [
        glslify({ basedir: 'src/shaders' }),
        eslint({ include: 'src/**' }),
        regex([[/^import.*[\r\n]+/m, '']]) // strip imports leftover from externals
    ]
};
