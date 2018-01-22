/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events, Stage, Interface, Utils, AssetLoader } from '../alien.js/src/Alien';

Config.ASSETS = [
    'assets/alienkitty.svg',
    'assets/alienkitty_eyelid.svg'
];

class Main extends Interface {

    constructor() {
        super();
        const self = this;
        this.playing = false;
        let loader, wrapper, alienkitty, eyelid1, eyelid2;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size(300, 250).enable3D(2000);
            wrapper = Stage.create('.wrapper');
            wrapper.size(90, 86).center().transform({ z: -300 }).enable3D();
            alienkitty = wrapper.create('.alienkitty').size(90, 86).css({ opacity: 0 });
            eyelid1 = alienkitty.create('.eyelid1').size(24, 14).css({ left: 35, top: 25 }).transformPoint('50%', 0).transform({ scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = alienkitty.create('.eyelid2').size(24, 14).css({ left: 53, top: 26 }).transformPoint(0, 0).transform({ scaleX: 1, scaleY: 0.01 });
            Stage.url = window.clickTag;
            Stage.interact(hover, click);
        }

        function hover(e) {
            if (!self.loaded) return;
            if (e.action === 'over') wrapper.tween({ z: 50 }, 100, 'easeOutCubic');
            else wrapper.tween({ z: 0 }, 300, 'easeOutCubic');
        }

        function click(e) {
            getURL(e.object.url);
        }

        function initLoader() {
            loader = self.initClass(AssetLoader, Config.ASSETS);
            self.events.add(loader, Events.COMPLETE, loadComplete);
        }

        function loadComplete() {
            alienkitty.bg('assets/alienkitty.svg');
            eyelid1.bg('assets/alienkitty_eyelid.svg');
            eyelid2.bg('assets/alienkitty_eyelid.svg');
            self.events.fire(Events.COMPLETE);
        }

        function addListeners() {
            self.events.add(Events.COMPLETE, complete);
        }

        function complete() {
            self.playing = true;
            wrapper.tween({ z: 0 }, 7000, 'easeOutCubic');
            alienkitty.tween({ opacity: 1 }, 500, 'easeOutQuart');
            blink();
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
    }
}

new Main();
