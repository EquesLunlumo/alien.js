/**
 * Alien.js Example Project.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events, Stage, Interface, Device, Utils, Assets, BackgroundVideo, AssetLoader, FontLoader } from '../alien.js/src/Alien.js';

//Assets.CDN = Config.CDN;
Assets.CORS = 'anonymous';
Assets.OPTIONS = {
    mode: 'cors',
    //credentials: 'include'
};

BackgroundVideo.test = true; // Load video regardless


class Copy extends Interface {

    constructor(copy, size = 13.5, color = 'white') {
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
        const ratio = 540 / 960;
        let background;

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
            background = self.initClass(BackgroundVideo, {
                src: `assets/videos/${data.id}.mp4`,
                img: `assets/videos/${data.id}.jpg`,
                width: 960,
                height: 540
            });
            background.play();
        }

        function addListeners() {
            self.interact(null, () => {
                background.video.seek(0);
                background.video.play();
            });
        }

        this.resize = () => {
            let width, height;
            if (Device.mobile && document.documentElement.offsetWidth > document.documentElement.offsetHeight) {
                width = Projects.WIDTH * 0.7;
                height = Projects.WIDTH * 0.7 * ratio;
                this.size(width, height).center(1, 0);
            } else {
                width = Projects.WIDTH;
                height = Projects.WIDTH * ratio;
                this.size(width, height).css({ left: '', top: '', marginLeft: '', marginTop: '' });
            }
            background.size(width, height);
        };
    }
}

class ProjectLayout extends Interface {

    constructor(data) {
        super('.ProjectLayout');
        const self = this;
        let video;

        initHTML();
        initViews();

        function initHTML() {
            self.css({
                position: 'relative',
                width: '100%',
                height: 'auto',
                paddingBottom: 120
            });
        }

        function initViews() {
            video = self.initClass(ProjectVideo, data);
            self.initClass(Title, data.title);
            self.initClass(Headline, data.headline);
            self.initClass(Copy, data.text);
        }

        this.resize = () => {
            video.resize();
        };
    }
}

class TitleLayout extends Interface {

    constructor(data = Config.DATA) {
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
            self.initClass(Title, data.title, 90);
            self.initClass(Copy, data.text).css({ marginTop: 0, marginBottom: 0, paddingTop: 20, paddingBottom: 55 });
        }
    }
}

class Projects extends Interface {

    constructor() {
        super('Projects');
        const self = this;
        const projects = [];

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
            Config.DATA.projects.forEach(data => {
                const project = self.initClass(ProjectLayout, data);
                projects.push(project);
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
            projects.forEach(project => project.resize());
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

        initContainer();
        initView();

        function initContainer() {
            Stage.allowScroll();
            Stage.css({ position: '', overflow: '', opacity: 0 });
            self.size('100%', 'auto');
            Stage.add(self);
            window.history.scrollRestoration = 'manual';
        }

        function initView() {
            self.initClass(Projects);

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
                    { family: 'Roboto', style: 'normal', weight: '400' },
                    { family: 'Oswald', style: 'normal', weight: '200' },
                    { family: 'Karla', style: 'normal', weight: '400' }
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
