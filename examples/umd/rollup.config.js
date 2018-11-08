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
        eslint()
    ]
};
