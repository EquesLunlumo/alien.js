/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasFont, Device, Interaction, Mouse, Utils,
    Assets, AssetLoader, FontLoader, Shader } from '../alien.js/src/Alien.js';

import vertBasicShader from './shaders/basic_shader.vert';
import fragBasicShader from './shaders/basic_shader.frag';
import vertGlitchDisplace from './shaders/glitch_displace.vert';
import fragGlitchDisplace from './shaders/glitch_displace.frag';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/NGC_1672_1920px.jpg',
    'assets/images/Orion_Nebula_1920px.jpg'
];

//Assets.CDN = Config.CDN;
Assets.CORS = 'anonymous';
Assets.OPTIONS = {
    mode: 'cors',
    //credentials: 'include'
};


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
            text = CanvasFont.createText(canvas, width, height, 'Glitch Displace'.toUpperCase(), {
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

class Space extends Component {

    constructor() {
        super();
        const self = this;
        const ratio = 1920 / 1080;
        let texture1, texture2, shader, mesh, title,
            progress = 0;

        this.group = new THREE.Group();
        this.group.visible = false;
        World.scene.add(this.group);

        initTextures();

        function initTextures() {
            Promise.all([
                Assets.loadImage('assets/images/NGC_1672_1920px.jpg'),
                Assets.loadImage('assets/images/Orion_Nebula_1920px.jpg')
            ]).then(finishSetup);
        }

        function finishSetup(img) {
            texture1 = new THREE.Texture(img[0]);
            texture1.minFilter = THREE.LinearFilter;
            texture1.needsUpdate = true;
            texture1.generateMipmaps = false;
            texture2 = new THREE.Texture(img[1]);
            texture2.minFilter = THREE.LinearFilter;
            texture2.needsUpdate = true;
            texture2.generateMipmaps = false;
            initMesh();
            initTitle();
            addListeners();
            self.startRender(loop);
            self.group.visible = true;
            shader.uniforms.uAlpha.value = 0;
            shader.uniforms.uTransition.value = 0;
            tween(shader.uniforms.uAlpha, { value: 1 }, 1000, 'easeOutCubic');
            tween(shader.uniforms.uTransition, { value: 1 }, 7000, 'easeOutSine');
            title.animateIn();
        }

        function initMesh() {
            shader = self.initClass(Shader, vertGlitchDisplace, fragGlitchDisplace, {
                tMap1: { value: texture1 },
                tMap2: { value: texture2 },
                uAlpha: { value: 0 },
                uTransition: { value: progress },
                uTime: World.time,
                uResolution: World.resolution,
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
            self.events.add(Events.RESIZE, resize);
            self.events.add(Mouse.input, Interaction.START, down);
            self.events.add(Mouse.input, Interaction.END, up);
            up();
            resize();
        }

        function down() {
            progress = 0;
        }

        function up() {
            progress = 1;
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
            title.update();
        }

        function loop() {
            if (!self.group.visible) return;
            shader.uniforms.uTransition.value += (progress - shader.uniforms.uTransition.value) * 0.03;
        }
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
            const loader = self.initClass(AssetLoader, Config.ASSETS);
            self.events.add(loader, Events.PROGRESS, view.update);
            self.events.bubble(view, Events.COMPLETE);
        }

        this.animateOut = view.animateOut;
    }
}

class Main {

    constructor() {
        let loader;

        initStage();
        initLoader();
        addListeners();

        function initStage() {
            Stage.size('100%');

            Mouse.init();
        }

        function initLoader() {
            FontLoader.loadFonts(['Oswald', 'Karla']).then(() => {
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
        }

        function complete() {
            World.instance();
            Stage.add(World);

            Stage.initClass(Space);
        }
    }
}

new Main();
