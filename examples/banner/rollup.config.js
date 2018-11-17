import { timestamp, babel, uglify } from 'rollup-plugin-bundleutils';

import resolve from 'rollup-plugin-node-resolve';
import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import path from 'path';
import replace from 'replace';

import { version } from './alien.js/package.json';

const project = path.basename(__dirname);

replace({
    regex: `"assets/.*\.js.*"`,
    replacement: `"assets/${project}.js?v=${Date.now()}"`,
    paths: ['public/index.html'],
    recursive: false,
    silent: true
});

export default {
    input: 'src/Main.js',
    output: {
        file: `public/assets/${project}.js`,
        format: 'es'
    },
    plugins: [
        resolve(),
        glslify({ basedir: 'src/shaders' }),
        eslint(),
        babel(),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]}.${project} ${timestamp()}\n//  /_|///_'/ /`
            }
        })
    ]
};
