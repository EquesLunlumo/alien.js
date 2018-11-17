import { timestamp, uglify } from 'rollup-plugin-bundleutils';

import resolve from 'rollup-plugin-node-resolve';
import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import replace from 'replace';

import { version } from './node_modules/alien.js/package.json';

replace({
    regex: `"assets/js/.*\.js.*"`,
    replacement: `"assets/js/app.js?v=${Date.now()}"`,
    paths: ['public/index.html'],
    recursive: false,
    silent: true
});

export default {
    input: 'src/Main.js',
    output: {
        file: 'public/assets/js/app.js',
        format: 'es'
    },
    plugins: [
        resolve(),
        glslify({ basedir: 'src/shaders' }),
        eslint(),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            }
        })
    ]
};
