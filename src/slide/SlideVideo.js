/**
 * Slide video.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Device } from '../util/Device.js';
import { Component } from '../util/Component.js';
import { Assets } from '../util/Assets.js';

class SlideVideo extends Component {

    constructor(params, callback) {

        if (!SlideVideo.initialized) {
            SlideVideo.test = SlideVideo.test || !Device.mobile && Device.browser !== 'safari' && !Device.detect('trident');

            SlideVideo.initialized = true;
        }

        super();
        const self = this;

        createElement();

        function createElement() {
            const src = params.src;
            if (src && SlideVideo.test) {
                window.fetch(Assets.getPath(src)).then(response => {
                    if (!response.ok) return error();
                    response.blob().then(data => {
                        self.element = document.createElement('video');
                        self.element.src = URL.createObjectURL(data);
                        self.element.muted = true;
                        self.element.loop = true;
                        ready();
                        if (callback) callback();
                    });
                }).catch(() => {
                    error();
                    if (callback) callback();
                });
            } else {
                const img = Assets.createImage(params.img);
                img.onload = () => {
                    self.element = img;
                    if (callback) callback();
                };
                img.onerror = error;
            }
        }

        function error() {
            self.events.fire(Events.ERROR, null, true);
        }

        function ready() {
            self.element.addEventListener('playing', playing, true);
            self.element.addEventListener('pause', pause, true);
            if (self.willPlay) self.play();
        }

        function playing() {
            self.playing = true;
            self.events.fire(Events.READY, null, true);
        }

        function pause() {
            self.playing = false;
        }

        this.resume = () => {
            this.play(true);
        };

        this.play = (resume = false) => {
            this.willPlay = true;
            if (this.element && this.element.paused && !this.playing) {
                if (!resume) this.element.currentTime = 0;
                this.element.play();
            }
        };

        this.pause = () => {
            this.willPlay = false;
            if (this.element && !this.element.paused && this.playing) this.element.pause();
        };

        this.ready = () => {
            return this.element.readyState > this.element.HAVE_CURRENT_DATA;
        };

        this.destroy = () => {
            this.element.removeEventListener('playing', playing, true);
            this.element.removeEventListener('pause', pause, true);
            this.pause();
            this.element.src = '';
            return super.destroy();
        };
    }
}

export { SlideVideo };
