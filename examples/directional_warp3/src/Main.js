/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasFont, Device, Mouse, Utils,
    Assets, Slide, SlideLoader, SlideVideo, MultiLoader, AssetLoader, FontLoader, StateDispatcher, Utils3D,
    Shader, ShaderStage, ShaderObject } from '../alien.js/src/Alien.js';

import vertTitleListItem from './shaders/title_list_item.vert';
import fragTitleListItem from './shaders/title_list_item.frag';
import vertRipple from './shaders/ripple.vert';
import fragRipple from './shaders/ripple.frag';
import vertDirectionalWarp from './shaders/directional_warp.vert';
import fragDirectionalWarp from './shaders/directional_warp.frag';

Config.UI_COLOR = 'white';
Config.LIST = [];
Config.ASSETS = [
    'assets/js/lib/three.min.js'
];

Global.SLIDE_INDEX = 0;

Events.START = 'start';
Events.SLIDE_CHANGE = 'slide_change';

//Assets.CDN = Config.CDN;
Assets.CORS = 'anonymous';
Assets.OPTIONS = {
    mode: 'cors',
    //credentials: 'include'
};


class Work {

    constructor(item, index) {
        this.id = item.id;
        this.path = `work/${this.id}/`;
        this.title = item.title;
        this.pageTitle = `${this.title} / Alien.js Example Project`;
        this.description = item.description;
        this.src = `assets/videos/${this.id}.mp4`;
        this.img = `assets/videos/${this.id}.jpg`;
        this.index = index;
    }
}

class Data {

    static init() {
        const self = this;

        // StateDispatcher @param {boolean} [hash = undefined] Use hash navigation
        this.dispatcher = Stage.initClass(StateDispatcher, true);

        addListeners();

        function addListeners() {
            Stage.events.add(self.dispatcher, Events.UPDATE, stateChange);
        }

        function stateChange(e) {
            if (e.path !== '') self.setSlide(e);
        }

        this.setSlide = e => {
            Stage.events.fire(Events.SLIDE_CHANGE, e.value ? e.value.position : Stage.pathList.indexOf(e.path) || 0);
        };
    }
}

class TitleTexture extends Component {

    constructor(data, config) {
        super();
        const self = this;
        let canvas, texture, text, text2;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, config.width, config.height, true, true);
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            self.canvas = canvas;
            self.texture = texture;
        }

        this.update = (width, height) => {
            canvas.size(width, height);
            if (text) {
                canvas.remove(text);
                text = text.destroy();
            }
            if (text2) {
                canvas.remove(text2);
                text2 = text2.destroy();
            }
            text = CanvasFont.createText(canvas, width, height, data.title.toUpperCase(), {
                font: `200 ${config.fontSize}px Oswald`,
                lineHeight: config.lineHeight,
                letterSpacing: 0,
                textBaseline: 'alphabetic',
                textAlign: 'center',
                fillStyle: Config.UI_COLOR
            });
            text2 = CanvasFont.createText(canvas, width, height, data.description.toUpperCase(), {
                font: '400 14px Karla',
                lineHeight: 16,
                letterSpacing: Device.phone ? 1 : 2.4,
                textBaseline: 'alphabetic',
                textAlign: 'center',
                fillStyle: Config.UI_COLOR
            });
            text.add(text2);
            const margin = Device.phone ? 12 : 20;
            text2.y = 14 + margin;
            text.y = config.fontSize + (height - (text.totalHeight + margin + text2.totalHeight)) / 2;
            canvas.add(text);
            canvas.render();
            texture.needsUpdate = true;
        };
    }
}

class TitleListItem extends Component {

