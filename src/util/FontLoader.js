/**
 * Font loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events';
import { Component } from './Component';
import { Stage } from '../view/Stage';

class FontLoader extends Component {

    constructor(fonts, callback) {
        super();
        const self = this;
        this.events = new Events();
        let element;

        initFonts();
        finish();

        function initFonts() {
            if (!Array.isArray(fonts)) fonts = [fonts];
            element = Stage.create('FontLoader');
            for (let i = 0; i < fonts.length; i++) element.create('font').fontStyle(fonts[i], 12, '#000').text('LOAD').css({ top: -999 });
        }

        function finish() {
            const ready = () => {
                element.destroy();
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
