import glslify from 'rollup-plugin-glslify';

export default {
    input: 'src/shaders.js',
    output: {
        file: 'public/assets/js/shaders.js',
        format: 'es'
    },
    plugins: [
        glslify({ basedir: 'src/shaders' })
    ]
};
