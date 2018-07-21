/**
 * Video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events.js';
import { Device } from './Device.js';
import { Component } from './Component.js';
import { Interface } from './Interface.js';
import { Assets } from './Assets.js';

class Video extends Component {

    constructor(params) {
        super();
        const self = this;
        const event = {};
        let lastTime, buffering, seekTo, forceRender,
            tick = 0;

        this.loaded = {
            start: 0,
            end: 0,
            percent: 0
        };

        createElement();
        if (params.preload !== false) preload();

        function createElement() {
            const src = params.src;
            self.element = document.createElement('video');
            if (src) self.element.src = Assets.getPath(src);
            self.element.controls = params.controls;
            self.element.id = params.id || '';
            self.element.width = params.width;
            self.element.height = params.height;
            self.element.loop = params.loop;
            self.object = new Interface(self.element);
            self.width = params.width;
            self.height = params.height;
            self.object.size(self.width, self.height);
            if (Device.mobile) {
                self.object.attr('webkit-playsinline', true);
                self.object.attr('playsinline', true);
            }
        }

        function preload() {
            self.element.preload = 'auto';
            self.element.load();
        }

        function step() {
            if (!self.element) return self.stopRender(step);
            self.duration = self.element.duration;
            self.time = self.element.currentTime;
            if (self.element.currentTime === lastTime) {
                tick++;
                if (tick > 30 && !buffering) {
                    buffering = true;
                    self.events.fire(Events.ERROR, null, true);
                }
            } else {
                tick = 0;
                if (buffering) {
                    self.events.fire(Events.READY, null, true);
                    buffering = false;
                }
            }
            lastTime = self.element.currentTime;
            if (self.element.currentTime >= (self.duration || self.element.duration) - 0.001) {
                if (!self.loop) {
                    if (!forceRender) self.stopRender(step);
                    self.events.fire(Events.COMPLETE, null, true);
                }
            }
            event.time = self.element.currentTime;
            event.duration = self.element.duration;
            event.loaded = self.loaded;
            self.events.fire(Events.UPDATE, event, true);
        }

        function checkReady() {
            if (!self.element) return false;
            if (!seekTo) {
                self.buffered = self.element.readyState === self.element.HAVE_ENOUGH_DATA;
            } else {
                const seekable = self.element.seekable;
                let max = -1;
                if (seekable) {
                    for (let i = 0; i < seekable.length; i++) if (seekable.start(i) < seekTo) max = seekable.end(i) - 0.5;
                    if (max >= seekTo) self.buffered = true;
                } else {
                    self.buffered = true;
                }
            }
            if (self.buffered) {
                self.stopRender(checkReady);
                self.events.fire(Events.READY, null, true);
            }
        }

        function handleProgress() {
            if (!self.ready()) return;
            const bf = self.element.buffered,
                time = self.element.currentTime;
            let range = 0;
            while (!(bf.start(range) <= time && time <= bf.end(range))) range += 1;
            self.loaded.start = bf.start(range) / self.element.duration;
            self.loaded.end = bf.end(range) / self.element.duration;
            self.loaded.percent = self.loaded.end - self.loaded.start;
            self.events.fire(Events.PROGRESS, self.loaded, true);
        }

        this.play = () => {
            this.playing = true;
            this.element.play();
            this.startRender(step);
        };

        this.pause = () => {
            this.playing = false;
            this.element.pause();
            this.stopRender(step);
        };

        this.stop = () => {
            this.playing = false;
            this.element.pause();
            this.stopRender(step);
            if (this.ready()) this.element.currentTime = 0;
        };

        this.volume = v => {
            this.element.volume = v;
            if (this.muted) {
                this.muted = false;
                this.object.attr('muted', '');
            }
        };

        this.mute = () => {
            this.volume(0);
            this.muted = true;
            this.object.attr('muted', true);
        };

        this.seek = t => {
            if (this.element.readyState <= 1) {
                this.delayedCall(() => {
                    if (this.seek) this.seek(t);
                }, 32);
                return;
            }
            this.element.currentTime = t;
        };

        this.canPlayTo = t => {
            seekTo = null;
            if (t) seekTo = t;
            if (!this.buffered) this.startRender(checkReady);
            return this.buffered;
        };

        this.ready = () => {
            return this.element.readyState > this.element.HAVE_CURRENT_DATA;
        };

        this.size = (w, h) => {
            this.element.width = this.width = w;
            this.element.height = this.height = h;
            this.object.size(this.width, this.height);
        };

        this.forceRender = () => {
            forceRender = true;
            this.startRender(step);
        };

        this.trackProgress = () => {
            this.element.addEventListener('progress', handleProgress);
        };

        this.destroy = () => {
            this.element.removeEventListener('progress', handleProgress);
            this.stop();
            this.element.src = '';
            this.object.destroy();
            return super.destroy();
        };
    }

    set loop(bool) {
        this.element.loop = bool;
    }

    get loop() {
        return this.element.loop;
    }

    set src(src) {
        this.element.src = Assets.getPath(src);
    }

    get src() {
        return this.element.src;
    }
}

export { Video };
