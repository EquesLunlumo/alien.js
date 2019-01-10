import replace from 'rollup-plugin-replace';
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
        replace({
            'three': '/* global THREE */',
            delimiters: ['import * as THREE from \'', '\';']
        }),
        glslify({ basedir: 'src/shaders' }),
        eslint({ include: ['src/**', 'alien.js/**'], exclude: 'alien.js/src/gsap/**' })
    ]
};
