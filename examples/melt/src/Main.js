/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasFont, Device, Mouse, Utils,
    Assets, AssetLoader, FontLoader, TweenManager, Utils3D, Shader } from '../alien.js/src/Alien.js';

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

    constructor() {
        super();
        const self = this;
        let canvas, texture, text;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, Stage.width, Stage.height, true, true);
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = THREE.LinearFilter;
            self.texture = texture;
        }

        this.update = () => {
            canvas.size(Stage.width, Stage.height);
            if (text) {
                canvas.remove(text);
                text = text.destroy();
            }
            text = CanvasFont.createText(canvas, Stage.width, Stage.height, 'Melt'.toUpperCase(), {
                font: `200 ${Device.phone ? 28 : 66}px Oswald`,
                lineHeight: Device.phone ? 35 : 80,
                letterSpacing: 0,
                textAlign: 'center',
                fillStyle: Config.UI_COLOR
            });
            const offset = Device.phone ? 55 : 120;
            text.y = (Stage.height - text.totalHeight + offset) / 2;
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
        let title, shader, mesh;

        this.object3D = new THREE.Object3D();
        World.scene.add(this.object3D);

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            title = self.initClass(TitleTexture);
            self.texture = title.texture;
        }

        function initMesh() {
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: title.texture },
                opacity: { value: 0 },
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            self.object3D.add(mesh);
        }

        this.update = () => {
            title.update();
            mesh.scale.set(Stage.width, Stage.height, 1);
        };

        this.animateIn = () => {
            shader.uniforms.opacity.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 250, 'linear');
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        const ratio = 1920 / 1080;
        let texture, shader, mesh, title;

        this.object3D = new THREE.Object3D();
        World.scene.add(this.object3D);

        function initTextures() {
            return Assets.loadImage('assets/images/HubblePAO_1920px.jpg').then(finishSetup);
        }

        function finishSetup(img) {
            texture = new THREE.Texture(img);
            texture.minFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
            initMesh();
            initTitle();
            addListeners();
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertBasicShader, fragBasicShader, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: texture },
                opacity: { value: 0 },
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
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            if (Stage.width / Stage.height > ratio) mesh.scale.set(Stage.width, Stage.width / ratio, 1);
            else mesh.scale.set(Stage.height * ratio, Stage.height, 1);
            title.update();
        }

        this.animateIn = () => {
            self.object3D.visible = true;
            shader.uniforms.opacity.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 1000, 'easeOutCubic');
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
            World.scene = scene;
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.camera = camera;
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
                time: World.time,
                frame: World.frame,
                resolution: World.resolution,
                texture1: { value: buffer1.texture },
                texture2: { value: renderTarget.texture }
            });
            passScene = new THREE.Scene();
            passMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), pass.material);
            passMesh.scale.set(Stage.width, Stage.height, 1);
            passScene.add(passMesh);
            view = self.initClass(Shader, vertMeltBasic, fragMeltView, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: buffer1.texture }
            });
            viewScene = new THREE.Scene();
            viewMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), view.material);
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
            pass.uniforms.texture2.value = renderTarget.texture;
            pass.uniforms.texture1.value = buffer1.texture;
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
            if (buffer1) buffer1.dispose();
            if (buffer2) buffer2.dispose();
            viewScene.remove(viewMesh);
            viewMesh.geometry.dispose();
            viewMesh.material.dispose();
            passScene.remove(passMesh);
            passMesh.geometry.dispose();
            passMesh.material.dispose();
            renderTarget.dispose();
            renderTarget = null;
            viewMesh = null;
            passMesh = null;
            viewScene = null;
            passScene = null;
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
        let progress;

        initHTML();
        initLoader();
        initProgress();

        function initHTML() {
            self.css({ position: 'static' });
        }

        function initLoader() {
            const loader = self.initClass(AssetLoader, Config.ASSETS);
            self.events.add(loader, Events.PROGRESS, loadUpdate);
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
