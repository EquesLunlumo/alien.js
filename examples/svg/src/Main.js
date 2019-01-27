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
            radius = size * 0.4;
        let svg, circle, icon, line1, line2;

        initHTML();
        initSVG();
        initCircle();
        initIcon();

        function initHTML() {
            self.size(size);
        }

        function initSVG() {
            svg = self.initClass(SVG);
            svg.size(size);
        }

        function initCircle() {
            circle = svg.initClass(SVG, 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.attr('stroke', Config.UI_COLOR);
            circle.attr('stroke-width', 1.5);
            circle.line(-0.25);
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
            line1.line();
            line2 = icon.initClass(SVG, 'line');
            line2.attr('x1', 22);
            line2.attr('y1', 0);
            line2.attr('x2', 0);
            line2.attr('y2', 22);
            line2.line();
        }

        this.animateIn = () => {
            if (this.animatedIn) return;
            this.animatedIn = true;
            tween(circle, { length: 1 }, 1000, 'easeOutCubic', () => {
                tween(line1, { length: 1 }, 400, 'easeOutCubic', () => {
                    tween(line2, { length: 1 }, 400, 'easeOutCubic', () => {
                        this.animatedIn = false;
                    });
                });
            });
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
            radius = size * 0.4;
        let svg, circle;

        initHTML();
        initSVG();
        initCircle();

        function initHTML() {
            self.size(size);
        }

        function initSVG() {
            svg = self.initClass(SVG);
            svg.size(size);
        }

        function initCircle() {
            circle = svg.initClass(SVG, 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.attr('stroke', Config.UI_COLOR);
            circle.attr('stroke-width', 1.5);
            circle.line(-0.25);
        }

        this.animateIn = () => {
            if (this.animatedIn) return;
            this.animatedIn = true;
            const start = () => {
                tween(circle, { length: 1 }, 1000, 'easeOutCubic', () => {
                    tween(circle, { start: 1 }, 1000, 'easeInOutCubic', () => {
                        circle.start = 0;
                        this.delayedCall(() => {
                            if (this.animatedIn) start();
                            else this.animatedIn = false;
                        }, 500);
                    }, () => {
                        circle.length = 1 - circle.start;
                    });
                });
            };
            start();
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
            radius = size * 0.4;
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
            svg = self.initClass(SVG);
            svg.size(size);
        }

        function initCircle() {
            circle = svg.initClass(SVG, 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.attr('stroke', Config.UI_COLOR);
            circle.attr('stroke-width', 1.5);
            circle.line(-0.25);
        }

        function loop() {
            if (self.complete) return;
            if (self.progress >= 1) complete();
            circle.length = self.progress;
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
