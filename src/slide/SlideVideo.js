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
            self.element.play();
        }

        function playing() {
            self.playing = true;
            self.events.fire(Events.READY, null, true);
        }

        function pause() {
            self.playing = false;
        }

        this.play = () => {
            this.element.play();
        };

        this.pause = () => {
            this.element.pause();
        };

        this.ready = () => {
            return this.element.readyState > this.element.HAVE_CURRENT_DATA;
        };

        this.destroy = () => {
            if (this.element) {
                if (this.element.pause) {
                    this.element.removeEventListener('playing', playing, true);
                    this.element.removeEventListener('pause', pause, true);
                    this.pause();
                }
                URL.revokeObjectURL(this.element.src);
                this.element.src = '';
            }
            return super.destroy();
        };
    }
}

export { SlideVideo };
