import { timestamp, uglify } from 'rollup-plugin-bundleutils';

import { version } from './package.json';

export default {
    input: 'src/Alien.js',
    output: [{
        file: process.env.uglify ? 'build/alien.min.js' : 'build/alien.js',
        format: 'es'
    }],
    plugins: [
        process.env.uglify ? uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            },
            safari10: true
        }) : {}
    ]
};
