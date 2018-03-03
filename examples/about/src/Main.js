/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Timer, Events, Stage, Interface, Component, Canvas, CanvasGraphics, Device, Interaction, Mouse, Scroll, Video, Utils,
    Assets, AssetLoader, FontLoader, StateDispatcher, TweenManager, Interpolation, Vector2, WebAudio, Shader } from '../alien.js/src/Alien';

import vertSpace from './shaders/space.vert';
import fragSpace from './shaders/space.frag';

Config.UI_COLOR = 'white';
Config.NAV_WIDTH = 320;
Config.EXAMPLES = [];

Events.START = 'start';
Events.UI_HIDE = 'ui_hide';
Events.UI_SHOW = 'ui_show';
Events.OPEN_NAV = 'open_nav';
Events.CLOSE_NAV = 'close_nav';

Assets.CORS = 'Anonymous';


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

class Tests {

    static shaderVideo() {
        return !Device.mobile && Device.browser !== 'safari' && !Device.detect('trident');
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
            for (let i = 0; i < list.length; i++) {
                list[i].index = i;
                if (typeof Global.EXAMPLE_INDEX !== 'number' && (list[i].slug || list[i].path === '')) Global.EXAMPLE_INDEX = list[i].index;
            }
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

        this.next = () => {
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
            window.get(`https://rawgit.com/pschroen/alien.js/master/${item.path}dist/assets/js/${item.slug}.js`).then(data => {
                window.eval(`(function(){${data.replace('new Main;', `Global.EXAMPLE=Stage;Global.STAGE.add(Stage);Assets.CDN='https://rawgit.com/pschroen/alien.js/master/${item.path}dist/';new Main;`)}})();`);
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

class Info extends Interface {

    constructor() {
        super('Info');
        const self = this;
        const height = 185 + (Config.EXAMPLES.length * 27) + 20,
            texts = [];
        let wrapper, alienkitty, description;

        initHTML();
        initViews();
        initText();
        addListeners();

        function initHTML() {
            self.invisible();
            self.size(Device.phone ? Stage.width : Config.NAV_WIDTH, '100%').setZ(99999).mouseEnabled(true);
            wrapper = self.create('.wrapper');
            wrapper.size(Device.phone ? Stage.width : Config.NAV_WIDTH, height);
            wrapper.interact(null, closeNav);
            wrapper.hit.css({ cursor: '' });
        }

        function initViews() {
            alienkitty = wrapper.initClass(AlienKitty);
            alienkitty.css({ top: 20, left: 15 });
        }

        function initText() {
            description = wrapper.create('.description');
            description.size(260, 50);
            description.fontStyle('Consolas, "Lucida Console", Monaco, monospace', 11, Config.UI_COLOR);
            description.css({
                left: 20,
                top: 135,
                lineHeight: 14,
                opacity: 0.75
            });
            description.top = 200;
            description.text('Future web framework.');
            texts.push(description);
            Config.EXAMPLES.forEach((item, i) => {
                const link = wrapper.create('.link');
                link.size('auto', 20).setZ(99999);
                link.fontStyle('Consolas, "Lucida Console", Monaco, monospace', 11, Config.UI_COLOR);
                link.css({
                    left: 20,
                    top: 185 + i * 27,
                    lineHeight: 14
                });
                link.text(item.title);
                if (item.slug || item.path || item.path === '') {
                    link.letters = link.split();
                    link.interact(hover, click);
                    link.item = item;
                }
                if (item.description) {
                    link.create('.t', 'span').html(`&nbsp;(${item.description})`).css({
                        position: 'relative',
                        display: 'block',
                        width: 'auto',
                        height: 'auto',
                        margin: 0,
                        padding: 0,
                        cssFloat: 'left',
                        opacity: 0.75
                    });
                }
                texts.push(link);
            });
        }

        function hover(e) {
            if (e.action === 'over') e.object.letters.forEach((letter, i) => letter.tween({ y: -5, opacity: 0 }, 125, 'easeOutCubic', 15 * i, () => letter.transform({ y: 5 }).tween({ y: 0, opacity: 1 }, 300, 'easeOutCubic')));
        }

        function click(e) {
            WebAudio.mute();
            const item = e.object.item;
            if (!item.slug && item.path) setTimeout(() => getURL(item.path), 300);
            else Data.setExample(item.path);
        }

        function addListeners() {
            self.initClass(Scroll, self);
            self.events.add(Events.KEYBOARD_UP, keyUp);
        }

        function keyUp(e) {
            // Escape
            if (e.keyCode === 27) closeNav();
        }

        function closeNav() {
            self.events.fire(Events.CLOSE_NAV);
        }

        this.animateIn = () => {
            this.clearTimers();
            this.visible();
            alienkitty.ready().then(alienkitty.animateIn);
            texts.forEach((text, i) => text.clearTween().transform({ y: 50 }).css({ opacity: 0 }).tween({ y: 0, opacity: text.hit ? 1 : 0.75 }, 1000, 'easeOutCubic', 500 + i * 80));
            wrapper.clearTween().transform({ x: 20 }).css({ opacity: 0 }).tween({ x: 0, opacity: 1 }, 600, 'easeOutCubic');
        };

        this.animateOut = callback => {
            wrapper.tween({ opacity: 0 }, 125, 'easeOutCubic', callback);
        };
    }
}

class NavBackground extends Interface {

    constructor(size, start, end, out) {
        super('.NavBackground');
        const self = this;
        this.enabled = false;
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
            canvas = self.initClass(Canvas, size, Stage.height, true);
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
            TweenManager.tween(target, { scroll: target.scroll + Mouse.input.delta.x * m }, 500, 'easeOutQuint', () => self.animateOut());
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
                    const offset = (200 * props.wobbly - (difY * 120) * props.wobbly) * x * direction;
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
            canvas.size(size, Stage.height, true);
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
            if (dragging) return;
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
            self.left = self.initClass(NavBackground, Device.phone ? Stage.width : width, 0, Device.phone ? Stage.width : width, Device.phone ? Stage.width + 100 : Config.NAV_WIDTH);
            self.right = self.initClass(NavBackground, Stage.width, Stage.width, Stage.width - width, Stage.width + 100);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.left.resize(Device.phone ? Stage.width : width, 0, Device.phone ? Stage.width : width, Device.phone ? Stage.width + 100 : Config.NAV_WIDTH);
            self.right.resize(Stage.width, Stage.width, Stage.width - width, Stage.width + 100);
        }

        this.reset = () => {
            this.left.reset();
            this.right.reset();
        };

        this.animateIn = () => {
            this.left.animateIn();
            this.right.animateIn();
        };

        this.animateOut = () => {
            this.left.animateOut();
            this.right.animateOut();
        };
    }
}

class Button extends Interface {

    constructor(data) {
        super(data.name);
        const self = this;
        let canvas, mask, line, circle, littleCircle, timeout;

        initHTML();
        initCanvas();
        initLine();
        initCircle();
        initLittleCircle();

        function initHTML() {
            self.invisible();
            self.size(data.width, data.height).css({ opacity: 0 });
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, data.width, data.height, true);
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

        this.hideButton = () => {
            this.animatedIn = false;
            Timer.clearTimeout(timeout);
            TweenManager.clearTween(data);
            data.posX = 52;
            data.lineWidth = 0;
            TweenManager.tween(data, { radius: 0, scale: 0, littleCircleScale: 0 }, 400, 'easeOutCubic');
            this.tween({ opacity: 0 }, 400, 'easeOutCubic', () => this.invisible());
        };

        this.showButton = () => {
            Timer.clearTimeout(timeout);
            TweenManager.clearTween(data);
            data.posX = 52;
            data.lineWidth = 0;
            data.radius = 0;
            data.scale = 0;
            data.littleCircleScale = 0;
            TweenManager.tween(data, { radius: 24, scale: 1, littleCircleScale: 0 }, 400, 'easeOutCubic');
            this.visible().tween({ opacity: 0.5 }, 400, 'easeOutCubic');
        };

        this.animateIn = () => {
            if (this.animatedIn) return;
            this.animatedIn = true;
            Timer.clearTimeout(timeout);
            TweenManager.clearTween(data);
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
            TweenManager.tween(data, { posX: 52, spring: 1, damping: 0.5 }, 600, 'easeOutElastic');
            TweenManager.tween(data, { radius: 24, spring: 1, damping: 0.5 }, 400, 'easeOutElastic', 200);
            TweenManager.tween(data, { scale: 1, littleCircleScale: 0 }, 400, 'easeOutCubic', 200);
            TweenManager.tween(data, { lineWidth: 0 }, 400, 'easeOutQuart', 200);
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
        const buttons = [{
            name: '.button',
            width: 80,
            height: 60,
            context: null,
            img: null,
            radius: 24,
            posX: 52,
            scale: 1,
            littleCircleScale: 0,
            lineWidth: 0,
            object: null,
            needsUpdate: true,
            multiTween: true
        }, {
            name: '.button',
            width: 80,
            height: 60,
            context: null,
            img: null,
            radius: 24,
            posX: 52,
            scale: 1,
            littleCircleScale: 0,
            lineWidth: 0,
            object: null,
            needsUpdate: true,
            multiTween: true
        }];
        let prevent, bg, nav, info;

        initHTML();
        initViews();
        addListeners();
        Stage.add(this);
        this.startRender(loop);

        function initHTML() {
            self.size('100%').css({ left: 0, top: 0 }).mouseEnabled(false);
            bg = self.create('.bg');
            bg.size('100%');
            bg.interact(null, closeNav);
            bg.hit.css({ cursor: '' });
            bg.hit.mouseEnabled(true);
            bg.hide();
        }

        function initViews() {
            nav = self.initClass(Nav);
            buttons.forEach(button => button.object = self.initClass(Button, button));
            buttons[0].object.transform({ rotation: 180 }).center(0, 1).css({ left: 20 });
            buttons[1].object.center(0, 1).css({ right: 20 });
            buttons[0].background = nav.left;
            buttons[1].background = nav.right;
            self.nav = nav;
        }

        function addListeners() {
            buttons.forEach(button => {
                button.object.interact(hover, hover);
                button.object.hit.css({ cursor: '' });
                button.object.hit.mouseEnabled(true);
                button.object.button = button;
            });
            self.events.add(Events.UI_HIDE, hide);
            self.events.add(Events.UI_SHOW, show);
            self.events.add(Events.OPEN_NAV, openNav);
            self.events.add(Events.CLOSE_NAV, closeNav);
            if (!Device.mobile) {
                self.events.add(Mouse.input, Interaction.START, down);
                self.events.add(Mouse.input, Interaction.END, up);
                up();
            }
        }

        function hover(e) {
            if (self.animatedIn) return;
            const button = e.object.button;
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
            if (prevent) return;
            Timer.clearTimeout(button.timeout);
            button.needsUpdate = true;
            button.object.animateIn();
            button.object.tween({ opacity: 1 }, 400, 'easeOutCubic');
            button.background.enabled = true;
            buttons.forEach(b => {
                if (b !== button) out(b);
            });
        }

        function out(button) {
            Timer.clearTimeout(button.timeout);
            button.timeout = self.delayedCall(() => button.needsUpdate = false, 2000);
            button.object.animateOut();
            button.object.tween({ opacity: 0.5 }, 400, 'easeOutCubic');
            button.background.animateOut();
        }

        function hide() {
            buttons.forEach(button => {
                Timer.clearTimeout(button.delay);
                Timer.clearTimeout(button.timeout);
                button.needsUpdate = true;
                button.timeout = self.delayedCall(() => button.needsUpdate = false, 2000);
                button.object.hideButton();
            });
        }

        function show() {
            buttons.forEach(button => {
                Timer.clearTimeout(button.delay);
                Timer.clearTimeout(button.timeout);
                button.delay = self.delayedCall(() => {
                    button.needsUpdate = true;
                    button.timeout = self.delayedCall(() => button.needsUpdate = false, 2000);
                    button.object.showButton();
                }, 400);
            });
        }

        function loop() {
            buttons.forEach(button => {
                if (button.needsUpdate) button.object.update();
            });
        }

        function openNav(e) {
            if (self.animatedIn) return;
            self.animatedIn = true;
            if (e.direction > 0) {
                nav.left.animateIn();
                self.delayedCall(() => {
                    info = self.initClass(Info);
                    info.animateIn();
                    bg.show();
                }, 1000);
            }
            hide();
            Cursor.clear();
        }

        function closeNav() {
            if (!self.animatedIn) return;
            self.animatedIn = false;
            bg.hide();
            if (info) info.animateOut(() => {
                if (info) info = info.destroy();
            });
            nav.animateOut();
            show();
        }

        function down() {
            prevent = true;
        }

        function up() {
            prevent = false;
        }

        this.reset = () => {
            self.animatedIn = false;
            bg.hide();
            nav.reset();
        };
    }
}

class VideoTexture extends Component {

    constructor() {
        super();
        const self = this;
        let video, texture, promise;

        initVideo();
        this.startRender(loop, 40);

        function initVideo() {
            video = self.initClass(Video, {
                src: Config.ASSETS['galaxy'],
                width: 1920,
                height: 1080,
                preload: true,
                loop: true
            });
            video.object.mouseEnabled(false);
            if (Device.mobile) Stage.bind('touchend', start);
            texture = new THREE.Texture(video.element);
            texture.minFilter = THREE.LinearFilter;
            self.texture = texture;
            start();
        }

        function start() {
            video.play();
        }

        function loop() {
            if (video.ready()) {
                texture.needsUpdate = true;
                if (!self.loaded) {
                    self.loaded = true;
                    promise.resolve();
                }
            }
        }

        this.ready = () => {
            promise = Promise.create();
            return promise;
        };

        this.destroy = () => {
            Stage.unbind('touchend', start);
            return super.destroy();
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        const ratio = 1920 / 1080;
        let texture, img, video, shader, mesh,
            beamWidth = 40;

        World.scene.add(this.object3D);

        function initTexture() {
            img = Assets.createImage(Config.ASSETS['galaxy']);
            return Assets.loadImage(img).then(finishSetup);
        }

        function initVideoTexture() {
            video = self.initClass(VideoTexture);
            return video.ready().then(finishSetup);
        }

        function finishSetup() {
            if (video) {
                texture = video.texture;
            } else {
                texture = new THREE.Texture(img);
                texture.minFilter = THREE.LinearFilter;
                texture.needsUpdate = true;
            }
            initMesh();
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertSpace, fragSpace, {
                time: World.time,
                resolution: World.resolution,
                mouse: { value: Mouse.inverseNormal },
                texture: { value: texture },
                opacity: { value: 0 },
                radius: { value: 0 },
                beam: { value: 0 },
                beamWidth: { value: beamWidth },
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            mesh.scale.set(Stage.width, Stage.height, 1);
            mesh.position.z = 100;
            self.object3D.add(mesh);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            self.events.add(Mouse.input, Interaction.START, down);
            self.events.add(Mouse.input, Interaction.END, up);
            up();
            resize();
        }

        function down() {
            beamWidth = 1.2;
            WebAudio.trigger('DeepWarp');
        }

        function up() {
            beamWidth = 40;
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
        }

        function loop() {
            if (!self.object3D.visible) return;
            shader.uniforms.beamWidth.value += (beamWidth - shader.uniforms.beamWidth.value) * 0.3;
        }

        this.animateIn = () => {
            addListeners();
            this.startRender(loop);
            this.object3D.visible = true;
            shader.uniforms.beam.value = 0;
            TweenManager.tween(shader.uniforms.beam, { value: 1 }, 1000, 'easeOutSine');
        };

        this.ready = () => Tests.shaderVideo() ? initVideoTexture() : initTexture();

        this.destroy = () => {
            mesh = null;
            shader = null;
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
        this.singleton = null;
        return this.singleton;
    }

    constructor() {
        super();
        const self = this;
        const audioMinVolume = 0.5,
            audioMoveDecay = 0.95;
        let renderer, scene, camera, spacy,
            audioMoveVolume = audioMinVolume;

        World.dpr = Math.min(1.5, Device.pixelRatio);

        initWorld();
        addListeners();
        this.startRender(loop);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, Stage.width / Stage.height, 1, 10000);
            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2(Stage.width * World.dpr, Stage.height * World.dpr) };
        }

        function addListeners() {
            self.events.add(Mouse.input, Interaction.MOVE, move);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function move() {
            audioMoveVolume = Math.range(Mouse.input.velocity.length(), 0, 8, 0.5, 1, true);
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            camera.aspect = Stage.width / Stage.height;
            camera.position.z = 1 / Math.tan(Math.radians(30)) * 0.5 * Stage.height;
            camera.updateProjectionMatrix();
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function loop(t, delta) {
            World.time.value += delta * 0.001;
            renderer.render(scene, camera);
            if (spacy) {
                audioMoveVolume *= audioMoveDecay;
                if (audioMoveVolume < audioMinVolume) audioMoveVolume = audioMinVolume;
                spacy.gain.value += (audioMoveVolume - spacy.gain.value) * 0.3;
            }
        }

        this.initAudio = () => {
            spacy = WebAudio.getSound('DeepSpacy');
            if (spacy) {
                spacy.gain.value = audioMinVolume;
                spacy.loop = true;
                WebAudio.trigger('DeepSpacy');
            }
        };

        this.destroy = () => {
            if (spacy) {
                spacy.stop();
                spacy = null;
            }
            for (let i = scene.children.length - 1; i >= 0; i--) {
                const object = scene.children[i];
                scene.remove(object);
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            }
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.context = null;
            renderer.domElement = null;
            camera = null;
            scene = null;
            renderer = null;
            Stage.remove(World.element);
            Utils.nullObject(World);
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
        initViews();
        initNumber();
        initTitle();
        initLoader();

        function initHTML() {
            self.size('100%').css({ left: 0, top: 0 });
            self.progress = 0;
        }

        function initViews() {
            alienkitty = self.initClass(AlienKitty);
            alienkitty.center().css({ marginTop: -108 });
            alienkitty.ready().then(alienkitty.animateIn);
        }

        function initNumber() {
            number = self.create('.number');
            number.size(150, 25).center();
            number.inner = number.create('.inner');
            number.inner.fontStyle('Consolas, "Lucida Console", Monaco, monospace', 11, Config.UI_COLOR);
            number.inner.css({
                width: '100%',
                lineHeight: 25,
                textAlign: 'center',
                whiteSpace: 'nowrap'
            });
            number.inner.text('');
        }

        function initTitle() {
            title = self.create('.title');
            title.size(600, 25).center().css({ opacity: 0 });
            title.inner = title.create('.inner');
            title.inner.fontStyle('Consolas, "Lucida Console", Monaco, monospace', 11, Config.UI_COLOR);
            title.inner.css({
                width: '100%',
                lineHeight: 25,
                textAlign: 'center',
                whiteSpace: 'nowrap'
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
            WebAudio.trigger('BassDrum');
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
        if (item.slug) this.path = `examples/${this.slug}/`;
        else this.path = item.path;
        this.title = item.title;
        this.pageTitle = `${this.title} / Alien.js Example Project`;
        this.description = item.description;
    }
}

class Main {

    constructor() {

        if (!Device.webgl) window.location = 'fallback.html';

        let loader, space, example,
            orientation = Stage.orientation;

        WebAudio.init();

        setConfig();
        initStage();
        initLoader();
        addListeners();

        function setConfig() {
            Config.ASSETS = {
                'three': 'assets/js/lib/three.min.js',
                'BassDrum': 'assets/sounds/BassDrum.mp3',
                'DeepSpacy': 'assets/sounds/DeepSpacy.mp3',
                'DeepWarp': 'assets/sounds/DeepWarp.mp3',
                'galaxy': Tests.shaderVideo() ? 'assets/video/galaxy.mp4' : 'assets/images/shot/galaxy.jpg'
            };
        }

        function initStage() {
            Stage.size('100%');

            Mouse.init();

            Global.STAGE = Stage;
        }

        function initLoader() {
            Promise.all([
                FontLoader.loadFonts(['Consolas, "Lucida Console", Monaco, monospace', 'Oswald', 'Karla']),
                AssetLoader.loadAssets(['assets/data/config.json?' + Utils.timestamp()])
            ]).then(() => {
                const examples = Assets.getData('config').examples;
                examples.forEach(item => Config.EXAMPLES.push(new Example(item)));

                Data.init();
                Data.dispatcher.lock();

                loader = Stage.initClass(Loader);
                Stage.events.add(loader, Events.COMPLETE, initWorld);
            });
        }

        function initWorld() {
            World.instance();
            Stage.add(World);

            space = Stage.initClass(Space);
        }

        function addListeners() {
            Stage.events.add(Events.START, start);
            Stage.events.add(Events.OPEN_NAV, openNav);
            Stage.events.add(Events.CLOSE_NAV, closeNav);
            Stage.events.add(Events.RESIZE, resize);
            Stage.events.add(Events.VISIBILITY, visibility);
        }

        function start(e) {
            loader.animateOut(() => {
                loader = loader.destroy();
                if (e.click) {
                    space.ready().then(() => {
                        space.animateIn();

                        World.instance().initAudio();
                    });

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
                if (!item) item = Data.next();
                if (item.path !== '') {
                    example = Stage.initClass(ExampleLoader, item);
                    Stage.events.add(example, Events.COMPLETE, loadComplete);
                } else {
                    setConfig();
                    Global.EXAMPLE = null;
                    Stage.loaded = true;
                }

                UI.instance().nav.right.animateIn(() => {
                    if (space) space = space.destroy();
                    if (World.singleton) World.destroy();
                    if (Global.LAST_EXAMPLE) Global.LAST_EXAMPLE.destroy();

                    if (item.path === '') {
                        WebAudio.unmute();
                        initWorld();
                        space.ready().then(() => {
                            space.animateIn();

                            World.instance().initAudio();
                        });
                    }

                    Stage.destroyed = true;
                    complete();
                });

                Data.dispatcher.setState(item.path);
                Data.dispatcher.setTitle(item.pageTitle);

                WebAudio.mute();
            }
        }

        function closeNav() {
            WebAudio.unmute();
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
                    Stage.element.appendChild(UI.instance().element);
                    Stage.events.fire(Events.UI_SHOW);
                    Data.dispatcher.unlock();
                }, 1000);
            }
        }

        function resize() {
            if (orientation !== Stage.orientation) location.reload();
        }

        function visibility(e) {
            if (e.type === 'blur') WebAudio.mute();
            else WebAudio.unmute();
        }
    }
}

window.onload = () => new Main();
