/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasFont, Device, Interaction, Mouse, Utils,
    Assets, Video, AssetLoader, FontLoader, Shader, Effects } from '../alien.js/src/Alien.js';

import vertBasicShader from './shaders/basic_shader.vert';
import fragBasicShader from './shaders/basic_shader.frag';
import vertBasicPass from './shaders/basic_pass.vert';
import fragRotate from './shaders/rotate.frag';

Config.UI_COLOR = 'white';

Config.ASSETS = {
    'three': 'assets/js/lib/three.min.js'
};

//Assets.CDN = Config.CDN;
Assets.CORS = 'anonymous';
Assets.OPTIONS = {
    mode: 'cors',
    //credentials: 'include'
};


class Tests {

    static useVideoTextures() {
        return !Device.mobile && Device.browser !== 'safari' && !Device.detect('trident');
    }
}

class TitleTexture extends Component {

    constructor(config) {
        super();
        const self = this;
        let canvas, texture, text;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, config.width, config.height, true, true);
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            self.texture = texture;
        }

        this.update = (width, height) => {
            canvas.size(width, height);
            if (text) {
                canvas.remove(text);
                text = text.destroy();
            }
            text = CanvasFont.createText(canvas, width, height, 'Rotate 2'.toUpperCase(), {
                font: `200 ${config.fontSize}px Oswald`,
                lineHeight: config.lineHeight,
                letterSpacing: 0,
                textBaseline: 'alphabetic',
                textAlign: 'center',
                fillStyle: Config.UI_COLOR
            });
            text.y = config.fontSize + (height - text.totalHeight) / 2;
            canvas.add(text);
            canvas.render();
            texture.needsUpdate = true;
        };
    }
}

class Title extends Component {

    constructor() {
        super();
        const self = this;
        const fontSize = Device.phone ? 28 : 66,
            lineHeight = Device.phone ? 35 : 80,
            offset = -fontSize / 10;
        let title, shader, mesh,
            width = 1200,
            height = lineHeight * 2;

        this.group = new THREE.Group();
        World.scene.add(this.group);

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            title = self.initClass(TitleTexture, { width, height, fontSize, lineHeight });
        }

        function initMesh() {
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                tMap: { value: title.texture },
                uAlpha: { value: 0 },
                uTime: World.time,
                uResolution: World.resolution,
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(World.quad, shader.material);
            mesh.frustumCulled = false;
            mesh.position.y = -offset;
            self.group.add(mesh);
        }

        this.update = () => {
            width = Stage.portrait ? Stage.width * 0.9 : Math.min(1200, Stage.width * 0.8);
            title.update(width, height);
            mesh.scale.set(width, height, 1);
        };

        this.animateIn = () => {
            shader.uniforms.uAlpha.value = 0;
            tween(shader.uniforms.uAlpha, { value: 1 }, 250, 'linear');
        };
    }
}

class VideoTexture extends Component {

    constructor() {
        super();
        const self = this;
        const ready = Promise.create();
        let video, texture;

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
            texture.generateMipmaps = false;
            self.texture = texture;
            start();
        }

        function start() {
            video.play();
        }

        function loop() {
            if (video.playing) {
                texture.needsUpdate = true;
                if (!self.loaded) {
                    self.loaded = true;
                    ready.resolve();
                }
            }
        }

        this.ready = () => {
            return ready;
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
        const ratio = 1920 / 1080;
        let video, img, texture, shader, mesh, title;

        this.group = new THREE.Group();
        this.group.visible = false;
        World.scene.add(this.group);

        async function initTextures() {
            if (Tests.useVideoTextures()) video = self.initClass(VideoTexture);
            else img = Assets.createImage(Config.ASSETS['galaxy']);
            await (video ? video.ready() : Assets.loadImage(img));
            finishSetup();
        }

        function finishSetup() {
            if (video) {
                texture = video.texture;
            } else {
                texture = new THREE.Texture(img);
                texture.minFilter = THREE.LinearFilter;
                texture.needsUpdate = true;
                texture.generateMipmaps = false;
            }
            initMesh();
            initTitle();
            addListeners();
        }

        function initMesh() {
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                tMap: { value: texture },
                uAlpha: { value: 0 },
                uTime: World.time,
                uResolution: World.resolution,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(World.quad, shader.material);
            mesh.frustumCulled = false;
            mesh.position.z = 100;
            self.group.add(mesh);
        }

        function initTitle() {
            title = self.initClass(Title);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
            title.update();
        }

        this.animateIn = () => {
            this.group.visible = true;
            shader.uniforms.uAlpha.value = 0;
            tween(shader.uniforms.uAlpha, { value: 1 }, 1000, 'easeOutCubic');
            title.animateIn();
        };

        this.ready = initTextures;
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
        let renderer, scene, camera, effects, shader,
            beamWidth = 40;

        World.dpr = Math.min(2, Device.pixelRatio);

        initWorld();
        addListeners();

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60, Stage.width / Stage.height, 1, 10000);
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.scene = scene;
            World.camera = camera;
            World.quad = new THREE.PlaneBufferGeometry(1, 1);
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2() };
            effects = self.initClass(Effects, Stage, {
                renderer,
                scene,
                camera,
                dpr: World.dpr
            });
            shader = self.initClass(Shader, vertBasicPass, fragRotate, {
                tDiffuse: { value: null },
                uMouse: { value: Mouse.inverseNormal },
                uRadius: { value: 0 },
                uBeam: { value: 0 },
                uBeamWidth: { value: beamWidth },
                uTime: World.time,
                uResolution: World.resolution,
                depthWrite: false,
                depthTest: false
            });
            effects.add(shader);
            World.effects = effects;
            World.shader = shader;
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
        }

        function up() {
            beamWidth = 40;
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            camera.aspect = Stage.width / Stage.height;
            camera.position.z = 1 / Math.tan(Math.radians(30)) * 0.5 * Stage.height;
            camera.updateProjectionMatrix();
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function loop(t, dt) {
            World.time.value += dt * 0.001;
            effects.render();
            shader.uniforms.uBeamWidth.value += (beamWidth - shader.uniforms.uBeamWidth.value) * 0.3;
        }

        this.animateIn = () => {
            this.startRender(loop);
            shader.uniforms.uBeam.value = 0;
            tween(shader.uniforms.uBeam, { value: 1 }, 1000, 'easeOutSine');
        };

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
            canvas = self.initClass(Canvas, size);
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
            const loader = self.initClass(AssetLoader, Config.ASSETS);
            self.events.add(loader, Events.PROGRESS, view.update);
            self.events.bubble(view, Events.COMPLETE);
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

        async function initLoader() {
            Config.ASSETS['galaxy'] = Tests.useVideoTextures() ? 'assets/videos/galaxy.mp4' : 'assets/videos/galaxy.jpg';

            await FontLoader.loadFonts(['Oswald', 'Karla']);
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

        async function complete() {
            World.instance();
            Stage.add(World);

            space = Stage.initClass(Space);
            await space.ready();
            World.instance().animateIn();
            space.animateIn();
        }
    }
}

new Main();
