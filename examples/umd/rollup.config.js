import { regex } from 'rollup-plugin-bundleutils';

import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

export default {
    input: 'src/Main.js',
    output: {
        file: 'public/assets/js/lib/project.js',
        format: 'umd',
        name: 'Project'
    },
    plugins: [
        glslify({ basedir: 'src/shaders' }),
        eslint({ include: 'src/**' }),
        regex([[/^import.*[\r\n]+/m, '']]) // strip imports leftover from externals
    ],
    external: id => /^three$/.test(id)
};
