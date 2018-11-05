/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Timer, Events, Stage, Interface, Video, Device, Utils, Assets, AssetLoader, FontLoader } from '../alien.js/src/Alien.js';

//Assets.CDN = Config.CDN;
Assets.CORS = 'anonymous';
Assets.OPTIONS = {
    mode: 'cors',
    //credentials: 'include'
};


class Copy extends Interface {

    constructor(copy, size = 14, color = 'white') {
        super('.Copy');
        const self = this;
        let text;

        initHTML();

        function initHTML() {
            self.css({
                position: 'relative',
                width: '80%',
                height: 'auto',
                maxWidth: 510,
                margin: '20px auto 100px',
                paddingBottom: 20
            });
            text = self.create('.text');
            text.fontStyle('Roboto', size, color);
            text.css({
                position: 'relative',
                fontWeight: '400',
                lineHeight: '1.7',
                textAlign: 'left'
            });
            text.html(copy);
        }

        this.update = e => {
            text.html(e);
        };
    }
}

class Headline extends Interface {

    constructor(copy, size = 14, color = 'white') {
        super('.Headline');
        const self = this;
        let text;

        initHTML();

        function initHTML() {
            self.css({
                position: 'relative',
                width: '80%',
                height: 'auto',
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingBottom: 10
            });
            text = self.create('.text');
            text.fontStyle('Karla', size, color);
            text.css({
                position: 'relative',
                fontWeight: '400',
                lineHeight: '1.1',
                textAlign: 'center'
            });
            text.html(copy);
        }

        this.update = e => {
            text.html(e);
        };
    }
}

class Title extends Interface {

    constructor(copy, size = 66, color = 'white') {
        super('.Title');
        const self = this;
        let text;

        initHTML();

        function initHTML() {
            self.css({
                position: 'relative',
                width: '100%',
                height: 'auto',
                marginTop: 50,
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingBottom: 27
            });
            text = self.create('.text');
            text.fontStyle('Oswald', size, color);
            text.css({
                position: 'relative',
                fontWeight: '200',
                lineHeight: '1.1',
                textAlign: 'center'
            });
            text.html(copy);
        }

        this.update = e => {
            text.html(e);
        };
    }
}

class ProjectVideo extends Interface {

    constructor(data) {
        super('.Video');
        const self = this;
        const ratio = 1080 / 1920;
        let video;

        initHTML();
        initVideo();
        addListeners();

        function initHTML() {
            self.css({
                position: 'relative',
                display: 'block',
                marginBottom: 20
            });
        }

        function initVideo() {
            video = self.initClass(Video, {
                src: `assets/videos/${data.video}`,
                loop: true
            });
            video.play();
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            self.events.add(ProjectLayout.SCROLL, scroll);
            self.interact(null, () => {
                video.seek(0);
                video.play();
            });
            defer(resize);
        }

        function scroll() {
            const rect = video.element.getBoundingClientRect();
            if (rect.top >= 0 && rect.left >= 0 && rect.right <= window.innerWidth && rect.bottom <= window.innerHeight) {
                if (!video.playing) video.play();
            } else {
                if (video.playing) video.pause();
            }
        }

        function resize() {
            let width, height;
            if (Device.mobile && document.documentElement.offsetWidth > document.documentElement.offsetHeight) {
                width = Projects.WIDTH * 0.7;
                height = Projects.WIDTH * 0.7 * ratio;
                self.size(width, height).center(1, 0);
            } else {
                width = Projects.WIDTH;
                height = Projects.WIDTH * ratio;
                self.size(width, height).css({ left: '', top: '', marginLeft: '', marginTop: '' });
            }
            video.size(width, height);
        }
    }
}

class ProjectLayout extends Interface {

    constructor(data = Config.DATA[0]) {
        super('.ProjectLayout');
        const self = this;
        let timeout;

        initHTML();
        initViews();
        addListeners();

        function initHTML() {
            self.css({
                position: 'relative',
                width: '100%',
                height: 'auto',
                paddingBottom: 120
            });
        }

        function initViews() {
            self.initClass(ProjectVideo, data);
            self.initClass(Title, data.title);
            self.initClass(Headline, data.headline);
            self.initClass(Copy, data.text);
        }

        function addListeners() {
            window.addEventListener('scroll', () => {
                if (self.debounce) return;
                self.events.fire(ProjectLayout.SCROLL);
                self.debounce = true;
                Timer.clearTimeout(timeout);
                timeout = self.delayedCall(() => self.debounce = !self.debounce, 30);
            });
        }
    }
}

ProjectLayout.SCROLL = 'scroll';

class TitleLayout extends Interface {

    constructor() {
        super('TitleLayout');
        const self = this;

        initHTML();
        initViews();

        function initHTML() {
            self.css({
                position: 'relative',
                width: '100%',
                height: 'auto',
                marginTop: Device.mobile ? 100 : 180,
                marginBottom: 90
            });
        }

        function initViews() {
            self.initClass(Title, 'Long Scroll', 90);
            self.initClass(Copy, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
                .css({ marginTop: 0, marginBottom: 0, paddingTop: 20, paddingBottom: 55 });
        }
    }
}

class Projects extends Interface {

    constructor() {
        super('Projects');
        const self = this;

        initHTML();
        initTitle();
        initProjects();
        addListeners();

        function initHTML() {
            self.size(document.documentElement.offsetWidth * 0.75, 'auto').center(1, 0);
        }

        function initTitle() {
            self.initClass(TitleLayout);
        }

        function initProjects() {
            Config.DATA.forEach(data => {
                self.initClass(ProjectLayout, data);
            });
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            if (document.documentElement.offsetWidth > 850) {
                Projects.WIDTH = document.documentElement.offsetWidth * 0.75;
                self.size(Projects.WIDTH, 'auto').center(1, 0);
            } else {
                Projects.WIDTH = document.documentElement.offsetWidth;
                self.size('100%').css({ left: '', top: '', marginLeft: '', marginTop: '' });
            }
        }
    }
}

class Container extends Interface {

    static instance() {
        if (!this.singleton) this.singleton = new Container();
        return this.singleton;
    }

    constructor() {
        super('Container');
        const self = this;

        initHTML();
        initView();

        function initHTML() {
            Stage.allowScroll();
            Stage.css({ position: '', overflow: '', opacity: 0 });
            self.size('100%', 'auto');
            Stage.add(self);

            self.initClass(Projects);
        }

        function initView() {
            Stage.tween({ opacity: 1 }, 1500, 'easeInOutSine', () => {
                Stage.clearOpacity();
            });
        }
    }
}

class Main {

    constructor() {

        init();

        function init() {
            Promise.all([
                FontLoader.loadFonts([
                    { font: 'Roboto', style: 'normal', weight: '400' },
                    { font: 'Oswald', style: 'normal', weight: '200' },
                    { font: 'Karla', style: 'normal', weight: '400' }
                ]),
                AssetLoader.loadAssets([`assets/data/data.json?${Utils.timestamp()}`])
            ]).then(() => {
                Config.DATA = Assets.getData('data');

                Container.instance();
            });
        }
    }
}

new Main();
