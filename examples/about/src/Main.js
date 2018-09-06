/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Timer, Events, Stage, Interface, Component, Canvas, CanvasGraphics, Device, Interaction, Mouse, Accelerometer, Utils,
    Assets, AssetLoader, FontLoader, StateDispatcher, TweenManager, Interpolation, Storage, Vector2, WebAudio, Shader } from '../alien.js/src/Alien.js';

import vertFluidBasic from './shaders/fluid/basic.vert';
import fragFluidPass from './shaders/fluid/pass.frag';
import fragFluidView from './shaders/fluid/view.frag';

Config.UI_COLOR = 'white';
Config.UI_OFFSET = Device.phone ? 10 : 20;
Config.NAV_WIDTH = 320;
Config.ABOUT_COPY = 'Future web framework.';
Config.ABOUT_HYDRA_URL = 'https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e';
Config.ABOUT_GITHUB_URL = 'https://github.com/pschroen/alien.js';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/sounds/bass_drum.mp3',
    'assets/sounds/deep_spacy_loop.mp3',
    'assets/sounds/water_loop.mp3'
];
Config.EXAMPLES = [];

Global.EXAMPLE_INDEX = 0;
Global.SOUND = true;
Global.ABOUT_OPEN = false;

Events.START = 'start';
Events.UI_HIDE = 'ui_hide';
Events.UI_SHOW = 'ui_show';
Events.OPEN_NAV = 'open_nav';
Events.CLOSE_NAV = 'close_nav';
Events.OPEN_ABOUT = 'open_about';
Events.CLOSE_ABOUT = 'close_about';

//Assets.CDN = Config.CDN;
Assets.CORS = 'anonymous';
Assets.OPTIONS = {
    mode: 'cors',
    //credentials: 'include'
};


class Cursor {

    static clear() {
        Stage.element.className = '';
    }

    static grabbable() {
        Stage.element.className = 'grabbable';
    }

    static grabbing() {
        Stage.element.className = 'grabbing';
    }

    static pointer() {
        Stage.element.className = 'pointer';
    }
}

class Data {

    static init() {
        const self = this;

        // StateDispatcher @param {boolean} [forceHash = undefined] Force hash navigation
        this.dispatcher = Stage.initClass(StateDispatcher, true);

        setIndexes();
        addListeners();

        function setIndexes(list = Config.EXAMPLES) {
            for (let i = 0; i < list.length; i++) list[i].index = i;
        }

        function addListeners() {
            Stage.events.add(self.dispatcher, Events.UPDATE, stateChange);
        }

        function stateChange(e) {
            self.setExample(e.path);
        }

        function find(path, list) {
            for (let i = 0; i < list.length; i++) if (list[i].path === path) return list[i];
            return null;
        }

        this.getExample = path => {
            return find(path, Config.EXAMPLES);
        };

        this.setExample = path => {
            const item = this.getExample(path);
            if (item) {
                Global.EXAMPLE_INDEX = item.index;
                Stage.events.fire(Events.CLOSE_NAV);
                Stage.events.fire(Events.OPEN_NAV, { direction: -1, item });
            }
        };

        this.getNext = () => {
            Global.EXAMPLE_INDEX++;
            if (Global.EXAMPLE_INDEX > Config.EXAMPLES.length - 1) Global.EXAMPLE_INDEX = 0;
            let item = Config.EXAMPLES[Global.EXAMPLE_INDEX];
            while (!(item.slug || item.path === '')) {
                Global.EXAMPLE_INDEX++;
                if (Global.EXAMPLE_INDEX > Config.EXAMPLES.length - 1) Global.EXAMPLE_INDEX = 0;
                item = Config.EXAMPLES[Global.EXAMPLE_INDEX];
            }
            return item;
        };
    }
}

class ExampleLoader extends Component {

    constructor(item) {
        super();
        const self = this;

        initLoader();

        function initLoader() {
            window.get(`https://rawgit.com/pschroen/alien.js/master/${item.path}dist/assets/js/${item.slug}.js?${Utils.timestamp()}`).then(data => {
                window.eval(`(function(){${data.replace('new Main;', `Global.EXAMPLE=Stage;Global.STAGE.add(Stage);Global.STAGE.element.insertBefore(Stage.element, Global.STAGE.element.firstChild);Assets.CDN='https://rawgit.com/pschroen/alien.js/master/${item.path}dist/';new Main;`)}})();`);
                Global.EXAMPLE.css({ left: 0, top: 0 });
                loadComplete();
            }).catch(() => {
                loadComplete();
            });
        }

        function loadComplete() {
            self.events.fire(Events.COMPLETE);
        }
    }
}

class AudioController {

    static init() {
        const water = WebAudio.getSound('water_loop');
        let mouseSpeed = 0,
            lastEventTime = 0,
            lastMouseX = 0,
            lastMouseY = 0;

        function getMouseSpeed(xNormalized, yNormalized, easing) {
            const dist = Math.abs(xNormalized - lastMouseX) + Math.abs(yNormalized - lastMouseY),
                time = WebAudio.context.currentTime - lastEventTime;
            if (time === 0) return mouseSpeed;
            const speed = dist / time;
            mouseSpeed += speed * 0.01;
            mouseSpeed *= easing;
            lastEventTime = WebAudio.context.currentTime;
            if (Math.abs(lastMouseX - xNormalized) + Math.abs(lastMouseY - yNormalized) > 0.2) mouseSpeed = 0;
            lastMouseX = xNormalized;
            lastMouseY = yNormalized;
            return mouseSpeed;
        }

        this.updatePosition = (x = Mouse.x, y = Mouse.y) => {
            if (!WebAudio.context) return;
            const speed = getMouseSpeed(x / Stage.width, y / Stage.height, 0.96);
            this.trigger('mouse_move', speed, (((x / Stage.width) * 2) - 1) * 0.8, Math.abs(1 - (y / Stage.height)));
        };

        this.trigger = (event, ...params) => {
            switch (event) {
                case 'fluid_start':
                    WebAudio.play('water_loop', 0, true);
                    WebAudio.fadeInAndPlay('deep_spacy_loop', 0.71, true, 2000, 'linear');
                    break;
                case 'fluid_stop':
                    WebAudio.fadeOutAndStop('water_loop', 500, 'linear');
                    WebAudio.fadeOutAndStop('deep_spacy_loop', 500, 'linear');
                    break;
                case 'mouse_move':
                    if (water) {
                        TweenManager.tween(water.gain, { value: Math.clamp(params[0], 0, 1) }, 100, 'linear');
                        water.stereoPan.value = Math.clamp(params[1], -1, 1);
                        water.playbackRate.value = Math.clamp(0.8 + params[2] / 2.5, 0.8, 1.2);
                    }
                    break;
                case 'about_section':
                    TweenManager.tween(WebAudio.gain, { value: 0.3 }, 1000, 'linear');
                    break;
                case 'fluid_section':
                    TweenManager.tween(WebAudio.gain, { value: 1 }, 500, 'linear');
                    break;
                case 'sound_off':
                    TweenManager.tween(WebAudio.gain, { value: 0 }, 300, 'linear');
                    break;
                case 'sound_on':
                    TweenManager.tween(WebAudio.gain, { value: 1 }, 500, 'linear');
                    break;
            }
        };

        this.mute = () => {
            this.trigger('sound_off');
        };

        this.unmute = () => {
            this.trigger('sound_on');
        };
    }
}

