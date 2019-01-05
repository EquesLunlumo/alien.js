/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import * as THREE from 'three';

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasFont, Device, Mouse, Utils,
    Assets, AssetLoader, FontLoader, Utils3D, Shader } from '../alien.js/src/Alien.js';

import vertBasicShader from './shaders/basic_shader.vert';
import fragBasicShader from './shaders/basic_shader.frag';
import vertMeltBasic from './shaders/melt/basic.vert';
import fragMeltPass from './shaders/melt/pass.frag';
import fragMeltView from './shaders/melt/view.frag';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/HubblePAO_1920px.jpg'
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
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            self.texture = texture;
        }

        this.update = (width, height) => {
            canvas.size(width, height);
            if (text) {
                canvas.remove(text);
                text = text.destroy();
            }
            text = CanvasFont.createText(canvas, width, height, 'Melt'.toUpperCase(), {
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
        let texture, shader, mesh, title;

        this.group = new THREE.Group();
        this.group.visible = false;
        World.scene.add(this.group);

        function initTextures() {
            return Assets.loadImage('assets/images/HubblePAO_1920px.jpg').then(finishSetup);
        }

        function finishSetup(img) {
            texture = new THREE.Texture(img);
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
            texture.generateMipmaps = false;
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
            self.group.visible = true;
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
        let renderer, scene, camera, renderTarget, buffer1, buffer2, pass, view, passScene, viewScene, passMesh, viewMesh;

        World.dpr = Math.min(2, Device.pixelRatio);

        initWorld();
        initFramebuffers();
        initShaders();
        addListeners();

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
            renderer.setSize(Stage.width, Stage.height);
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-Stage.width / 2, Stage.width / 2, Stage.height / 2, -Stage.height / 2, 0, 1);
            renderTarget = Utils3D.createRT(Stage.width * World.dpr, Stage.height * World.dpr);
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.scene = scene;
            World.camera = camera;
            World.quad = new THREE.PlaneBufferGeometry(1, 1);
            World.time = { value: 0 };
            World.frame = { value: 0 };
            World.resolution = { value: new THREE.Vector2(Stage.width * World.dpr, Stage.height * World.dpr) };
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
            buffer1 = new THREE.WebGLRenderTarget(Stage.width * World.dpr, Stage.height * World.dpr, params);
            buffer2 = new THREE.WebGLRenderTarget(Stage.width * World.dpr, Stage.height * World.dpr, params);
        }

        function initShaders() {
            pass = self.initClass(Shader, vertMeltBasic, fragMeltPass, {
                tMap1: { value: buffer1.texture },
                tMap2: { value: renderTarget.texture },
                uTime: World.time,
                uFrame: World.frame,
                uResolution: World.resolution
            });
            passScene = new THREE.Scene();
            passMesh = new THREE.Mesh(World.quad, pass.material);
            passMesh.frustumCulled = false;
            passMesh.scale.set(Stage.width, Stage.height, 1);
            passScene.add(passMesh);
            view = self.initClass(Shader, vertMeltBasic, fragMeltView, {
                tMap: { value: buffer1.texture },
                uTime: World.time,
                uResolution: World.resolution
            });
            viewScene = new THREE.Scene();
            viewMesh = new THREE.Mesh(World.quad, view.material);
            viewMesh.frustumCulled = false;
            viewMesh.scale.set(Stage.width, Stage.height, 1);
            viewScene.add(viewMesh);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            renderTarget.setSize(Stage.width * World.dpr, Stage.height * World.dpr);
            buffer1.setSize(Stage.width * World.dpr, Stage.height * World.dpr);
            buffer2.setSize(Stage.width * World.dpr, Stage.height * World.dpr);
            camera.left = -Stage.width / 2;
            camera.right = Stage.width / 2;
            camera.top = Stage.height / 2;
            camera.bottom = -Stage.height / 2;
            camera.updateProjectionMatrix();
            passMesh.scale.set(Stage.width, Stage.height, 1);
            viewMesh.scale.set(Stage.width, Stage.height, 1);
            World.frame.value = 0;
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function loop(t, delta) {
            World.time.value += delta * 0.001;
            renderer.render(scene, camera, renderTarget, true);
            pass.uniforms.tMap2.value = renderTarget.texture;
            pass.uniforms.tMap1.value = buffer1.texture;
            renderer.render(passScene, camera, buffer2);
            const buffer = buffer1;
            buffer1 = buffer2;
            buffer2 = buffer;
            renderer.render(viewScene, camera);
            World.frame.value++;
        }

        this.animateIn = () => {
            this.startRender(loop);
        };

        this.destroy = () => {
            if (buffer2) buffer2.dispose();
            if (buffer1) buffer1.dispose();
            viewScene.remove(viewMesh);
            viewMesh.material.dispose();
            viewMesh.geometry.dispose();
            passScene.remove(passMesh);
            passMesh.material.dispose();
            passMesh.geometry.dispose();
            renderTarget.dispose();
            renderTarget = null;
            viewMesh = null;
            passMesh = null;
            viewScene = null;
            passScene = null;
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

            space = Stage.initClass(Space);
            space.ready().then(() => {
                World.instance().animateIn();
                space.animateIn();
            });
        }
    }
}

new Main();
