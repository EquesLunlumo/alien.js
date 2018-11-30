/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

/* global THREE */

import { Events, Stage, Component, Canvas, CanvasTexture, Device, Utils, Assets, AssetLoader, Shader } from '../../../../../build/alien.js';

import { vert, frag } from './shaders.js';

Config.ASSETS = [
    'assets/js/lib/three.min.js',
    'assets/images/alienkitty.svg',
    'assets/images/alienkitty_eyelid.svg'
];

class AlienKittyTexture extends Component {

    constructor() {
        super();
        const self = this;
        let canvas, texture, alienkitty, eyelid1, eyelid2;

        initCanvas();

        function initCanvas() {
            canvas = self.initClass(Canvas, 90, 86, true);
            self.canvas = canvas;
            texture = new THREE.Texture(canvas.element);
            texture.minFilter = THREE.LinearFilter;
            self.texture = texture;
        }

        function initImages() {
            return Promise.all([
                Assets.loadImage('assets/images/alienkitty.svg'),
                Assets.loadImage('assets/images/alienkitty_eyelid.svg')
            ]).then(finishSetup);
        }

        function finishSetup(img) {
            alienkitty = self.initClass(CanvasTexture, img[0], 90, 86);
            eyelid1 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid1.transformPoint('50%', 0).transform({ x: 35, y: 25, scaleX: 1.5, scaleY: 0.01 });
            eyelid2 = self.initClass(CanvasTexture, img[1], 24, 14);
            eyelid2.transformPoint(0, 0).transform({ x: 53, y: 26, scaleX: 1, scaleY: 0.01 });
            alienkitty.add(eyelid1);
            alienkitty.add(eyelid2);
            canvas.add(alienkitty);
            blink();
        }

        function blink() {
            self.delayedCall(Utils.headsTails(blink1, blink2), Utils.random(0, 10000));
        }

        function blink1() {
            tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 120, 'easeOutCubic', () => {
                tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 180, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        function blink2() {
            tween(eyelid1, { scaleY: 1.5 }, 120, 'easeOutCubic', () => {
                tween(eyelid1, { scaleY: 0.01 }, 180, 'easeOutCubic');
            });
            tween(eyelid2, { scaleX: 1.3, scaleY: 1.3 }, 180, 'easeOutCubic', () => {
                tween(eyelid2, { scaleX: 1, scaleY: 0.01 }, 240, 'easeOutCubic', () => {
                    blink();
                });
            });
        }

        this.ready = initImages;
    }
}

class Scene extends Component {

    constructor() {
        super();
        const self = this;
        let alienkitty, shader, mesh;

        this.object3D = new THREE.Object3D();
        World.scene.add(this.object3D);

        initCanvasTexture();
        initMesh();

        function initCanvasTexture() {
            alienkitty = self.initClass(AlienKittyTexture);
            alienkitty.ready().then(finishSetup);
        }

        function finishSetup() {
            self.startRender(loop);
            self.object3D.visible = true;
        }

        function initMesh() {
            self.object3D.visible = false;
            shader = self.initClass(Shader, vert, frag, {
                time: World.time,
                resolution: World.resolution,
                texture: { value: alienkitty.texture }
            });
            mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), shader.material);
            mesh.rotation.y = -Math.PI;
            self.object3D.add(mesh);
        }

        function loop() {
            if (!self.object3D.visible) return;
            alienkitty.canvas.render();
            alienkitty.texture.needsUpdate = true;
            mesh.rotation.y += 0.01;
        }
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

        World.dpr = Math.min(1.5, Device.pixelRatio);

        initWorld();
        addListeners();
        this.startRender(loop);

        function initWorld() {
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(World.dpr);
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(65, Stage.width / Stage.height, 0.01, 200);
            camera.position.set(0.85, 1, -1.5);
            camera.target = new THREE.Vector3();
            camera.lookAt(camera.target);
            World.renderer = renderer;
            World.element = renderer.domElement;
            World.scene = scene;
            World.camera = camera;
            World.time = { value: 0 };
            World.resolution = { value: new THREE.Vector2() };
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            renderer.setSize(Stage.width, Stage.height);
            camera.aspect = Stage.width / Stage.height;
            camera.updateProjectionMatrix();
            World.resolution.value.set(Stage.width * World.dpr, Stage.height * World.dpr);
        }

        function loop(t, delta) {
            World.time.value += delta * 0.001;
            renderer.render(scene, camera);
        }
    }
}

class Main {

    constructor() {

        initStage();

        function initStage() {
            Stage.size('100%');

            AssetLoader.loadAssets(Config.ASSETS).then(initWorld);
        }

        function initWorld() {
            World.instance();
            Stage.add(World);

            Stage.initClass(Scene);
        }
    }
}

new Main();
