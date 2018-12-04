/**
 * Scroll warp interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { TweenMax } from '../gsap/TweenMax.js';

class ScrollWarp extends Component {

    constructor(object, container) {
        super();
        const self = this;

        this.current = 0;
        this.last = 0;
        this.alpha = 0.15;
        this.enabled = true;

        initParameters();
        addListeners();
        this.startRender(loop);

        function initParameters() {
            self.object = object;
            self.container = container || document.body;
            self.object.willChange('transform');
        }

        function addListeners() {
            window.addEventListener('scroll', scroll);
            self.events.add(Events.RESIZE, resize);
            defer(resize);
        }

        function setHeight() {
            const height = self.object.element.getBoundingClientRect().height;
            TweenMax.set(self.container, { height });
        }

        function scroll() {
            if (!self.enabled) return;
            self.current = window.scrollY;
        }

        function resize() {
            if (!self.enabled) return;
            setHeight();
        }

        function loop() {
            if (!self.enabled) return;
            const delta = self.current - self.last;
            self.last += delta * self.alpha;
            self.last = Math.floor(100 * self.last) / 100;
            TweenMax.set(self.object.element, { y: -self.last, skewY: delta / window.innerHeight * 10 });
        }

        this.destroy = () => {
            window.removeEventListener('scroll', scroll);
            return super.destroy();
        };
    }
}

export { ScrollWarp };