class About extends Interface {

    constructor() {
        super('About');
        const self = this;
        const texts = [];
        let wrapper, alienkitty, description;

        this.alpha = 0.07;

        initHTML();
        initText();
        addListeners();

        function initHTML() {
            self.size(800, 430).center();
            wrapper = self.create('.wrapper');
            wrapper.size(600, 350).enable3D(2000);
            wrapper.rotationY = 0;
            wrapper.rotationX = 0;
            alienkitty = wrapper.initClass(AlienKitty);
            alienkitty.center().transform({ z: -20 }).css({ marginTop: -88 });
        }

        function initText() {
            description = self.create('.description');
            description.size(260, 50);
            description.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            description.css({
                left: 350,
                top: 200,
                fontWeight: '400',
                lineHeight: 11 * 1.7,
                letterSpacing: 11 * 0.03
            });
            description.text(Config.ABOUT_COPY);
            texts.push(description);
            ['Source code', 'Inspiration'].forEach((text, i) => {
                const link = self.create('.link');
                link.size('auto', 20);
                link.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
                link.css({
                    left: 350,
                    top: 240 + i * 27,
                    fontWeight: '400',
                    lineHeight: 11 * 1.7,
                    letterSpacing: 11 * 0.03,
                    textDecoration: 'underline'
                });
                link.text(text);
                link.interact(null, click);
                link.hit.mouseEnabled(true);
                link.title = text;
                texts.push(link);
            });
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            if (Stage.width < 800) {
                wrapper.transform({ x: 100 });
                texts.forEach(text => text.css({ left: 270 }));
            } else {
                wrapper.transform({ x: 0 });
                texts.forEach(text => text.css({ left: 350 }));
            }
        }

        function click(e) {
            if (Global.SOUND) AudioController.mute();
            setTimeout(() => {
                const title = e.object.title.toLowerCase();
                getURL(~title.indexOf('source') ? Config.ABOUT_GITHUB_URL : Config.ABOUT_HYDRA_URL);
            }, 300);
        }

        this.update = () => {
            if (Device.mobile) {
                wrapper.rotationY += (Accelerometer.x - wrapper.rotationY) * this.alpha;
                wrapper.rotationX += (-Accelerometer.y - wrapper.rotationX) * this.alpha;
            } else {
                wrapper.rotationY += (Math.range(Mouse.x, 0, Stage.width, -5, 5) - wrapper.rotationY) * this.alpha;
                wrapper.rotationX += (-Math.range(Mouse.y, 0, Stage.height, -10, 10) - wrapper.rotationX) * this.alpha;
            }
            wrapper.transform();
        };

        this.animateIn = () => {
            alienkitty.ready().then(alienkitty.animateIn);
            texts.forEach((text, i) => text.transform({ y: 50 }).css({ opacity: 0 }).tween({ y: 0, opacity: text.hit ? 1 : 0.75 }, 1000, 'easeOutCubic', 500 + i * 80));
        };

        this.animateOut = callback => {
            alienkitty.animateOut();
            texts.forEach((text, i) => text.tween({ y: 20, opacity: 0 }, 500, 'easeInCubic', 40 + (texts.length - i) * 40));
            this.delayedCall(callback, 1000);
        };
    }
}

class Button extends Interface {

    constructor() {
        super('Button');
        const self = this;
        const data = {
            width: 80,
            height: 60,
            radius: 24,
            posX: 52,
            scale: 1,
            littleCircleScale: 0,
            lineWidth: 0,
            multiTween: true
        };
        let canvas, mask, line, circle, littleCircle, timeout;

        this.needsUpdate = false;

        initHTML();
        initCanvas();
        initLine();
        initCircle();
        initLittleCircle();

        function initHTML() {
            self.size(data.width, data.height);
            self.css({
                top: Config.UI_OFFSET + 6,
                right: Config.UI_OFFSET + 6,
                opacity: 0
            });
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, data.width, data.height, true, true);
        }

        function initLine() {
            mask = self.initClass(CanvasGraphics);
            mask.x = data.posX;
            mask.y = 30;
            mask.radius = 9;
            mask.fillStyle = '#f00';
            line = self.initClass(CanvasGraphics);
            line.blendMode = 'source-out';
            line.lineWidth = 1.5;
            line.strokeStyle = Config.UI_COLOR;
            canvas.add(mask);
            canvas.add(line);
        }

        function initCircle() {
            circle = self.initClass(CanvasGraphics);
            circle.x = 52;
            circle.y = 30;
            circle.radius = data.radius;
            circle.lineWidth = 1.5;
            circle.strokeStyle = Config.UI_COLOR;
            canvas.add(circle);
        }

        function initLittleCircle() {
            littleCircle = self.initClass(CanvasGraphics);
            littleCircle.x = data.posX;
            littleCircle.y = 30;
            littleCircle.radius = 5 * data.littleCircleScale;
            littleCircle.lineWidth = 1.5;
            littleCircle.strokeStyle = Config.UI_COLOR;
            canvas.add(littleCircle);
        }

        function drawLine() {
            mask.x = data.posX;
            mask.clear();
            mask.beginPath();
            mask.arc();
            mask.fill();
            line.clear();
            line.beginPath();
            line.moveTo(52, 30);
            line.lineTo(52 * (1 - data.lineWidth), 30);
            line.stroke();
        }

        function drawCircle() {
            circle.radius = data.radius;
            circle.clear();
            circle.beginPath();
            circle.arc();
            circle.stroke();
        }

        function drawLittleCircle() {
            littleCircle.x = data.posX;
            littleCircle.radius = 5 * data.littleCircleScale;
            littleCircle.clear();
            if (data.littleCircleScale >= 0) {
                littleCircle.beginPath();
                littleCircle.arc();
                littleCircle.stroke();
            }
        }

        this.update = () => {
            drawLine();
            drawCircle();
            drawLittleCircle();
            canvas.render();
        };

        this.showButton = () => {
            Timer.clearTimeout(timeout);
            TweenManager.clearTween(data);
            data.posX = 52;
            data.lineWidth = 0;
            data.radius = 0;
            data.scale = 0;
            data.littleCircleScale = 0;
            this.needsUpdate = true;
            TweenManager.tween(data, { radius: 24, scale: 1, littleCircleScale: 0 }, 400, 'easeOutCubic', () => this.needsUpdate = false);
            this.tween({ opacity: 1 }, 400, 'easeOutCubic');
        };

        this.hideButton = () => {
            this.animatedIn = false;
            Timer.clearTimeout(timeout);
            TweenManager.clearTween(data);
            data.posX = 52;
            data.lineWidth = 0;
            this.needsUpdate = true;
            TweenManager.tween(data, { radius: 0, scale: 0, littleCircleScale: 0 }, 400, 'easeOutCubic', () => this.needsUpdate = false);
            this.tween({ opacity: 0 }, 400, 'easeOutCubic');
        };

