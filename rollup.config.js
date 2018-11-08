import { timestamp, uglify } from 'rollup-plugin-bundleutils';

const pkg = require('./package.json');

export default {
    input: 'src/Alien.js',
    output: [{
        file: process.env.uglify ? 'build/alien.min.js' : 'build/alien.js',
        format: 'es'
    }],
    plugins: [
        process.env.uglify ? uglify({
            output: {
                preamble: `//   _  /._  _  r${pkg.version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            },
            safari10: true
        }) : {}
    ]
};
