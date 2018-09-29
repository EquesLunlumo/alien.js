/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events.js';
import { Component } from './Component.js';

class FontLoader extends Component {

    constructor(fonts, callback) {

        fonts = fonts.map(font => {
            if (typeof font !== 'object') return {
                style: 'normal',
                variant: 'normal',
                weight: 'normal',
                font: font.replace(/"/g, '\'')
            };
            return font;
        });

        super();
        const self = this;
        let context;

        initFonts();

        function initFonts() {
            context = document.createElement('canvas').getContext('2d');
            fonts.forEach(font => renderText(font));
            finish();
        }

        function renderText({ style = 'normal', variant = 'normal', weight = 'normal', font }) {
            context.font = `${style} ${variant} ${weight} 12px "${font}"`;
            context.fillText('LOAD', 0, 0);
        }

        function finish() {
            const ready = () => {
                self.percent = 1;
                self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
                self.events.fire(Events.COMPLETE, null, true);
                if (callback) callback();
            };
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
            else self.delayedCall(ready, 500);
        }
    }

    static loadFonts(fonts, callback) {
        const promise = Promise.create();
        if (!callback) callback = promise.resolve;
        promise.loader = new FontLoader(fonts, callback);
        return promise;
    }
}

export { FontLoader };
