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
                family: font.replace(/"/g, '\'')
            };
            return font;
        });

        super();
        const self = this;
        let context,
            loaded = 0;

        initFonts();

        function initFonts() {
            context = document.createElement('canvas').getContext('2d');
            fonts.forEach(font => {
                font.specifier = (({ style = 'normal', variant = 'normal', weight = 'normal', family }) => {
                    return `${style} ${variant} ${weight} 12px "${family}"`;
                })(font);
            });
            if (document.fonts) {
                fonts.forEach(font => {
                    document.fonts.load(font.specifier).then(() => {
                        renderText(font.specifier);
                        fontLoaded();
                    }).catch(() => {
                        fontLoaded();
                    });
                });
            } else {
                fonts.forEach(font => renderText(font.specifier));
                self.delayedCall(() => {
                    self.percent = 1;
                    self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
                    self.events.fire(Events.COMPLETE, null, true);
                    if (callback) callback();
                }, 500);
            }
        }

        function renderText(specifier) {
            context.font = specifier;
            context.fillText('LOAD', 0, 0);
        }

        function fontLoaded() {
            self.percent = ++loaded / fonts.length;
            self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
            if (loaded === fonts.length) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE, null, true);
            if (callback) callback();
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