    constructor(wrapper, data) {
        super();
        const self = this;
        const fontSize = Device.phone ? 28 : 66,
            lineHeight = Device.phone ? 35 : 80,
            offset = -fontSize / 10;
        let ui, title, texture, shader,
            width = 1200,
            height = lineHeight * 2;

        initElement();

        function initElement() {
            ui = self.initClass(ShaderObject, width, height);
            self.element = ui;

            title = self.initClass(TitleTexture, data, { width, height, fontSize, lineHeight });
            self.title = title;

            texture = self.initClass(ShaderObject, width, height, title.texture);
            ui.add(texture);
            wrapper.add(ui);

            shader = self.initClass(Shader, vertTitleListItem, fragTitleListItem, {
                tMap: { value: title.texture },
                uActive: { value: 0 },
                uResolution: World.resolution,
                uTime: World.time,
                blending: THREE.NoBlending,
                transparent: true,
                depthWrite: false,
                depthTest: false
            });

            texture.interact(hover, click);
            texture.useShader(shader);
        }

        function hover(e) {
            self.events.fire(Events.HOVER, { item: self, index: data.index, action: e.action });
        }

        function click() {
            self.events.fire(Events.CLICK, { item: self, index: data.index });
        }

        this.resize = () => {
            width = Stage.portrait ? Stage.width * 0.9 : Math.min(1200, Stage.width * 0.8);
            title.update(width, height);
            texture.size(width, height);
            ui.x = (Stage.width - width) / 2;
            ui.y = (Stage.height - height) / 2 + offset;
            ui.size(width, height);
        };

        this.hoverIn = () => {
            texture.tween({ scale: 1.025 }, 300, 'easeOutCubic');
            tween(shader.uniforms.uActive, { value: 1 }, 300, 'easeOutCubic');
        };

        this.hoverOut = () => {
            texture.tween({ scale: 1 }, 600, 'easeOutCubic');
            tween(shader.uniforms.uActive, { value: 0 }, 600, 'easeOutCubic');
        };
    }
}

class TitleList extends Component {

    constructor() {
        super();
        const self = this;
        let rt, stage, ui,
            items = [];

        initRT();
        initStage();
        initLayout();
        this.startRender(loop);

        function initRT() {
            rt = Utils3D.createRT(Stage.width * World.dpr, Stage.height * World.dpr);
            self.rt = rt;
        }

        function initStage() {
            stage = self.initClass(ShaderStage, World.renderer);
            stage.rt = rt;
            self.stage = stage;

            ui = self.initClass(ShaderObject);
            stage.add(ui);
        }

        function initLayout() {
            Config.LIST.forEach(data => {
                const item = self.initClass(TitleListItem, ui, data);
                self.events.add(item, Events.HOVER, itemHover);
                self.events.add(item, Events.CLICK, itemClick);
                items.push(item);
            });
        }

        function itemHover(e) {
            if (e.action === 'over') {
                items.forEach((item, i) => {
                    if (i === e.index) {
                        item.hoverIn();
                    } else {
                        item.hoverOut();
                    }
                });
            } else {
                items.forEach(item => {
                    item.hoverOut();
                });
            }
        }

        function itemClick() {
            open('https://alien.js.org/');
        }

        function loop() {
            stage.render();
        }

        this.resize = () => {
            rt.setSize(Stage.width * World.dpr, Stage.height * World.dpr);
            items.forEach(item => {
                item.resize();
            });
            ui.size(Stage.width, Stage.height);
        };

        this.update = () => {
            items.forEach((item, i) => {
                if (i !== Global.SLIDE_INDEX) item.element.hide();
                else item.element.show();
            });
        };
    }
}

class Title extends Component {

