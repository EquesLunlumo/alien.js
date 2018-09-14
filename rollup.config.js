import { timestamp, unexport, uglify } from 'rollup-plugin-bundleutils';

const pkg = require('./package.json');

export default {
    input: 'src/Alien.js',
    output: [{
        name: 'Alien',
        file: process.env.uglify ? 'build/alien.module.min.js' : 'build/alien.module.js',
        format: 'umd'
    }, {
        file: process.env.uglify ? 'build/alien.min.js' : 'build/alien.js',
        format: 'es'
    }],
    plugins: [
        unexport(),
        process.env.uglify ? uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            }
        }) : {}
    ]
};
