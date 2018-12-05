import { timestamp, uglify } from 'rollup-plugin-bundleutils';

import replace from 'rollup-plugin-replace';

import { version } from './package.json';

export default {
    input: 'src/Alien.js',
    output: [{
        file: process.env.uglify ? 'build/alien.min.js' : 'build/alien.js',
        format: 'es'
    }],
    plugins: [
        replace({
            'three': '/* global THREE */',
            delimiters: ['import * as THREE from \'', '\';']
        }),
        process.env.uglify ? uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            },
            safari10: true
        }) : {}
    ]
};
