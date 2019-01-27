/**
 * Video interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Component } from '../util/Component.js';
import { Interface } from '../util/Interface.js';
import { Assets } from '../util/Assets.js';

class Video extends Component {

    constructor(params) {

        if (!Video.initialized) {
            Video.PLAY = 'video_play';
            Video.PAUSE = 'video_pause';
            Video.ENDED = 'video_ended';
            Video.PLAYING = 'video_playing';
            Video.PROGRESS = 'video_progress';
            Video.WAITING = 'video_waiting';
            Video.UPDATE = 'video_update';

            Video.initialized = true;
        }

        super();
        const self = this;
        const ready = Promise.create(),
            loaded = Promise.create();
        let object, video, loadingState, listeners,
            initialPlay = true;

        this.playing = false;

        initParameters();
        createElement();
        addListeners();

        function initParameters() {
            const defaults = {
                preload: false,
                autoplay: false,
                muted: true,
                loop: false,
                inline: true,
                controls: false,
                currentTime: 0,
                playback: 1,
                width: 640,
                height: 360,
                events: []
            };
            params = Object.assign(defaults, params);
        }

        function createElement() {
            video = document.createElement('video');
            video.src = Assets.getPath(params.src);
            video.crossOrigin = Assets.CORS;
            video.preload = params.preload;
            video.autoplay = params.autoplay;
            video.muted = params.autoplay || params.muted;
            video.loop = params.loop;
            video.playsinline = params.inline;
            video.controls = params.controls;
            video.width = params.width;
            video.height = params.height;
            video.defaultMuted = params.muted;
            video.defaultPlaybackRate = params.playback;

            self.element = video;
            object = new Interface(video);
            self.object = object;
            self.width = params.width;
            self.height = params.height;

            if (params.preload) startPreload();
            if (params.autoplay) startPlayback();
        }

        function addListeners() {
            listeners = { play, pause, ended, playing, progress, waiting, timeupdate, loadeddata };
            params.events.push('loadeddata');
            params.events.forEach(event => video.addEventListener(event, listeners[event], true));
        }

        function startPreload() {
            loadingState = true;
            return ready;
        }

        async function startPlayback() {
            loadingState = false;
            await ready;
            if (initialPlay) {
                initialPlay = false;
                video.currentTime = params.currentTime;
            }
            return video.play();
        }

        function play(e) {
            if (loadingState) loadingState = false;
            else self.events.fire(Video.PLAY, e, true);
        }

        function pause(e) {
            self.events.fire(Video.PAUSE, e, true);
        }

        function ended(e) {
            self.events.fire(Video.ENDED, e, true);
        }

        function playing(e) {
            self.events.fire(Video.PLAYING, e, true);
        }

        function progress(e) {
            self.events.fire(Video.PROGRESS, e, true);
        }

        function waiting(e) {
            self.events.fire(Video.WAITING, e, true);
        }

        function timeupdate(e) {
            self.events.fire(Video.UPDATE, e, true);
        }

        function loadeddata() {
            if (video.readyState >= 2) ready.resolve();
            if (video.readyState >= 4) loaded.resolve();
        }

        this.load = async () => {
            return await startPreload();
        };

        this.play = async () => {
            const promise = await startPlayback();
            this.playing = true;
            return promise;
        };

        this.pause = () => {
            this.playing = false;
            video.pause();
        };

        this.stop = () => {
            video.pause();
            this.seek(0);
        };

        this.seek = t => {
            if (video.fastSeek) video.fastSeek(t);
            else video.currentTime = t;
        };

        this.seekExact = t => {
            video.currentTime = t;
        };

        this.volume = v => {
            video.volume = v;
            if (video.muted) video.muted = false;
        };

        this.mute = () => {
            video.muted = true;
        };

        this.unmute = () => {
            video.muted = false;
        };

        this.ready = () => {
            return ready;
        };

        this.loaded = () => {
            return loaded;
        };

        this.size = (width, height) => {
            video.width = this.width = width;
            video.height = this.height = height;
        };

        this.destroy = () => {
            params.events.forEach(event => video.removeEventListener(event, listeners[event], true));
            this.stop();
            video.src = '';
            object.destroy();
            return super.destroy();
        };
    }
}

export { Video };
