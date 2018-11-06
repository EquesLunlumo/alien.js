/**
 * Background video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Device } from '../util/Device.js';
import { Interface } from '../util/Interface.js';
import { Video } from './Video.js';

class BackgroundVideo extends Interface {

    constructor(params) {

        if (!BackgroundVideo.initialized) {
            BackgroundVideo.test = BackgroundVideo.test || !Device.mobile;

            BackgroundVideo.initialized = true;
        }

        super('.BackgroundVideo');
        const self = this;
        let cover, wrapper, video,
            tick = 0;

        this.fade = params.fade !== false;

        initHTML();
        if (BackgroundVideo.test) {
            initVideo();
            if (this.fade) addListeners();
        }

        function initHTML() {
            self.size('100%').mouseEnabled(false);
            cover = self.create('.cover');
            cover.size('100%').bg(params.img || '#000', 'cover');
        }

        function initVideo() {
            wrapper = self.create('.wrapper');
            wrapper.size('100%');
            if (self.fade) wrapper.css({ opacity: 0 });
            video = wrapper.initClass(Video, {
                src: params.src,
                loop: params.loop !== false,
                events: ['timeupdate', 'ended'],
                width: params.width,
                height: params.height,
                preload: true
            });
            video.object.css({ position: 'absolute' });
            self.video = video;
        }

        function addListeners() {
            self.events.add(video, Video.UPDATE, update);
        }

        function update() {
            if (tick++ < 10) return;
            self.events.remove(video, Video.UPDATE, update);
            wrapper.tween({ opacity: params.opacity || 1 }, 500, 'easeOutSine', () => {
                if (!params.opacity) wrapper.clearOpacity();
            });
        }

        this.play = async () => {
            if (!video) return;
            return await video.play();
        };

        this.pause = () => {
            if (!video) return;
            video.pause();
        };

        this.size = (w, h) => {
            if (!video) return;
            video.height = h;
            video.width = video.height * (params.width / params.height);
            if (video.width < w) {
                video.width = w;
                video.height = video.width * (params.height / params.width);
            }
            cover.size(video.width, video.height).center();
            video.object.size(video.width, video.height).center();
        };
    }
}

export { BackgroundVideo };
