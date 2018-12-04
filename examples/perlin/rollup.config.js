import { timestamp, regex, uglify } from 'rollup-plugin-bundleutils';

import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import replace from 'replace';

import { version } from './alien.js/package.json';

replace({
    regex: `"assets/js/.*\.js.*"`,
    replacement: `"assets/js/app.js?v=${Date.now()}"`,
    paths: ['public/index.html'],
    recursive: false,
    silent: true
});

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
        file: 'public/assets/js/app.js',
        format: 'es'
    },
    plugins: [
        glslify({ basedir: 'src/shaders' }),
        eslint({ include: 'src/**' }),
        regex([[/^import.*[\r\n]+/m, '']]), // strip imports leftover from externals
        uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            }
        })
    ]
};
