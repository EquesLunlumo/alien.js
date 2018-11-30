import { timestamp, regex, uglify } from 'rollup-plugin-bundleutils';

import { version } from './package.json';

export default {
    input: 'src/Alien.js',
    output: [{
        file: process.env.uglify ? 'build/alien.min.js' : 'build/alien.js',
        format: 'es'
    }],
    plugins: [
        regex([[/^import.*[\r\n]+/m, '']]), // strip imports leftover from externals
        process.env.uglify ? uglify({
            output: {
                preamble: `//   _  /._  _  r${version.split('.')[1]} ${timestamp()}\n//  /_|///_'/ /`
            },
            safari10: true
        }) : {}
    ],
    external: id => /^three$/.test(id)
};
