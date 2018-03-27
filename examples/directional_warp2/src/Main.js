/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasFont, Device, Mouse, Utils, Assets, Slide, SlideLoader, SlideVideo,
    MultiLoader, AssetLoader, FontLoader, StateDispatcher, TweenManager, Shader } from '../alien.js/src/Alien.js';

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

Assets.CORS = 'Anonymous';


class Data {

    static init() {
        const self = this;

        // StateDispatcher @param {boolean} [forceHash = undefined] Force hash navigation
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

    constructor() {
        super();
        const self = this;

        initCanvas();

        function initCanvas() {
            Config.LIST.forEach(data => {
                const canvas = self.initClass(Canvas, Stage.width, Stage.height, true, true);
                data.graphics = {};
                data.graphics.canvas = canvas;
            });
        }

        this.update = () => {
            Config.LIST.forEach(data => {
                const canvas = data.graphics.canvas;
                let text = data.graphics.text,
                    text2 = data.graphics.text2;
                canvas.size(Stage.width, Stage.height);
                if (text) {
                    canvas.remove(text);
                    text = text2 = text.destroy();
                }
                text = CanvasFont.createText(canvas, Stage.width, Stage.height, data.title.toUpperCase(), `200 ${Device.phone ? 28 : 66}px Oswald`, Config.UI_COLOR, {
                    lineHeight: Device.phone ? 35 : 80,
                    letterSpacing: 0,
                    textAlign: Device.phone ? 'left' : 'center'
                });
                text2 = CanvasFont.createText(canvas, Stage.width, Stage.height, data.description.toUpperCase(), '400 14px Karla', Config.UI_COLOR, {
                    lineHeight: 16,
                    letterSpacing: Device.phone ? 1.0 : 2.4,
                    textAlign: Device.phone ? 'left' : 'center'
                });
                text.add(text2);
                if (Device.phone) {
                    text2.x = 1;
                    text2.y = 10 + text2.totalHeight;
                    text.x = 20;
                    text.y = 55;
                } else {
                    text2.y = 18 + text2.totalHeight;
                    text.y = (Stage.height - (text.totalHeight + 18 + text2.totalHeight) + 124) / 2;
                }
                canvas.add(text);
                canvas.render();
                data.graphics.text = text;
                data.graphics.text2 = text2;
            });
        };
    }
}

class Title extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        let title, texture, shader, mesh;

        World.scene.add(this.object3D);

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            title = self.initClass(TitleTexture);
            texture = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
        }

        function initMesh() {
            shader = self.initClass(Shader, vertRipple, fragRipple, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: texture },
                opacity: { value: 0 },
                progress: { value: 0 },
                amplitude: { value: Device.phone ? 50 : 100 },
                speed: { value: Device.phone ? 1 : 10 },
                direction: { value: new THREE.Vector2(1.0, -1.0) },
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            self.object3D.add(mesh);
        }

        this.resize = () => {
            title.update();
            mesh.scale.set(Stage.width, Stage.height, 1);
        };

        this.update = () => {
            const data = Config.LIST[Global.SLIDE_INDEX];
            texture.image = data.graphics.canvas.element;
            texture.needsUpdate = true;
        };

        this.animateIn = callback => {
            shader.uniforms.opacity.value = 0;
            shader.uniforms.progress.value = 0;
            shader.uniforms.direction.value = this.direction < 0 ? new THREE.Vector2(-1.0, 1.0) : new THREE.Vector2(1.0, -1.0);
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 250, 'linear');
            TweenManager.tween(shader.uniforms.progress, { value: 1 }, 1600, 'easeOutCubic', callback);
        };

        this.animateOut = callback => {
            shader.uniforms.opacity.value = 1;
            shader.uniforms.progress.value = 1;
            shader.uniforms.direction.value = this.direction < 0 ? new THREE.Vector2(-1.0, 1.0) : new THREE.Vector2(1.0, -1.0);
            TweenManager.tween(shader.uniforms.opacity, { value: 0 }, 250, 'linear');
            TweenManager.tween(shader.uniforms.progress, { value: 0 }, 1200, 'easeOutCubic', callback);
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        const ratio = 1920 / 1080;
        let texture1, texture2, shader, mesh, slide, slide1, slide2, video1, video2, playing1, playing2, title;

        World.scene.add(this.object3D);

        initTextures();
        initMesh();
        initTitle();
        addListeners();
        this.startRender(loop);

        function initTextures() {
            texture1 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
            texture2 = new THREE.Texture(null, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
        }

        function initMesh() {
            shader = self.initClass(Shader, vertDirectionalWarp, fragDirectionalWarp, {
                time: World.time,
                resolution: World.resolution,
                texture1: { value: texture1 },
                texture2: { value: texture2 },
                opacity: { value: 0 },
                progress: { value: 0 },
                direction: { value: new THREE.Vector2(-1.0, 1.0) },
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            self.object3D.add(mesh);
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
            slide.goto(e);
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
            shader.uniforms.progress.value = slide.progress;
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
            shader.uniforms.opacity.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 1000, 'easeOutCubic');
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
            camera = new THREE.PerspectiveCamera(60, Stage.width / Stage.height, 1, 10000);
            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2(Stage.width * World.dpr, Stage.height * World.dpr) };
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
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
        }

        this.destroy = () => {
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

class Progress extends Interface {

    constructor() {
        super('Progress');
        const self = this;
        const size = 90;
        let canvas, circle;

        initHTML();
        initCanvas();
        initCircle();
        this.startRender(loop);

        function initHTML() {
            self.size(size);
            self.progress = 0;
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
            if (self.progress >= 1 && !self.complete) complete();
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
        let slide, loader, progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.size('100%');
        }

        function initLoader() {
            slide = self.initClass(SlideLoader, Config.LIST);
            loader = self.initClass(MultiLoader);
            loader.push(self.initClass(AssetLoader, Config.ASSETS));
            loader.push(slide);
            self.events.add(loader, Events.PROGRESS, loadUpdate);

            Stage.list = slide.list;
            Stage.pathList = slide.pathList;
        }

        function initProgress() {
            progress = self.initClass(Progress);
            progress.center();
            self.events.add(progress, Events.COMPLETE, loadComplete);
        }

        function loadUpdate(e) {
            progress.update(e);
        }

        function loadComplete() {
            self.events.fire(Events.COMPLETE);
        }

        this.animateOut = callback => {
            progress.animateOut(callback);
        };
    }
}

class Work {

    constructor(item) {
        this.slug = item.slug;
        this.path = `work/${this.slug}/`;
        this.title = item.title;
        this.pageTitle = `${this.title} / Alien.js Example Project`;
        this.description = item.description;
        this.src = `assets/video/${this.slug}.mp4`;
        this.img = `assets/images/shot/${this.slug}.jpg`;
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
                AssetLoader.loadAssets(['assets/data/config.json?' + Utils.timestamp()])
            ]).then(() => {
                const work = Assets.getData('config').work;
                work.forEach(item => Config.LIST.push(new Work(item)));

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
