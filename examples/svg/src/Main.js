/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events, Stage, Interface, SVG, Utils, AssetLoader } from '../alien.js/src/Alien.js';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

class AlienKitty extends Interface {

    constructor() {
        super('AlienKitty');
        const self = this;
        let svg, alienkitty, eyelid1, eyelid2;

        initHTML();
        initSVG();
        initAlienKitty();
        addListeners();

        function initHTML() {
            self.size(90, 86).css({ opacity: 0 });
        }

        function initSVG() {
            svg = self.initClass(SVG).size(90, 86);
        }

        function initAlienKitty() {
            alienkitty = svg.initClass(SVG, 'image').size(90, 86);
            eyelid1 = svg.initClass(SVG, 'image').size(24, 14).attr({ x: 35, y: 25 }).transformPoint('50%', 0).transform({ scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = svg.initClass(SVG, 'image').size(24, 14).attr({ x: 53, y: 26 }).transformPoint(0, 0).transform({ scaleX: 1, scaleY: 0.01 });
        }

        function addListeners() {
            self.events.add(Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            alienkitty.attr('href', 'assets/images/alienkitty.svg');
            eyelid1.attr('href', 'assets/images/alienkitty_eyelid.svg');
            eyelid2.attr('href', 'assets/images/alienkitty_eyelid.svg');
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            eyelid1.tween({ scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                eyelid1.tween({ scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            eyelid2.tween({ scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                eyelid2.tween({ scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        this.animateIn = () => {
            blink();
            this.tween({ opacity: 1 }, 500, 'easeOutQuart');
        };

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 500, 'easeInOutQuad', () => {
                this.clearTimers();
                if (callback) callback();
            });
        };
    }
}

class ProgressClose extends Interface {

    constructor() {
        super('.ProgressClose');
        const self = this;
        const size = 90,
            radius = size * 0.4,
            length = Math.PI * radius * 2,
            offset = -0.25,
            data = {
                start: 0,
                length: 0,
                line1Length: 0,
                line2Length: 0
            };
        let svg, circle, icon, line1, line2;

        initHTML();
        initSVG();
        initCircle();
        initIcon();

        function initHTML() {
            self.size(size);
        }

        function initSVG() {
            svg = self.initClass(SVG).size(size);
        }

        function initCircle() {
            circle = svg.initClass(SVG, 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.attr('stroke', Config.UI_COLOR);
            circle.attr('stroke-width', 1.5);
            circle.attr('stroke-dasharray', `0,${length}`);
            circle.attr('stroke-dashoffset', -length * offset);
        }

        function initIcon() {
            icon = svg.initClass(SVG, 'g');
            icon.attr('transform', `translate(${(size - 22) / 2}, ${(size - 22) / 2})`);
            icon.attr('fill', 'none');
            icon.attr('stroke', Config.UI_COLOR);
            icon.attr('stroke-width', 1.5);
            line1 = icon.initClass(SVG, 'line');
            line1.attr('x1', 0);
            line1.attr('y1', 0);
            line1.attr('x2', 22);
            line1.attr('y2', 22);
            line1.attr('stroke-dasharray', `0,${line1.element.getTotalLength()}`);
            line2 = icon.initClass(SVG, 'line');
            line2.attr('x1', 22);
            line2.attr('y1', 0);
            line2.attr('x2', 0);
            line2.attr('y2', 22);
            line2.attr('stroke-dasharray', `0,${line2.element.getTotalLength()}`);
        }

        function loop() {
            let dash = length * data.length;
            dash = Math.round(dash * 100) / 100;
            let gap = length - dash;
            gap = Math.round(gap * 100) / 100;
            let dashoffset = -length * (data.start + offset);
            dashoffset = Math.round(dashoffset * 100) / 100;
            circle.attr('stroke-dasharray', `${dash},${gap}`);
            circle.attr('stroke-dashoffset', dashoffset);
            line1.attr('stroke-dasharray', `${line1.element.getTotalLength() * data.line1Length},${line1.element.getTotalLength() - line1.element.getTotalLength() * data.line1Length}`);
            line2.attr('stroke-dasharray', `${line2.element.getTotalLength() * data.line2Length},${line2.element.getTotalLength() - line2.element.getTotalLength() * data.line2Length}`);
        }

        this.animateIn = () => {
            if (this.animatedIn) return;
            this.animatedIn = true;
            tween(data, { length: 1 }, 1000, 'easeOutCubic', () => {
                tween(data, { line1Length: 1 }, 400, 'easeOutCubic', () => {
                    tween(data, { line2Length: 1 }, 400, 'easeOutCubic', () => {
                        this.stopRender(loop);
                        this.animatedIn = false;
                    });
                });
            });
            this.startRender(loop);
        };

        this.animateOut = callback => {
            this.animatedIn = false;
            if (callback) callback();
        };
    }
}

class ProgressIndeterminate extends Interface {

    constructor() {
        super('.ProgressIndeterminate');
        const self = this;
        const size = 90,
            radius = size * 0.4,
            length = Math.PI * radius * 2,
            offset = -0.25,
            data = {
                start: 0,
                length: 0
            };
        let svg, circle;

        initHTML();
        initSVG();
        initCircle();

        function initHTML() {
            self.size(size);
        }

        function initSVG() {
            svg = self.initClass(SVG).size(size);
        }

        function initCircle() {
            circle = svg.initClass(SVG, 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.attr('stroke', Config.UI_COLOR);
            circle.attr('stroke-width', 1.5);
            circle.attr('stroke-dasharray', `0,${length}`);
            circle.attr('stroke-dashoffset', -length * offset);
        }

        function loop() {
            const dash = length * data.length;
            circle.attr('stroke-dasharray', `${dash},${length - dash}`);
            circle.attr('stroke-dashoffset', -length * (data.start + offset));
        }

        this.animateIn = () => {
            if (this.animatedIn) return;
            this.animatedIn = true;
            const start = () => {
                tween(data, { length: 1 }, 1000, 'easeOutCubic', () => {
                    tween(data, { start: 1 }, 1000, 'easeInOutCubic', () => {
                        data.start = 0;
                        this.delayedCall(() => {
                            if (this.animatedIn) {
                                start();
                            } else {
                                this.stopRender(loop);
                                this.animatedIn = false;
                            }
                        }, 500);
                    }, () => {
                        data.length = 1 - data.start;
                    });
                });
            };
            start();
            this.startRender(loop);
        };

        this.animateOut = callback => {
            this.animatedIn = false;
            if (callback) callback();
        };
    }
}

class Progress extends Interface {

    constructor() {
        super('Progress');
        const self = this;
        const size = 90,
            radius = size * 0.4,
            length = Math.PI * radius * 2,
            offset = -0.25;
        let svg, circle;

        this.progress = 0;

        initHTML();
        initSVG();
        initCircle();
        this.startRender(loop);

        function initHTML() {
            self.size(size);
        }

        function initSVG() {
            svg = self.initClass(SVG).size(size);
        }

        function initCircle() {
            circle = svg.initClass(SVG, 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.attr('stroke', Config.UI_COLOR);
            circle.attr('stroke-width', 1.5);
            circle.attr('stroke-dasharray', `0,${length}`);
            circle.attr('stroke-dashoffset', -length * offset);
        }

        function loop() {
            if (self.complete) return;
            if (self.progress >= 1) complete();
            const dash = length * self.progress;
            circle.attr('stroke-dasharray', `${dash},${length - dash}`);
        }

        function complete() {
            self.complete = true;
            self.events.fire(Events.COMPLETE);
            self.stopRender(loop);
        }

        this.update = e => {
            if (this.complete) return;
            tween(this, { progress: e.percent }, 500, 'easeOutCubic');
        };

        this.animateOut = callback => {
            this.tween({ scale: 0.9, opacity: 0 }, 400, 'easeInCubic', callback);
        };
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        const self = this;
        let view;

        initHTML();
        initView();
        initLoader();

        function initHTML() {
            self.css({ position: 'static' });
        }

        function initView() {
            //view = self.initClass(ProgressClose);
            //view = self.initClass(ProgressIndeterminate);
            view = self.initClass(Progress);
            view.center();
            if (view.animateIn) view.animateIn();
        }

        function initLoader() {
            const loader = self.initClass(AssetLoader, Config.ASSETS);
            if (view.update) self.events.add(loader, Events.PROGRESS, view.update);
            self.events.bubble(view, Events.COMPLETE);
        }

        this.animateOut = view.animateOut;
    }
}

class Main {

    constructor() {
        let loader, wrapper, alienkitty;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%').enable3D(2000);
            wrapper = Stage.create('.wrapper');
            wrapper.size('100%').transform({ z: -300 }).enable3D();
            alienkitty = wrapper.initClass(AlienKitty);
            alienkitty.center();
        }

        function initLoader() {
            loader = Stage.initClass(Loader);
            Stage.events.add(loader, Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            loader.animateOut(() => {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            wrapper.tween({ z: 0 }, 7000, 'easeOutCubic');
            alienkitty.animateIn();
        }
    }
}

new Main();
