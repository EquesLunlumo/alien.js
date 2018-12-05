# Alien.js
[![NPM Package][npm]][npm-url]
[![Build Status][build-status]][build-status-url]
[![Dependencies][dependencies]][dependencies-url]
[![Dev Dependencies][dev-dependencies]][dev-dependencies-url]

Future web framework.

### Features

* ES modules [without transpiling](https://alien.js.org/examples/library/) and [dynamic import](https://alien.js.org/examples/dynamic/), or use [Rollup](https://rollupjs.org/) with [Tree Shaking](https://github.com/rollup/rollup#tree-shaking), only the classes you use are compiled into your project.
* Simple design pattern with inheritance, `Interface` and `Component`.
* Event based or use promises.
* GSAP animation core.
* Canvas graphics engine.
* Web audio engine.
* SVG support.
* WebGL with [three.js](https://threejs.org/).
* GLSL shaders with [glslify](https://github.com/glslify/glslify) (a node.js-style module system for GLSL).

### Examples

#### ui

[about](https://alien.js.org/examples/about/public/)  
[long scroll](https://alien.js.org/examples/long_scroll/public/)  
[ufo](https://ufo.ai/)

#### shader

glslify [shader](https://alien.js.org/examples/shader/public/)  
[colour beam](https://alien.js.org/examples/colour_beam/public/)  
[dissolve](https://alien.js.org/examples/dissolve/public/) (fade transition)  
[colorize](https://alien.js.org/examples/colorize/public/) (fade transition)  
[chromatic aberration](https://alien.js.org/examples/chromatic_aberration/public/) (simple)  
[chromatic aberration 2](https://alien.js.org/examples/chromatic_aberration2/public/) (barrel distortion)  
[rotate](https://alien.js.org/examples/rotate/public/)  
[rotate 2](https://alien.js.org/examples/rotate2/public/) (pinhole)  
[mask](https://alien.js.org/examples/mask/public/) (levels transition)  
[noise warp](https://alien.js.org/examples/noise_warp/public/)  
[noise dizzy](https://alien.js.org/examples/noise_dizzy/public/)  
[directional warp](https://alien.js.org/examples/directional_warp/public/)  
[directional warp 2](https://alien.js.org/examples/directional_warp2/public/) (scroll transition)  
[ripple](https://alien.js.org/examples/ripple/public/)  
[perlin](https://alien.js.org/examples/perlin/public/)  
[glitch displace](https://alien.js.org/examples/glitch_displace/public/)  
[melt](https://alien.js.org/examples/melt/public/) (feedback buffer)

### Example Class structure

```js
//
//  Class
//  │
//  ├── Decorators
//  └── Constructor
//      │
//      └── Private scope
//          │
//          ├── Constants
//          ├── Variables
//          ├── Functions
//          │
//          └── Public scope
//              │
//              ├── Methods
//              └── Overrides
//

class About extends Interface {

    constructor() {
        super('About');
        const self = this;

        // Private scope

        let wrapper;

        initHTML();
        addListeners();

        function initHTML() {
            self.size('100%');
            wrapper = self.create('.wrapper');
        }

        // Event listeners

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
        }

        // Public scope

        this.update = () => {
        };

        this.animateIn = callback => {
        };

        this.animateOut = callback => {
        };

        // Overrides

        this.destroy = () => {
            // ...
            return super.destroy();
        };
    }
}
```

### Example `Interface` design pattern

```js
import { Stage, Interface, Device } from '../alien.js/src/Alien.js';

Config.UI_OFFSET = Device.phone ? 20 : 35;

class Logo extends Interface {

    constructor() {
        super('Logo');
        const self = this;
        const size = Device.phone ? 40 : 64;

        initHTML();

        function initHTML() {
            self.size(size);
            self.css({
                left: Config.UI_OFFSET,
                top: Config.UI_OFFSET,
                opacity: 0
            });
            self.bg('assets/images/logo.svg', 'cover');
            self.tween({ opacity: 1 }, 1000, 'easeOutQuart');
            self.interact(hover, click);
        }

        function hover(e) {
            if (e.action === 'over') self.tween({ opacity: 0.7 }, 100, 'easeOutSine');
            else self.tween({ opacity: 1 }, 300, 'easeOutSine');
        }

        function click() {
            getURL('https://alien.js.org/');
        }
    }
}

class Main {

    constructor() {
        Stage.initClass(Logo);
    }
}

new Main();
```

### Example Singleton design pattern

```js
import { Events, Stage, Interface, Canvas } from '../alien.js/src/Alien.js';

class CanvasLayer extends Interface {

    static instance() {
        if (!this.singleton) this.singleton = new CanvasLayer();
        return this.singleton;
    }

    constructor() {
        super('CanvasLayer');
        const self = this;

        initContainer();
        initCanvas();
        addListeners();

        function initContainer() {
            self.size('100%').mouseEnabled(false);
            Stage.add(self);
        }

        function initCanvas() {
            self.canvas = self.initClass(Canvas, Stage.width, Stage.height, true);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.canvas.size(Stage.width, Stage.height);
        }
    }
}

class Main {

    constructor() {
        let canvas;

        initCanvas();

        function initCanvas() {
            canvas = CanvasLayer.instance().canvas;
            // ...
        }
    }
}

new Main();
```

### Example Static Class design pattern

```js
import { Events, Stage, StateDispatcher } from '../alien.js/src/Alien.js';

class Data {

    static init() {
        const self = this;

        this.dispatcher = Stage.initClass(StateDispatcher, true);

        addListeners();

        function addListeners() {
            Stage.events.add(self.dispatcher, Events.UPDATE, stateChange);
        }

        function stateChange(e) {
            if (e.path !== '') self.setSlide(e);
        }

        this.setSlide = e => {
            // ...
        };
    }
}

class Main {

    constructor() {
        Data.init();

        const state = Data.dispatcher.getState();
        if (state.path !== '') {
            // ...
        }
    }
}

new Main();
```

### Quickstart

To build a project, make sure you have [Node.js](https://nodejs.org/) installed (at least version 6.9).

```
mkdir loader
cd loader
git init
git submodule add -b master https://github.com/pschroen/alien.js
cp -r alien.js/examples/loader/* .
cp alien.js/.eslintrc.json alien.js/.gitignore .
npm install
npm start
```

Then open [http://localhost:8080/](http://localhost:8080/). The `npm start` script runs `npm run dev`, so you can start experimenting with the code right away! :)

### Updating

```
git submodule update --remote --merge
cp alien.js/examples/loader/package.json alien.js/examples/loader/rollup.config.js .
cp alien.js/.eslintrc.json alien.js/.gitignore .
rm -rf node_modules package-lock.json
npm install
```

### Workflow

```
npm run lint
npm run build
npm start
npm run build
```

### Installation via npm

```
mkdir loader
cd loader
curl -sL https://github.com/pschroen/alien.js/archive/master.tar.gz | tar -zxv --strip=3 "*/examples/npm/*"
curl -sOL https://raw.githubusercontent.com/pschroen/alien.js/master/.eslintrc.json
curl -sOL https://raw.githubusercontent.com/pschroen/alien.js/master/.gitignore
npm install
npm start
```

### Installation via ES module without transpiling

Download the [minified library](https://alien.js.org/build/alien.min.js) and include it in your HTML.

```html
<script type="module">
import { Stage, Interface, Device } from 'lib/alien.min.js';
// ...
</script>
```

### GreenSock Animation Platform

GSAP offers years of [optimizations](https://greensock.com/why-gsap), debouncing and skew compensation. The core animation system has been replaced with GSAP, but you can still use Active Theory's [method chain](https://en.wikipedia.org/wiki/Method_chaining) syntax.

```js
letters.forEach((letter, i) => {
    letter.tween({ y: -5, opacity: 0 }, 125, 'easeOutCubic', 15 * i, () => {
        letter.transform({ y: 5 }).tween({ y: 0, opacity: 1 }, 300, 'easeOutCubic');
    });
});
```

Spring animation properties `spring` (amplitude) and `damping` (period).

```js
tween(data, { radius: 24, spring: 1.2, damping: 0.4 }, 1000, 'easeOutElastic');
```

### Roadmap

* Docs
* Tests
* Particle examples
* FX and lighting
* Error handling

### Changelog

* [Releases](https://github.com/pschroen/alien.js/releases)

### Inspiration

* Active Theory's [GitHub](https://github.com/activetheory)
* Active Theory's [gists](https://gist.github.com/activetheory)
* Active Theory's [Mira](https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e)
* [Active Theory](https://activetheory.net/)
* [Dynamic import()](https://developers.google.com/web/updates/2017/11/dynamic-import)
* [ECMAScript modules in browsers](https://jakearchibald.com/2017/es-modules-in-browsers/)
* [How to Set Up Smaller, More Efficient JavaScript Bundling Using Rollup](https://code.lengstorf.com/learn-rollup-js/)

### Links

* [Website](https://alien.js.org/)

### License

Released under the [MIT license](LICENSE).


[npm]: https://img.shields.io/npm/v/alien.js.svg
[npm-url]: https://www.npmjs.com/package/alien.js
[build-status]: https://travis-ci.org/pschroen/alien.js.svg?branch=dev
[build-status-url]: https://travis-ci.org/pschroen/alien.js
[dependencies]: https://img.shields.io/david/pschroen/alien.js.svg
[dependencies-url]: https://david-dm.org/pschroen/alien.js
[dev-dependencies]: https://img.shields.io/david/dev/pschroen/alien.js.svg
[dev-dependencies-url]: https://david-dm.org/pschroen/alien.js?type=dev
