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
        this.alpha = 0.15;
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
            self.current = self.container.scrollTop;
            const delta = self.current - self.last;
            self.last += delta * self.alpha;
            self.last = Math.floor(100 * self.last) / 100;
            self.object.css({ y: -self.last, skewY: delta / window.innerHeight * 10 });
        }
    }
}

export { ScrollWarp };
