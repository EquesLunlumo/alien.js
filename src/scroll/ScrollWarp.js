/**
 * Scroll warp interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Interface } from '../util/Interface.js';

class ScrollWarp extends Component {

    constructor(object, container) {
        super();
        const self = this;

        this.current = 0;
        this.last = 0;
        this.delta = 0;
        this.ease = 0.15;
        this.enabled = true;

        initParameters();
        addListeners();
        this.startRender(loop);

        function initParameters() {
            self.object = object;
            self.object.willChange('transform');
            self.container = container ? container.parent.element : document.scrollingElement || document.documentElement;
            self.inner = container || new Interface(document.body);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            defer(resize);
        }

        function resize() {
            if (!self.enabled) return;
            const height = self.object.element.getBoundingClientRect().height;
            self.inner.css({ height });
        }

        function loop() {
            if (!self.enabled) return;
            self.current += (self.container.scrollTop - self.current) * self.ease;
            self.delta = self.current - self.last;
            self.last = self.current;
            self.object.css({ y: -self.current.toFixed(), skewY: self.delta / window.innerHeight * 10 });
        }
    }
}

export { ScrollWarp };
