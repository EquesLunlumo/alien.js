import { timestamp, regex, babel, uglify } from 'rollup-plugin-bundleutils';

import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import glslify from 'rollup-plugin-glslify';
import { eslint } from 'rollup-plugin-eslint';

import path from 'path';

import { version } from './alien.js/package.json';

const project = path.basename(__dirname);

export default {
    input: 'src/Main.js',
    external: id => /\/gsap\//.test(id),
    output: {
        file: `public/assets/${project}.js`,
        format: 'es'
    },
    plugins: [
        resolve(),
        replace({
            'three': '/* global THREE */',
            delimiters: ['import * as THREE from \'', '\';']
        }),
        glslify({ basedir: 'src/shaders' }),
        eslint({ include: ['src/**', 'alien.js/**'], exclude: ['src/gsap/**', 'alien.js/src/gsap/**'] }),
        regex([[/^import.*[\r\n]+/m, '']]), // strip imports leftover from externals
        babel({ compact: false }),
        uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]}.${project} ${timestamp()}\n//  /_|///_'/ /`
            }
        })
    ]
};
