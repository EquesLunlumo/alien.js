/**
 * Scroll lock controller.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Component } from './Component.js';

class ScrollLock extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new ScrollLock();
        return this.singleton;
    }

    constructor() {
        super();

        this.locked = 0;

        function preventDefault(e) {
            e.preventDefault();
        }

        this.lock = () => {
            if (!this.locked) {
                document.body.style.overflow = 'hidden';
                document.body.addEventListener('touchmove', preventDefault, { passive: false });
            }
            this.locked++;
        };

        this.unlock = () => {
            this.locked--;
            if (!this.locked) {
                document.body.style.overflow = '';
                document.body.removeEventListener('touchmove', preventDefault, { passive: false });
            }
        };

        this.destroy = () => {
            document.body.removeEventListener('touchmove', preventDefault, { passive: false });
            return super.destroy();
        };
    }
}

export { ScrollLock };