        this.animateIn = () => {
            if (this.animatedIn) return;
            this.animatedIn = true;
            Timer.clearTimeout(timeout);
            TweenManager.clearTween(data);
            this.needsUpdate = true;
            const start = () => {
                TweenManager.tween(data, { scale: 0, littleCircleScale: 1 }, 400, 'easeOutCubic');
                TweenManager.tween(data, { lineWidth: 1 }, 600, 'easeOutQuart', 200);
                TweenManager.tween(data, { radius: 18, posX: 6 }, 800, 'easeOutQuart', () => {
                    TweenManager.tween(data, { radius: 24, posX: 52, spring: 1, damping: 0.5 }, 800, 'easeOutElastic', 500, () => {
                        timeout = this.delayedCall(() => {
                            if (this.animatedIn) start();
                        }, 500);
                    });
                });
            };
            start();
        };

        this.animateOut = () => {
            this.animatedIn = false;
            Timer.clearTimeout(timeout);
            TweenManager.clearTween(data);
            this.needsUpdate = true;
            TweenManager.tween(data, { posX: 52, spring: 1, damping: 0.5 }, 600, 'easeOutElastic');
            TweenManager.tween(data, { radius: 24, spring: 1, damping: 0.5 }, 400, 'easeOutElastic', 200);
            TweenManager.tween(data, { scale: 1, littleCircleScale: 0 }, 400, 'easeOutCubic', 200);
            TweenManager.tween(data, { lineWidth: 0 }, 400, 'easeOutQuart', 200, () => this.needsUpdate = false);
        };
    }
}

class MuteButton extends Interface {

    constructor() {
        super('MuteButton');
        const self = this;
        const data = {
            points: ['0.0048959479406107675,1.0192572485968008', '0.7440789483408068,1.1424541571342257', '1.3665350510328338,1.5722319717448148', '1.8516030710118443,2.161114514098655', '2.240878664481656,2.820613552436704', '2.5676840288925646,3.514673473755097', '2.852586758087085,4.227720074875111', '3.1087495131409355,4.952019250371872', '3.34491745226601,5.6833491709621455', '3.567664418707203,6.419033113515608', '3.7818384346752723,7.157364720628305', '3.991883208559571,7.89692012231687', '4.20161725978479,8.636571274379023', '4.414765516613279,9.375206805563112', '4.63544224654283,10.111540516820927', '4.868521677309701,10.84389177472948', '5.119915026729167,11.569934940861607', '5.39761872371416,12.285923841396897', '5.713181917701164,12.985402709853393', '6.084405647772996,13.655730591437308', '6.539749114583216,14.269197994950089', '7.119419081486065,14.759057858970056', '7.833381135450722,14.992018994281448', '8.572728856296692,14.870293116359157', '9.195338448495015,14.440785522641196', '9.680208055209789,13.851743515423879', '10.069105540383624,13.192016772217295', '10.395484129094136,12.49774462805595', '10.679967569881235,11.784536775684892', '10.935718523820654,11.060079921712221', '11.171497123710282,10.328625192177268', '11.393877212794976,9.592821204379307', '11.607714300578508,8.854391465042932', '11.817437120864248,8.114743171200885', '12.026879167662877,7.375006748905537', '12.23976162559024,6.636291663928467', '12.460198762144124,5.899884115317883', '12.693064805060779,5.167449492656206', '12.94425974121603,4.441348209381902', '13.221791230462259,3.7252818987187086', '13.537197191296478,3.0257489622651876', '13.908222508104089,2.355292698961461', '14.363251508608741,1.7415778212244037', '14.942374903123344,1.2510267443085306', '15.655824077518226,1.016232894445948', '16.396796540942944,1.1306049293101161', '17.02729399630583,1.5480186791997996', '17.520961172283407,2.12932705736226', '17.916597221147896,2.7848665081119037', '18.247580495047032,3.4768520761875497', '18.535159931485325,4.188764440295052', '18.792722810328243,4.9125381796621195', '19.029373679851147,5.6437213782868945', '19.25191100208862,6.379463437982535', '19.46526890312083,7.1180337064741765', '19.673999657085446,7.8579706805470435', '19.882131427610886,8.598101537217175', '20.0932506280392,9.33733538914369', '20.311684913718352,10.074372222547858', '20.542181228403805,10.807581899228586', '20.790759355659176,11.534616867737883', '21.065453160862333,12.251819559078669', '21.37769574040844,12.95281518967201', '21.74512715658105,13.625332467857985', '22.19607183875985,14.242202106038283', '22.770556855267387,14.73847581597864', '23.48079398096972,14.98341765723907', '24.236808416010575,14.995504117332072'],
            width: 24,
            height: 16,
            progress: 1,
            yMultiplier: 1
        };
        let canvas, line, points;

        this.enabled = true;
        this.needsUpdate = false;

        initHTML();
        initCanvas();
        initLine();
        initPoints();
        addListeners();

        function initHTML() {
            self.size(data.width, data.height);
            self.css({
                left: Config.UI_OFFSET + 10,
                bottom: Config.UI_OFFSET + 10,
                opacity: 0
            });
            if (!Global.SOUND) data.yMultiplier = 0;
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, data.width, data.height, true, true);
        }

        function initLine() {
            line = self.initClass(CanvasGraphics);
            line.lineWidth = 1.5;
            line.strokeStyle = Config.UI_COLOR;
            canvas.add(line);
        }

        function initPoints() {
            points = data.points.map(p => {
                return p.split(',');
            });
        }

        function addListeners() {
            self.interact(hover, click);
            self.hit.size(data.width * 2, data.height * 2).center();
        }

        function hover(e) {
            if (!self.animatedIn) return;
            TweenManager.clearTween(data);
            self.needsUpdate = true;
            if (e.action === 'over') TweenManager.tween(data, { yMultiplier: Global.SOUND ? 0.75 : 0.25 }, 275, 'easeInOutCubic', () => self.needsUpdate = false);
            else TweenManager.tween(data, { yMultiplier: Global.SOUND ? 1 : 0 }, 275, 'easeInOutCubic', () => self.needsUpdate = false);
        }

        function click() {
            if (Global.SOUND) {
                AudioController.mute();
                Global.SOUND = false;
                TweenManager.clearTween(data);
                self.needsUpdate = true;
                TweenManager.tween(data, { yMultiplier: 0 }, 300, 'easeOutCubic', () => self.needsUpdate = false);
            } else {
                AudioController.unmute();
                Global.SOUND = true;
                TweenManager.clearTween(data);
                self.needsUpdate = true;
                TweenManager.tween(data, { yMultiplier: 1 }, 300, 'easeOutCubic', () => self.needsUpdate = false);
            }
            Storage.set('sound', Global.SOUND);
        }

        function drawLine() {
            const progress = points.length * data.progress;
            let start = true;
            line.clear();
            line.beginPath();
            for (let i = 0; i < points.length; i++) {
                if (progress >= i) {
                    if (start) {
                        start = false;
                        line.moveTo(points[i][0], Math.max(points[i][1] * data.yMultiplier + (data.height * 0.5) * (1 - data.yMultiplier), 1));
                    } else {
                        line.lineTo(points[i][0], Math.max(points[i][1] * data.yMultiplier + (data.height * 0.5) * (1 - data.yMultiplier), 1));
                    }
                }
            }
            line.stroke();
        }

        this.update = () => {
            drawLine();
            canvas.render();
        };

