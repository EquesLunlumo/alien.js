/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events, Stage, Interface, SVG, Utils, AssetLoader, TweenManager } from '../alien.js/src/Alien.js';

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
            alienkitty = svg.initClass(SVG, '.alienkitty', 'image').size(90, 86);
            eyelid1 = svg.initClass(SVG, '.eyelid1', 'image').size(24, 14).attr({ x: 35, y: 25 }).transformPoint('50%', 0).transform({ scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = svg.initClass(SVG, '.eyelid2', 'image').size(24, 14).attr({ x: 53, y: 26 }).transformPoint(0, 0).transform({ scaleX: 1, scaleY: 0.01 });
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
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            TweenManager.tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                TweenManager.tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            TweenManager.tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                TweenManager.tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function loop() {
            eyelid1.transform();
            eyelid2.transform();
        }

        this.animateIn = () => {
            blink();
            this.tween({ opacity: 1 }, 500, 'easeOutQuart');
            this.startRender(loop);
        };

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 500, 'easeInOutQuad', () => {
                this.stopRender(loop);
                this.clearTimers();
                if (callback) callback();
            });
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
            circle = svg.initClass(SVG, '.circle', 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.css('stroke', Config.UI_COLOR);
            circle.css('stroke-width', '1.5px');
            circle.css('stroke-dasharray', `0,${length}`);
            circle.css('stroke-dashoffset', -length * offset);
        }

        function loop() {
            const dash = length * data.length;
            circle.css('stroke-dasharray', `${dash},${length - dash}`);
            circle.css('stroke-dashoffset', -length * (data.start + offset));
        }

        this.animateIn = () => {
            if (this.animatedIn) return;
            this.animatedIn = true;
            const start = () => {
                TweenManager.tween(data, { length: 1 }, 1000, 'easeOutCubic', () => {
                    TweenManager.tween(data, { start: 1 }, 1000, 'easeInOutCubic', () => {
                        data.start = 0;
                        this.delayedCall(() => {
                            if (this.animatedIn) start();
                            else this.stopRender(loop);
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
            circle = svg.initClass(SVG, '.circle', 'circle');
            circle.attr('fill', 'none');
            circle.attr('cx', size / 2);
            circle.attr('cy', size / 2);
            circle.attr('r', radius);
            circle.css('stroke', Config.UI_COLOR);
            circle.css('stroke-width', '1.5px');
            circle.css('stroke-dasharray', `0,${length}`);
            circle.css('stroke-dashoffset', -length * offset);
        }

        function loop() {
            if (self.complete) return;
            if (self.progress >= 1) complete();
            const dash = length * self.progress;
            circle.css('stroke-dasharray', `${dash},${length - dash}`);
        }

        function complete() {
            self.complete = true;
            self.events.fire(Events.COMPLETE);
            self.stopRender(loop);
        }

        this.update = e => {
            if (this.complete) return;
            TweenManager.tween(this, { progress: e.percent }, 500, 'easeOutCubic');
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
        let loader, progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.size('100%');
        }

        function initLoader() {
            loader = self.initClass(AssetLoader, Config.ASSETS);
            self.events.add(loader, Events.PROGRESS, loadUpdate);
        }

        function initProgress() {
            //progress = self.initClass(ProgressIndeterminate);
            progress = self.initClass(Progress);
            progress.center();
            if (progress.animateIn) progress.animateIn();
            self.events.add(progress, Events.COMPLETE, loadComplete);
        }

        function loadUpdate(e) {
            if (progress.update) progress.update(e);
        }

        function loadComplete() {
            self.events.fire(Events.COMPLETE);
        }

        this.animateOut = callback => {
            progress.animateOut(callback);
        };
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