    constructor() {
        super();
        const self = this;
        let list, shader, mesh;

        this.group = new THREE.Group();
        World.scene.add(this.group);

        initViews();
        initMesh();

        function initViews() {
            list = self.initClass(TitleList);
        }

        function initMesh() {
            shader = self.initClass(Shader, vertRipple, fragRipple, {
                tMap: { value: list.rt.texture },
                uAlpha: { value: 0 },
                uTransition: { value: 0 },
                uAmplitude: { value: Device.phone ? 75 : 100 },
                uSpeed: { value: Device.phone ? 5 : 10 },
                uDirection: { value: new THREE.Vector2(1, -1) },
                uTime: World.time,
                uResolution: World.resolution,
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(World.quad, shader.material);
            mesh.frustumCulled = false;
            self.group.add(mesh);
        }

        this.resize = () => {
            list.resize();
            mesh.scale.set(Stage.width, Stage.height, 1);
        };

        this.update = () => {
            list.update();
        };

        this.animateIn = callback => {
            clearTween(shader.uniforms.uAlpha);
            clearTween(shader.uniforms.uTransition);
            shader.uniforms.uAlpha.value = 0;
            shader.uniforms.uTransition.value = 0;
            shader.uniforms.uDirection.value = this.direction < 0 ? new THREE.Vector2(-1, 1) : new THREE.Vector2(1, -1);
            tween(shader.uniforms.uAlpha, { value: 1 }, 250, 'linear');
            tween(shader.uniforms.uTransition, { value: 1 }, 1600, 'easeOutCubic', callback);
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        const ratio = 1920 / 1080;
        let texture1, texture2, shader, mesh, slide, slide1, slide2, video1, video2, playing1, playing2, title;

        this.group = new THREE.Group();
        World.scene.add(this.group);

        initTextures();
        initMesh();
        initTitle();
        addListeners();
        this.startRender(loop);

        function initTextures() {
            texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            texture1.generateMipmaps = false;
            texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            texture2.generateMipmaps = false;
        }

        function initMesh() {
            shader = self.initClass(Shader, vertDirectionalWarp, fragDirectionalWarp, {
                tMap1: { value: texture1 },
                tMap2: { value: texture2 },
                uAlpha: { value: 0 },
                uTransition: { value: 0 },
                uDirection: { value: new THREE.Vector2(-1, 1) },
                uTime: World.time,
                uResolution: World.resolution,
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(World.quad, shader.material);
            mesh.frustumCulled = false;
            self.group.add(mesh);
        }

        function initTitle() {
            title = self.initClass(Title);
        }

        function addListeners() {
            const state = Data.dispatcher.getState(),
                index = Stage.pathList.indexOf(state.path);
            if (~index) Global.SLIDE_INDEX = index;
            slide = self.initClass(Slide, {
                num: Stage.list.length,
                max: {
                    x: 0,
                    y: Stage.height
                },
                index: Global.SLIDE_INDEX,
                axes: ['y']
            });
            self.events.add(slide, Events.UPDATE, slideUpdate);
            self.events.add(Events.SLIDE_CHANGE, slideChange);
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function slideUpdate(e) {
            Global.SLIDE_INDEX = e.index;
            const data = Config.LIST[Global.SLIDE_INDEX];
            if (self.loaded) {
                title.direction = e.direction.y;
                title.update();
                title.animateIn();
                const progress = slide.y / slide.max.y,
                    i = Math.round(progress);
                Data.dispatcher.setState({ position: i }, data.path);
            } else {
                title.direction = 1;
                title.update();
                const state = Data.dispatcher.getState(),
                    index = Stage.pathList.indexOf(state.path);
                if (!~index) Data.dispatcher.replaceState(data.path);
            }
            Data.dispatcher.setTitle(data.pageTitle);
        }

        function slideChange(e) {
            slide.moveTo(e);
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
            slide.max.y = Stage.height;
            title.resize();
            title.update();
        }

        function loop() {
            if (slide1 !== slide.floor || slide2 !== slide.ceil) {
                slide1 = slide.floor;
                slide2 = slide.ceil;
                updateTextures();
            }
            if (playing1 && video1.ready()) texture1.needsUpdate = true;
            if (playing2 && video2.ready()) texture2.needsUpdate = true;
            shader.uniforms.uTransition.value = slide.progress;
        }

        function updateTextures() {
            video1 = Stage.list[slide1];
            video2 = Stage.list[slide2];
            if (SlideVideo.test) {
                unsetTextures(slide1, slide2);
                playing1 = false;
                playing2 = false;
            }
            setTexture1();
            setTexture2();
        }

        function unsetTextures(t1, t2) {
            Stage.list.forEach((video, i) => {
                if (i !== t1 && i !== t2) {
                    self.events.remove(video, Events.READY, play1);
                    self.events.remove(video, Events.READY, play2);
                    video.pause();
                }
            });
        }

        function setTexture1() {
            texture1.image = video1.element;
            if (SlideVideo.test) {
                if (video1.playing) {
                    play1();
                } else {
                    self.events.add(video1, Events.READY, play1);
                    video1.play();
                }
            } else {
                texture1.needsUpdate = true;
                loaded();
            }
        }

        function setTexture2() {
            texture2.image = video2.element;
            if (SlideVideo.test) {
                if (video2.playing) {
                    play2();
                } else {
                    self.events.add(video2, Events.READY, play2);
                    video2.play();
                }
            } else {
                texture2.needsUpdate = true;
            }
        }

        function play1() {
            playing1 = true;
            loaded();
        }

        function play2() {
            playing2 = true;
        }

        function loaded() {
            if (!self.loaded) {
                self.loaded = true;
                self.events.fire(Events.START);
            }
        }

        this.animateIn = () => {
            shader.uniforms.uAlpha.value = 0;
            tween(shader.uniforms.uAlpha, { value: 1 }, 1000, 'easeOutCubic');
            title.animateIn();
        };

        this.destroy = () => {
            for (let i = Stage.list.length - 1; i >= 0; i--) Stage.list[i].destroy();
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
        let renderer, scene, camera;

        World.dpr = Math.min(2, Device.pixelRatio);

        initWorld();
        addListeners();
        this.startRender(loop);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.scene = scene;
            World.camera = camera;
            World.quad = new THREE.PlaneBufferGeometry(1, 1);
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2() };
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            camera.left = -Stage.width / 2;
            camera.right = Stage.width / 2;
            camera.top = Stage.height / 2;
            camera.bottom = -Stage.height / 2;
            camera.updateProjectionMatrix();
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function loop(t, dt) {
            World.time.value += dt * 0.001;
            renderer.render(scene, camera);
        }

        this.destroy = () => {
            for (let i = scene.children.length - 1; i >= 0; i--) {
                const object = scene.children[i];
                scene.remove(object);
                if (object.material) object.material.dispose();
                if (object.geometry) object.geometry.dispose();
            }
            renderer.dispose();
            renderer.forceContextLoss();
            renderer.context = null;
            renderer.domElement = null;
            camera = null;
            scene = null;
            renderer = null;
            Stage.remove(World);
            return super.destroy();
        };
    }
}

class Progress extends Interface {

    constructor() {
        super('Progress');
        const self = this;
        const size = 90;
        let canvas, circle;

        this.progress = 0;

        initHTML();
        initCanvas();
        initCircle();
        this.startRender(loop);

        function initHTML() {
            self.size(size);
        }

        function initCanvas() {
            canvas = self.initClass(Canvas, size, true);
        }

        function initCircle() {
            circle = self.initClass(CanvasGraphics);
            circle.x = size / 2;
            circle.y = size / 2;
            circle.radius = size * 0.4;
            circle.lineWidth = 1.5;
            circle.strokeStyle = Config.UI_COLOR;
            canvas.add(circle);
        }

        function drawCircle() {
            circle.clear();
            const endAngle = Math.radians(-90) + Math.radians(self.progress * 360);
            circle.beginPath();
            circle.arc(endAngle);
            circle.stroke();
        }

        function loop() {
            if (self.complete) return;
            if (self.progress >= 1) complete();
            drawCircle();
            canvas.render();
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
            view = self.initClass(Progress);
            view.center();
        }

        function initLoader() {
            const slide = self.initClass(SlideLoader, Config.LIST),
                loader = self.initClass(MultiLoader);
            loader.push(self.initClass(AssetLoader, Config.ASSETS));
            loader.push(slide);
            self.events.add(loader, Events.PROGRESS, view.update);
            self.events.bubble(view, Events.COMPLETE);

            Stage.list = slide.list;
            Stage.pathList = slide.pathList;
        }

        this.animateOut = view.animateOut;
    }
}

class Main {

    constructor() {
        let loader, space;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%');

            Mouse.init();
        }

        function initLoader() {
            Promise.all([
                FontLoader.loadFonts(['Oswald', 'Karla']),
                AssetLoader.loadAssets([`assets/data/data.json?${Utils.timestamp()}`])
            ]).then(() => {
                const work = Assets.getData('data').work;
                work.forEach((item, i) => Config.LIST.push(new Work(item, i)));

                Data.init();

                loader = Stage.initClass(Loader);
                Stage.events.add(loader, Events.COMPLETE, loadComplete);
            });
        }

        function loadComplete() {
            loader.animateOut(() => {
                loader = loader.destroy();
                Stage.events.fire(Events.COMPLETE);
            });
        }

        function addListeners() {
            Stage.events.add(Events.COMPLETE, complete);
            Stage.events.add(Events.START, start);
        }

        function complete() {
            World.instance();
            Stage.add(World);

            space = Stage.initClass(Space);
        }

        function start() {
            space.animateIn();
        }
    }
}

new Main();
