/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Interface, Component, Canvas, CanvasGraphics, CanvasFont, Device, Interaction, Mouse, Utils, Assets, AssetLoader, FontLoader, TweenManager, Shader } from '../alien.js/src/Alien.js';

import vertTitle from './shaders/title.vert';
import fragTitle from './shaders/title.frag';
import vertRipple from './shaders/ripple.vert';
import fragRipple from './shaders/ripple.frag';

Config.UI_COLOR = 'white';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/NGC_1672_1920px.jpg',
    'assets/images/Orion_Nebula_1920px.jpg'
];

Assets.CORS = 'Anonymous';


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
            text = CanvasFont.createText(canvas, Stage.width, Stage.height, 'Ripple'.toUpperCase(), `200 ${Device.phone ? 28 : 66}px Oswald`, Config.UI_COLOR, {
                lineHeight: Device.phone ? 35 : 80,
                letterSpacing: 0,
                textAlign: 'center'
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
        this.object3D = new THREE.Object3D();
        let title, shader, mesh,
            progress = 0;

        World.scene.add(this.object3D);

        initCanvasTexture();
        initMesh();
        addListeners();

        function initCanvasTexture() {
            title = self.initClass(TitleTexture);
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertTitle, fragTitle, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: title.texture },
                opacity: { value: 0 },
                progress: { value: progress },
                amplitude: { value: Device.phone ? 75 : 100 },
                speed: { value: Device.phone ? 5 : 10 },
                direction: { value: new THREE.Vector2(1, -1) },
                transparent: true,
                depthWrite: false,
                depthTest: false
            });
            mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), shader.material);
            self.object3D.add(mesh);
        }

        function addListeners() {
            self.events.add(Mouse.input, Interaction.START, down);
            self.events.add(Mouse.input, Interaction.END, up);
            up();
        }

        function down() {
            progress = 0;
        }

        function up() {
            progress = 1;
        }

        function loop() {
            if (!self.object3D.visible) return;
            shader.uniforms.progress.value += (progress - shader.uniforms.progress.value) * 0.03;
        }

        this.update = () => {
            title.update();
            mesh.scale.set(Stage.width, Stage.height, 1);
        };

        this.animateIn = () => {
            this.startRender(loop);
            this.object3D.visible = true;
            shader.uniforms.opacity.value = 0;
            shader.uniforms.progress.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 250, 'linear');
            TweenManager.tween(shader.uniforms.progress, { value: 1 }, 7000, 'easeOutSine');
        };
    }
}

class Space extends Component {

    constructor() {
        super();
        const self = this;
        this.object3D = new THREE.Object3D();
        const ratio = 1920 / 1080;
        let texture1, texture2, img1, img2, shader, mesh, title,
            progress = 0;

        World.scene.add(this.object3D);

        initTextures();

        function initTextures() {
            img1 = Assets.createImage('assets/images/NGC_1672_1920px.jpg');
            img2 = Assets.createImage('assets/images/Orion_Nebula_1920px.jpg');
            Promise.all([Assets.loadImage(img1), Assets.loadImage(img2)]).then(finishSetup);
        }

        function finishSetup() {
            texture1 = new THREE.Texture(img1);
            texture1.minFilter = THREE.LinearFilter;
            texture1.needsUpdate = true;
            texture2 = new THREE.Texture(img2);
            texture2.minFilter = THREE.LinearFilter;
            texture2.needsUpdate = true;
            initMesh();
            initTitle();
            addListeners();
            self.startRender(loop);
            self.object3D.visible = true;
            shader.uniforms.opacity.value = 0;
            shader.uniforms.progress.value = 0;
            TweenManager.tween(shader.uniforms.opacity, { value: 1 }, 1000, 'easeOutCubic');
            TweenManager.tween(shader.uniforms.progress, { value: 1 }, 7000, 'easeOutSine');
            title.animateIn();
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vertRipple, fragRipple, {
                time: World.time,
                resolution: World.resolution,
                texture1: { value: texture1 },
                texture2: { value: texture2 },
                opacity: { value: 0 },
                progress: { value: progress },
                direction: { value: new THREE.Vector2(1, -1) },
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
            if (!self.object3D.visible) return;
            shader.uniforms.progress.value += (progress - shader.uniforms.progress.value) * 0.03;
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
            camera.left = -Stage.width / 2;
            camera.right = Stage.width / 2;
            camera.top = Stage.height / 2;
            camera.bottom = -Stage.height / 2;
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
