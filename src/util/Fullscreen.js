/**
 * Fullscreen controller.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events.js';
import { Component } from './Component.js';

class Fullscreen extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new Fullscreen();
        return this.singleton;
    }

    constructor() {
        super();
        const self = this;

        this.opened = false;

        addListeners();

        function addListeners() {
            [
                'onfullscreenchange',
                'onwebkitfullscreenchange',
                'onmozfullscreenchange',
                'onmsfullscreenchange',
                'onfullscreenerror',
                'onwebkitfullscreenerror',
                'onmozfullscreenerror',
                'onmsfullscreenerror'
            ].forEach(event => {
                if (typeof document[event] !== 'undefined') document[event] = update;
            });
        }

        function update() {
            const opened = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            if (opened === self.opened) return;
            self.opened = opened;
            Events.emitter.fire(Events.FULLSCREEN, { fullscreen: self.opened });
        }

        this.open = element => {
            element = element || document.body;
            [
                'requestFullscreen',
                'webkitRequestFullscreen',
                'mozRequestFullScreen',
                'msRequestFullscreen'
            ].every(method => {
                if (typeof element[method] === 'undefined') return true;
                element[method]();
            });
        };

        this.close = () => {
            [
                'exitFullscreen',
                'webkitExitFullscreen',
                'mozCancelFullScreen',
                'msExitFullscreen'
            ].every(method => {
                if (typeof document[method] === 'undefined') return true;
                document[method]();
            });
        };

        this.destroy = () => {
            this.close();
            return super.destroy();
        };
    }
}

export { Fullscreen };