        this.showButton = () => {
            if (!this.enabled) return;
            TweenManager.clearTween(data);
            data.progress = 0;
            this.needsUpdate = true;
            TweenManager.tween(data, { progress: 1 }, 1020, 'easeInOutExpo', () => {
                this.needsUpdate = false;
                this.animatedIn = true;
            });
            this.tween({ opacity: 1 }, 400, 'easeOutCubic');
            this.mouseEnabled(true);
        };

        this.hideButton = () => {
            this.animatedIn = false;
            this.mouseEnabled(false);
            TweenManager.clearTween(data);
            this.needsUpdate = true;
            TweenManager.tween(data, { progress: 0.94 }, 1160, 'easeInOutQuart', () => this.needsUpdate = false);
            this.tween({ opacity: 0 }, 400, 'easeOutCubic');
        };
    }
}

class FooterSide extends Interface {

    constructor() {
        super('FooterSide');
        const self = this;
        let title;

        initHTML();
        initTitle();

        function initHTML() {
            self.size('100%').mouseEnabled(false);
        }

        function initTitle() {
            title = self.create('.title');
            title.size('100%');
            title.inner = title.create('.inner');
            title.inner.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            title.inner.css({
                top: -30,
                right: 6,
                fontWeight: '400',
                lineHeight: 15,
                letterSpacing: 1,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
            });
            title.inner.text(Config.EXAMPLES[Global.EXAMPLE_INDEX].sideTitle);
            title.inner.element.style.transformOrigin = 'right center';
            title.inner.element.style.transform = 'rotate(-90deg) translateX(100%)';
        }

        function swapTitle() {
            title.tween({ x: -10, opacity: 0 }, 300, 'easeInSine', () => {
                title.inner.text(Config.EXAMPLES[Global.EXAMPLE_INDEX].sideTitle);
                title.transform({ x: 10 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutCubic');
            });
        }

        this.update = swapTitle;
    }
}

class FooterInfo extends Interface {

    constructor() {
        super('FooterInfo');
        const self = this;
        let index, length;

        initHTML();
        initIndex();
        initLength();

        function initHTML() {
            self.css({
                position: 'relative',
                display: 'block',
                fontWeight: '400',
                lineHeight: 15,
                letterSpacing: 1,
                whiteSpace: 'nowrap',
                cssFloat: 'right'
            });
        }

        function initIndex() {
            index = self.create('.index');
            index.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            index.css({
                position: 'relative',
                display: 'block',
                cssFloat: 'left'
            });
            index.text(Utils.pad(Global.EXAMPLE_INDEX + 1));
        }

        function initLength() {
            length = self.create('.length');
            length.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            length.css({
                position: 'relative',
                display: 'block',
                cssFloat: 'left'
            });
            length.text(`/${Utils.pad(Config.EXAMPLES.length)}`);
        }

        function swapIndex() {
            index.tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
                index.text(Utils.pad(Global.EXAMPLE_INDEX + 1));
                index.transform({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
            });
        }

        this.update = swapIndex;
    }
}

class Footer extends Interface {

    constructor() {
        super('Footer');
        const self = this;
        let info, side;

        initHTML();
        initInfo();
        initSide();

        function initHTML() {
            self.css({
                left: Config.UI_OFFSET + 10,
                right: Config.UI_OFFSET + 10,
                bottom: Config.UI_OFFSET + 10
            });
        }

        function initInfo() {
            info = self.initClass(FooterInfo);
            info.update();
            info.transform({ x: -10 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 2700);
        }

        function initSide() {
            side = self.initClass(FooterSide);
            side.transform({ x: -10 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 2900);
        }

        this.update = () => {
            info.update();
            side.update();
        };
    }
}

class HeaderExample extends Interface {

    constructor(item) {
        super('.HeaderExample');
        const self = this;
        let text, line;

        initHTML();

        function initHTML() {
            if (!item) {
                self.size('100%', 35);
                self.css({
                    position: 'relative',
                    display: 'block',
                    cssFloat: 'left',
                    clear: 'left',
                    cursor: 'pointer'
                });
            } else if (!(item.slug || item.path || item.path === '')) {
                self.size(40, 15);
                self.css({
                    position: 'relative',
                    display: 'block',
                    cssFloat: 'left',
                    clear: 'left'
                });
                line = self.create('.header-info-source-line');
                line.size(20, 1).center(0, 1);
                line.css({
                    left: 10,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.25)'
                });
                line.transformPoint('left center').transform({ scaleX: 0 });
            } else {
                self.size('auto', 15);
                self.css({
                    position: 'relative',
                    display: 'block',
                    cssFloat: 'left',
                    clear: 'left',
                    padding: '5px 10px'
                });
                text = self.create('.header-info-source-text');
                text.size('auto', 15);
                text.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
                text.css({
                    position: 'relative',
                    fontWeight: '400',
                    lineHeight: 15,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    opacity: 0
                });
                text.text(item.title.toUpperCase());
                text.transformPoint('left center');
                text.size();
                self.size(text.width, text.height);
                self.interact(hover, click);
            }
        }

        function hover(e) {
            if (!self.animatedIn) return;
            if (e.action === 'over') {
                if (text) text.tween({ scale: 1.05, opacity: 1 }, 325, 'easeOutCubic');
                if (line) line.tween({ scaleX: 1.25 }, 275, 'easeInOutCubic');
            } else {
                if (text) text.tween({ scale: 1, opacity: 0.35 }, 325, 'easeOutCubic');
                if (line) line.tween({ scaleX: 1 }, 275, 'easeInOutCubic');
            }
        }

        function click() {
            self.events.fire(Events.CLICK, { item });
        }

        this.animateIn = delay => {
            if (line) line.transform({ scaleX: 0 }).css({ opacity: 1 }).tween({ scaleX: 1 }, 550, 'easeInOutCubic', delay, () => this.animatedIn = true);
            if (text) text.transform({ scale: 1.25 }).tween({ y: 0, scale: 1, opacity: 0.35 }, 500, 'easeOutQuart', delay, () => this.animatedIn = true);
            self.transform({ y: -10 }).tween({ y: 0, opacity: 1 }, 325, 'easeOutQuart', delay);
        };

        this.animateOut = (callback, num, delay, total) => {
            this.animatedIn = false;
            if (line) line.tween({ scaleX: 0, opacity: 0 }, 450, 'easeOutCubic', delay);
            if (text) text.tween({ y: 10, opacity: 0 }, 400, 'easeOutCubic', delay);
            self.tween({ y: -10, opacity: 0 }, 650, 'easeOutCubic', delay, () => {
                if (num === total) callback();
            });
        };
    }
}

class HeaderExamples extends Interface {

    constructor() {
        super('HeaderExamples');
        const self = this;
        const buttons = [];
        let open = false;

        initHTML();
        initViews();
        addListeners();

        function initHTML() {
            self.css({
                left: 0,
                top: 0
            });
            self.mouseEnabled(false);
        }

        function initViews() {
            self.initClass(HeaderExample);
            let width = 0,
                height = 0;
            const examples = Assets.getData('config').examples;
            examples.forEach(item => {
                const button = self.initClass(HeaderExample, new Example(item));
                self.events.add(button, Events.CLICK, switchExample);
                buttons.push(button);
                if (button.width > width) width = button.width;
                height += button.height;
            });
            self.size(width + 50, height + 50);
        }

        function addListeners() {
            self.bind('mouseleave', closeExamples);
            self.bind('touchend', closeExamples);
        }

        function closeExamples(e) {
            if (e.target.className !== 'HeaderExample' && e.target.parentElement.className !== 'HeaderExample') {
                if (!open) return;
                self.events.fire(Events.UPDATE);
                animateOut();
            }
        }

        function animateIn() {
            open = true;
            self.mouseEnabled(true);
            self.show();
            buttons.forEach((button, i) => button.animateIn(i * 100));
        }

        function animateOut() {
            const remove = () => {
                self.hide();
                open = false;
                self.mouseEnabled(false);
            };
            buttons.forEach((button, i) => button.animateOut(remove, i, (buttons.length - i) * 50, buttons.length - 1));
        }

        function switchExample(e) {
            Data.setExample(e.item.path);
        }

        this.animateIn = animateIn;

        this.animateOut = animateOut;
    }
}

class HeaderExamplesButton extends Interface {

    constructor(copy) {
        super('HeaderExamplesButton');
        const self = this;
        let text, letters, examples,
            open = false;

        initHTML();
        initText();
        initView();
        addListeners();

        function initHTML() {
            self.css({
                position: 'relative',
                display: 'block',
                padding: 10,
                cssFloat: 'left'
            });
        }

        function initText() {
            text = self.create('.text');
            text.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            text.css({
                position: 'relative',
                display: 'block',
                fontWeight: '400',
                lineHeight: 15,
                letterSpacing: 1,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
            });
            text.text(copy);
            letters = text.split();
        }

        function initView() {
            examples = self.initClass(HeaderExamples);
            if (examples.height > Stage.height) self.hide();
        }

        function addListeners() {
            self.interact(hover, null);
            self.mouseEnabled(true);
            self.events.add(examples, Events.UPDATE, close);
        }

        function hover(e) {
            if (open) return;
            if (e.action === 'over') {
                examples.animateIn();
                self.mouseEnabled(false);
                letters.forEach((letter, i) => {
                    letter.tween({ y: -5, opacity: 0 }, 125, 'easeOutCubic', 15 * i, () => {
                        letter.transform({ y: 5 }).tween({ y: 0, opacity: 1 }, 300, 'easeOutCubic');
                    });
                });
                open = true;
            }
        }

        function close() {
            open = false;
            self.mouseEnabled(true);
        }

        this.animateIn = () => {
            this.transform({ x: -10 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 450, 'easeOutCubic', 450);
        };
    }
}

class HeaderItem extends Interface {

    constructor(copy) {
        super('HeaderItem');
        const self = this;
        let text, letters;

        initHTML();
        initText();
        addListeners();

        function initHTML() {
            self.css({
                position: 'relative',
                display: 'block',
                padding: 10,
                cssFloat: 'left'
            });
        }

        function initText() {
            text = self.create('.text');
            text.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            text.css({
                position: 'relative',
                display: 'block',
                fontWeight: '400',
                lineHeight: 15,
                letterSpacing: 1,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
            });
            text.text(copy);
            letters = text.split();
        }

        function addListeners() {
            self.interact(hover, click);
            self.hit.mouseEnabled(true);
        }

        function hover(e) {
            if (e.action === 'over') {
                letters.forEach((letter, i) => {
                    letter.tween({ y: -5, opacity: 0 }, 125, 'easeOutCubic', 15 * i, () => {
                        letter.transform({ y: 5 }).tween({ y: 0, opacity: 1 }, 300, 'easeOutCubic');
                    });
                });
            }
        }

        function click() {
            self.events.fire(Events.CLICK);
        }
    }
}

class Header extends Interface {

    constructor() {
        super('Header');
        const self = this;
        let about, examples, source;

        initHTML();
        initAbout();
        initExamples();
        initSource();
        addListeners();

        function initHTML() {
            self.size(260, 'auto');
            self.css({
                left: Config.UI_OFFSET,
                top: Config.UI_OFFSET
            });
        }

        function initAbout() {
            about = self.initClass(HeaderItem, 'About');
            about.transform({ x: -10 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 2100);
        }

        function initExamples() {
            examples = self.initClass(HeaderExamplesButton, 'Examples');
            examples.transform({ x: -10 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 2300);
        }

        function initSource() {
            source = self.initClass(HeaderItem, 'Source code');
            source.transform({ x: -10 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 1000, 'easeOutQuart', 2500);
        }

        function addListeners() {
            self.events.add(about, Events.CLICK, aboutClick);
            self.events.add(source, Events.CLICK, sourceClick);
        }

        function aboutClick() {
            self.events.fire(Events.OPEN_ABOUT);
        }

        function sourceClick() {
            if (Global.SOUND) AudioController.mute();
            setTimeout(() => getURL(Config.ABOUT_GITHUB_URL), 300);
        }
    }
}

class NavBackground extends Interface {

    constructor(size, start, end, out) {
        super('.NavBackground');
        const self = this;
        const mouse = new Vector2(),
            props = {
                wobbly: 1,
                expanded: 0
            },
            target = {
                position: 0,
                scroll: 0
            };
        let canvas, fill, points,
            width = end - start,
            direction = width < 0 ? -1 : 1,
            dragging = false,
            distance = 0;

        this.enabled = false;

        initHTML();
        initCanvas();
        initFill();
        initPoints();
        addListeners();
        this.startRender(loop);

        function initHTML() {
            self.size(size, '100%').mouseEnabled(false);
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, size, Stage.height, true, true);
        }

        function initFill() {
            fill = self.initClass(CanvasGraphics);
            fill.fillStyle = '#000';
            canvas.add(fill);
        }

        function initPoints() {
            points = [];
            for (let i = 0; i < 6; i++) {
                const point = new Vector2();
                point.x = 0;
                points.push(point);
            }
        }

        function drawSpline() {
            fill.clear();
            fill.beginPath();
            fill.moveTo(points[0].x, points[0].y);
            let i;
            for (i = 1; i < points.length - 2; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2,
                    yc = (points[i].y + points[i + 1].y) / 2;
                fill.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            fill.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        }

        function drawSolid() {
            drawSpline();
            fill.lineTo(start, Stage.height);
            fill.lineTo(start, 0);
            fill.lineTo(points[0].x, points[0].y);
            fill.fill();
        }

        function addListeners() {
            self.events.add(Mouse.input, Interaction.START, down);
            self.events.add(Mouse.input, Interaction.DRAG, drag);
            self.events.add(Mouse.input, Interaction.END, up);
            up();
        }

        function stopInertia() {
            TweenManager.clearTween(target);
        }

        function down() {
            if (!self.enabled) return;
            stopInertia();
            distance = 0;
            self.tweening = true;
            TweenManager.tween(props, { expanded: 0.15 }, 2000, 'easeOutElastic');
            Cursor.grabbing();
        }

        function drag() {
            if (!self.enabled) return;
            dragging = true;
            distance += Mouse.input.delta.x * 4;
            Cursor.grabbing();
        }

        function up() {
            if (!self.enabled) return;
            dragging = false;
            distance = 0;
            const m = (() => {
                if (Device.os === 'android') return 35;
                return 25;
            })();
            TweenManager.tween(props, { expanded: 0 }, 2000, 'easeOutElastic');
            TweenManager.tween(target, { scroll: target.scroll + Mouse.input.delta.x * m }, 500, 'easeOutQuint');
            Cursor.clear();
        }

        function loop() {
            if (self.enabled) {
                mouse.lerp(Mouse, 0.1);
                target.scroll += (distance - target.scroll) * 0.1;
                if (Math.abs(target.scroll) < 0.001) target.scroll = 0;
                target.position += ((end - mouse.x) - target.position) * 0.1;
                if (((direction > 0 && target.scroll > width) || (direction < 0 && target.scroll < width))) self.events.fire(Events.OPEN_NAV, { direction });
            }
            let x = Math.clamp((target.position + target.scroll) / width, 0, 1.8);
            x = Interpolation.Sine.In(x);
            if ((x > 0 && !self.animatedIn) || self.tweening || self.redraw) {
                for (let i = 0; i < points.length; i++) {
                    let difY = Math.abs(mouse.y - points[i].y) / Stage.height;
                    difY = Interpolation.Sine.In(difY);
                    const offset = (Config.NAV_WIDTH * props.wobbly - (difY * 120) * props.wobbly) * x * direction;
                    points[i].x = start + offset + out * props.expanded * direction;
                }
                drawSolid();
                canvas.render();
                if (self.redraw) self.redraw = false;
            }
        }

        this.resize = (s, p1, p2, o) => {
            stopInertia();
            size = s;
            start = p1;
            end = p2;
            out = o;
            width = end - start;
            direction = width < 0 ? -1 : 1;
            this.size(size, '100%');
            canvas.size(size, Stage.height);
            const inc = Stage.height / (points.length - 1);
            for (let i = 0; i < points.length; i++) {
                points[i].y = inc * i;
                points[i].x = start;
            }
            this.redraw = true;
        };

        this.reset = () => {
            stopInertia();
            this.animatedIn = false;
            this.enabled = false;
            dragging = false;
            distance = 0;
            props.wobbly = 1;
            props.expanded = 0;
            target.position = 0;
            target.scroll = 0;
            this.redraw = true;
        };

        this.animateIn = callback => {
            stopInertia();
            this.animatedIn = true;
            this.enabled = false;
            dragging = false;
            this.tweening = true;
            TweenManager.tween(props, { wobbly: 0, expanded: 1 }, callback ? 800 : 2000, callback ? 'easeOutCubic' : 'easeOutElastic', () => {
                this.tweening = false;
                target.position = 0;
                target.scroll = 0;
                if (callback) callback();
            });
        };

        this.animateOut = () => {
            if (dragging || this.animatedIn) return;
            stopInertia();
            this.animatedIn = false;
            this.enabled = false;
            dragging = false;
            distance = 0;
            this.tweening = true;
            TweenManager.tween(props, { wobbly: 1, expanded: 0 }, 400, 'easeInCubic', () => this.tweening = false);
            TweenManager.tween(target, { position: 0, scroll: 0 }, 400, 'easeInCubic');
        };
    }
}

class Nav extends Interface {

    constructor() {
        super('Nav');
        const self = this;
        const width = Config.NAV_WIDTH * 1.5;

        initHTML();
        initBackground();
        addListeners();

        function initHTML() {
            self.size('100%').mouseEnabled(false);
        }

        function initBackground() {
            self.right = self.initClass(NavBackground, Stage.width, Stage.width, Stage.width - width, Stage.width + 100);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.right.resize(Stage.width, Stage.width, Stage.width - width, Stage.width + 100);
        }

        this.reset = () => {
            this.right.reset();
        };
    }
}

class UI extends Interface {

    static instance() {
        if (!this.singleton) this.singleton = new UI();
        return this.singleton;
    }

    constructor() {
        super('UI');
        const self = this;
        const buttons = [];
        let nav, footer, bg, about;

        initContainer();
        initViews();
        initBackground();
        addListeners();
        this.startRender(loop);

        function initContainer() {
            Stage.add(self);
            self.size('100%').mouseEnabled(false);
            self.css({
                left: 0,
                top: 0
            });
        }

        function initViews() {
            nav = self.initClass(Nav);
            self.nav = nav;
            self.initClass(Header);
            footer = self.initClass(Footer);
            buttons.push(self.initClass(MuteButton));
            buttons.push(self.initClass(Button));
            buttons[1].background = nav.right;
        }

        function initBackground() {
            bg = self.create('.bg');
            bg.size('100%').bg('#000').css({ opacity: 0 });
            bg.interact(null, closeAbout);
            bg.hit.css({ cursor: '' });
            bg.hit.mouseEnabled(true);
            bg.hit.hide();
        }

        function addListeners() {
            buttons[1].interact(hover, hover);
            buttons[1].hit.css({ cursor: '' });
            buttons[1].hit.mouseEnabled(true);
            self.events.add(Events.UI_HIDE, hide);
            self.events.add(Events.UI_SHOW, show);
            self.events.add(Events.OPEN_NAV, openNav);
            self.events.add(Events.CLOSE_NAV, closeNav);
            self.events.add(Events.OPEN_ABOUT, openAbout);
            self.events.add(Events.CLOSE_ABOUT, closeAbout);
            self.events.add(Events.KEYBOARD_UP, keyUp);
        }

        function hover(e) {
            if (self.animatedIn) return;
            const button = e.object;
            if (e.action === 'over' || e.action === 'click') {
                button.noTap = false;
                Timer.clearTimeout(button.delay);
                over(button);
                button.timer = self.delayedCall(() => button.noTap = true, 500);
            } else {
                Timer.clearTimeout(button.timer);
                if (button.noTap) out(button);
                else button.delay = self.delayedCall(() => out(button), 500);
            }
        }

        function over(button) {
            button.animateIn();
            button.background.enabled = true;
        }

        function out(button) {
            button.animateOut();
            button.background.animateOut();
        }

        function hide() {
            buttons.forEach(button => button.hideButton());
        }

        function show() {
            buttons.forEach(button => button.showButton());
        }

        function loop() {
            if (about) about.update();
            buttons.forEach(button => {
                if (button.needsUpdate) button.update();
            });
        }

        function openNav() {
            if (self.animatedIn) return;
            self.animatedIn = true;
            hide();
            Cursor.clear();
        }

        function closeNav() {
            if (!self.animatedIn) return;
            self.animatedIn = false;
            nav.animateOut();
            show();
        }

        function openAbout() {
            Global.ABOUT_OPEN = true;
            about = self.initClass(About);
            bg.tween({ opacity: 0.85 }, 2000, 'easeOutSine');
            about.animateIn();
            bg.hit.show();
            if (Global.SOUND) AudioController.trigger('about_section');
        }

        function closeAbout() {
            bg.hit.hide();
            if (about) about.animateOut(() => {
                if (about) about = about.destroy();
                Global.ABOUT_OPEN = false;
            });
            bg.tween({ opacity: 0 }, 1000, 'easeOutSine');
            if (Global.SOUND) AudioController.trigger('fluid_section');
        }

        function keyUp(e) {
            if (e.keyCode === 27) closeAbout(); // Esc
        }

        this.update = () => {
            footer.update();
        };

        this.enableMuteButton = () => {
            buttons[0].enabled = true;
        };

        this.disableMuteButton = () => {
            buttons[0].enabled = false;
        };

        this.reset = () => {
            self.animatedIn = false;
            nav.reset();
        };
    }
}

class Fluid extends Component {

    constructor() {
        super();
        const self = this;
        const pointer = {
                isMove: false,
                isDown: false
            },
            pos = new Vector2(),
            last = new Vector2(),
            delta = new Vector2();
        let renderer, camera, buffer1, buffer2, pass, view, passScene, viewScene, passMesh, viewMesh;

        initRenderer();
        initFramebuffers();
        initShaders();
        addListeners();

        function initRenderer() {
            renderer = World.renderer;
            camera = World.camera;
        }

        function initFramebuffers() {
            const params = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                format: THREE.RGBAFormat,
                type: Device.os === 'ios' ? THREE.HalfFloatType : THREE.FloatType,
                depthBuffer: false,
                stencilBuffer: false
            };
            if (buffer1) buffer1.dispose();
            if (buffer2) buffer2.dispose();
            buffer1 = new THREE.WebGLRenderTarget(Stage.width * World.dpr, Stage.height * World.dpr, params);
            buffer2 = new THREE.WebGLRenderTarget(Stage.width * World.dpr, Stage.height * World.dpr, params);
        }

        function initShaders() {
            pass = self.initClass(Shader, vertFluidBasic, fragFluidPass, {
                time: World.time,
                frame: World.frame,
                resolution: World.resolution,
                mouse: { value: new THREE.Vector2(Mouse.inverseNormal.x, Mouse.inverseNormal.y) },
                last: { value: new THREE.Vector2() },
                velocity: { value: new THREE.Vector2() },
                strength: { value: new THREE.Vector2() },
                texture: { value: buffer1.texture }
            });
            passScene = new THREE.Scene();
            passMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), pass.material);
            passScene.add(passMesh);
            view = self.initClass(Shader, vertFluidBasic, fragFluidView, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: buffer1.texture }
            });
            viewScene = new THREE.Scene();
            viewMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), view.material);
            viewScene.add(viewMesh);
        }

        function updateShaders() {
            pass.uniforms.texture.value = buffer1.texture;
            view.uniforms.texture.value = buffer1.texture;
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            self.events.add(Mouse.input, Interaction.START, down);
            self.events.add(Mouse.input, Interaction.MOVE, move);
            self.events.add(Mouse.input, Interaction.END, up);
        }

        function resize() {
            initFramebuffers();
            updateShaders();
            World.frame.value = 0;
        }

        function down() {
            pointer.isDown = true;
            move();
        }

        function move() {
            if (!pointer.isMove && self.animatedIn) pointer.isMove = true;
            pos.set(Mouse.x, Stage.height - Mouse.y);
            pass.uniforms.last.value.copy(pass.uniforms.mouse.value);
            pass.uniforms.mouse.value.set(pos.x / Stage.width, pos.y / Stage.height);
        }

        function up() {
            pointer.isDown = false;
        }

        function loop() {
            delta.subVectors(pos, last);
            last.copy(pos);
            pass.uniforms.velocity.value.copy(delta);
            const distance = Math.min(10, delta.length()) / 10;
            pass.uniforms.strength.value.set(!pointer.isMove || pointer.isDown ? 50 : 50 * distance, 50 * distance);
            pass.uniforms.texture.value = buffer1.texture;
            renderer.render(passScene, camera, buffer2);
            const buffer = buffer1;
            buffer1 = buffer2;
            buffer2 = buffer;
            renderer.render(viewScene, camera);
            AudioController.updatePosition();
            World.frame.value++;
        }

        this.animateIn = () => {
            this.animatedIn = true;
            this.startRender(loop);
        };

        this.destroy = () => {
            if (buffer1) buffer1.dispose();
            if (buffer2) buffer2.dispose();
            viewScene.remove(viewMesh);
            viewMesh.geometry.dispose();
            viewMesh.material.dispose();
            passScene.remove(passMesh);
            passMesh.geometry.dispose();
            passMesh.material.dispose();
            viewMesh = null;
            passMesh = null;
            viewScene = null;
            passScene = null;
            return super.destroy();
        };
    }
}

class World extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new World();
        return this.singleton;
    }

    static destroy() {
        if (this.singleton) this.singleton.destroy();
        return Utils.nullObject(this);
    }

    constructor() {
        super();
        const self = this;
        let renderer, camera;

        World.dpr = 1;

        initWorld();
        addListeners();
        this.startRender(loop);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setPixelRatio(World.dpr);
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
            World.time = { value: 0 };
            World.frame = { value: 0 };
            World.resolution = { value: new THREE.Vector2(Stage.width * World.dpr, Stage.height * World.dpr) };
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function loop(t, delta) {
            World.time.value += delta * 0.001;
        }

        this.destroy = () => {
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.context = null;
            renderer.domElement = null;
            camera = null;
            renderer = null;
            Stage.remove(World.element);
            return super.destroy();
        };
    }
}

class AlienKitty extends Interface {

    constructor() {
        super('AlienKitty');
        const self = this;
        let alienkitty, eyelid1, eyelid2;

        initHTML();

        function initHTML() {
            self.size(90, 86).css({ opacity: 0 });
            alienkitty = self.create('.alienkitty').size(90, 86);
            eyelid1 = alienkitty.create('.eyelid1').size(24, 14).css({ left: 35, top: 25 }).transformPoint('50%', 0).transform({ scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = alienkitty.create('.eyelid2').size(24, 14).css({ left: 53, top: 26 }).transformPoint(0, 0).transform({ scaleX: 1, scaleY: 0.01 });
        }

        function initImages() {
            return Promise.all([
                Assets.loadImage('assets/images/alienkitty.svg'),
                Assets.loadImage('assets/images/alienkitty_eyelid.svg')
            ]).then(finishSetup);
        }

        function finishSetup() {
            alienkitty.bg('assets/images/alienkitty.svg');
            eyelid1.bg('assets/images/alienkitty_eyelid.svg');
            eyelid2.bg('assets/images/alienkitty_eyelid.svg');
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
            this.tween({ opacity: 1 }, 1000, 'easeOutSine');
        };

        this.animateOut = callback => {
            this.tween({ opacity: 0 }, 500, 'easeInOutQuad', () => {
                this.clearTimers();
                if (callback) callback();
            });
        };

        this.ready = initImages;
    }
}

class Loader extends Interface {

    constructor() {
        super('Loader');
        const self = this;
        let alienkitty, number, title, loader;

        initHTML();
        initView();
        initNumber();
        initTitle();
        initLoader();

        function initHTML() {
            self.size('100%').css({ left: 0, top: 0 });
            self.progress = 0;
        }

        function initView() {
            alienkitty = self.initClass(AlienKitty);
            alienkitty.center().css({ marginTop: -108 });
            alienkitty.ready().then(alienkitty.animateIn);
        }

        function initNumber() {
            number = self.create('.number');
            number.size(150, 25).center();
            number.inner = number.create('.inner');
            number.inner.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            number.inner.css({
                width: '100%',
                fontWeight: '400',
                lineHeight: 25,
                letterSpacing: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: 0.35
            });
            number.inner.text('');
        }

        function initTitle() {
            title = self.create('.title');
            title.size(600, 25).center().css({ opacity: 0 });
            title.inner = title.create('.inner');
            title.inner.fontStyle('Roboto Mono', 11, Config.UI_COLOR);
            title.inner.css({
                width: '100%',
                fontWeight: '400',
                lineHeight: 25,
                letterSpacing: 1,
                textAlign: 'center',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                opacity: 0.35
            });
            title.inner.text(Device.mobile ? 'Put on your headphones' : 'Turn up your speakers');
        }

        function initLoader() {
            loader = self.initClass(AssetLoader, Config.ASSETS);
            self.events.add(loader, Events.PROGRESS, loadUpdate);
        }

        function loadUpdate(e) {
            TweenManager.tween(self, { progress: e.percent }, 2000, 'easeInOutSine', null, () => {
                number.inner.text(Math.round(self.progress * 100));
                if (self.progress === 1) {
                    const state = Data.dispatcher.getState(),
                        item = Data.getExample(state.path);
                    if (item && item.path !== '') {
                        self.events.fire(Events.START, { item });
                    } else {
                        self.events.fire(Events.COMPLETE);
                        addStartButton();
                    }
                }
            });
        }

        function addStartButton() {
            number.tween({ opacity: 0 }, 200, 'easeOutSine', () => {
                number.hide();
                title.transform({ y: 10 }).css({ opacity: 0 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutQuart', 100);
                self.events.add(Mouse.input, Interaction.CLICK, click);
                self.delayedCall(() => swapTitle((Device.mobile ? 'Tap' : 'Click') + ' anywhere'), 7000);
                self.delayedCall(() => swapTitle(Device.mobile ? 'Tap tap!' : 'Click!'), 14000);
            });
        }

        function click() {
            self.events.remove(Mouse.input, Interaction.CLICK, click);
            self.events.fire(Events.START, { click: true });
            WebAudio.trigger('bass_drum');
        }

        function swapTitle(text) {
            title.tween({ y: -10, opacity: 0 }, 300, 'easeInSine', () => {
                title.inner.text(text);
                title.transform({ y: 10 }).tween({ y: 0, opacity: 1 }, 1000, 'easeOutCubic');
            });
        }

        this.animateOut = callback => {
            number.tween({ opacity: 0 }, 200, 'easeOutSine');
            title.tween({ opacity: 0 }, 200, 'easeOutSine');
            alienkitty.animateOut(callback);
        };
    }
}

class Example {

    constructor(item) {
        this.slug = item.slug;
        this.path = this.slug ? `examples/${this.slug}/` : item.path;
        this.title = item.title;
        this.pageTitle = `${this.title} / Alien.js Example`;
        this.description = item.description;
        this.sideTitle = this.description ? `${this.title} / ${this.description}` : this.title;
    }
}

class Main {

    constructor() {

        if (!Device.webgl) window.location = 'fallback.html';

        let loader, fluid, example,
            orientation = Stage.orientation;

        WebAudio.init();

        initSound();
        initStage();
        initLoader();
        addListeners();

        function initSound() {
            const sound = Storage.get('sound');
            Global.SOUND = typeof sound === 'boolean' ? sound : true;
            if (!Global.SOUND) WebAudio.gain.value = 0;
        }

        function initStage() {
            Stage.size('100%');
            Stage.transform({ scale: 1.3 }).css({ opacity: 0 }).tween({ scale: 1, opacity: 1 }, 3000, 'easeOutCubic', () => {
                Stage.clearTransform();
                Stage.clearOpacity();
            });

            Mouse.init();
            Accelerometer.init();

            Global.STAGE = Stage;
        }

        function initLoader() {
            Promise.all([
                FontLoader.loadFonts(['Roboto Mono', 'Oswald', 'Karla']),
                AssetLoader.loadAssets([`assets/data/config.json?${Utils.timestamp()}`])
            ]).then(() => {
                const examples = Assets.getData('config').examples;
                examples.forEach(item => {
                    if (item.slug || item.path || item.path === '') Config.EXAMPLES.push(new Example(item));
                });

                Data.init();
                Data.dispatcher.lock();

                loader = Stage.initClass(Loader);
                Stage.events.add(loader, Events.COMPLETE, initWorld);
            });
        }

        function initWorld() {
            AudioController.init();

            World.instance();
            Stage.add(World);

            fluid = Stage.initClass(Fluid);
        }

        function addListeners() {
            Stage.events.add(Events.START, start);
            Stage.events.add(Events.OPEN_NAV, openNav);
            Stage.events.add(Events.RESIZE, resize);
            Stage.events.add(Events.VISIBILITY, visibility);
        }

        function start(e) {
            loader.animateOut(() => {
                loader = loader.destroy();
                if (e.click) {
                    fluid.animateIn();
                    if (Global.SOUND) AudioController.trigger('fluid_start');

                    UI.instance();
                    Stage.delayedCall(() => {
                        Stage.events.fire(Events.UI_SHOW);
                        Data.dispatcher.unlock();
                    }, 1000);
                } else {
                    let item = e.item;
                    Global.EXAMPLE_INDEX = item.index;
                    Stage.events.fire(Events.CLOSE_NAV);
                    Stage.events.fire(Events.OPEN_NAV, { direction: -1, item });
                }
            });
        }

        function openNav(e) {
            if (e.direction < 0) {
                Stage.loaded = false;
                Stage.destroyed = false;
                Data.dispatcher.lock();

                let item = e.item;
                if (!item) item = Data.getNext();
                UI.instance().update();

                if (item.path !== '') {
                    example = Stage.initClass(ExampleLoader, item);
                    Stage.events.add(example, Events.COMPLETE, loadComplete);
                    UI.instance().disableMuteButton();
                } else {
                    Global.EXAMPLE = null;
                    Stage.loaded = true;
                    UI.instance().enableMuteButton();
                }

                UI.instance().nav.right.animateIn(() => {
                    if (fluid) fluid = fluid.destroy();
                    if (World.singleton) World.destroy();
                    if (Global.LAST_EXAMPLE) Global.LAST_EXAMPLE.destroy();
                    if (AudioController.trigger) AudioController.trigger('fluid_stop');

                    if (item.path === '') {
                        initWorld();
                        fluid.animateIn();
                        if (Global.SOUND) {
                            AudioController.unmute();
                            AudioController.trigger('fluid_start');
                        }
                    }

                    Stage.destroyed = true;
                    complete();
                });

                Data.dispatcher.setState(item.path);
                Data.dispatcher.setTitle(item.pageTitle);

                WebAudio.mute();
            }
        }

        function loadComplete() {
            example = example.destroy();

            Stage.loaded = true;
            complete();
        }

        function complete() {
            if (Stage.destroyed && Stage.loaded) {
                Global.LAST_EXAMPLE = Global.EXAMPLE;

                UI.instance().reset();
                Stage.delayedCall(() => {
                    Stage.events.fire(Events.UI_SHOW);
                    Data.dispatcher.unlock();
                }, 1000);
            }
        }

        function resize() {
            if (orientation !== Stage.orientation) location.reload();
        }

        function visibility(e) {
            if (e.type === 'blur') {
                WebAudio.mute();
            } else if (Global.SOUND) {
                if (!Global.ABOUT_OPEN) WebAudio.unmute();
                else AudioController.trigger('about_section');
            }
        }
    }
}

new Main();
