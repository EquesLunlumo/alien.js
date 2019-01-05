/**
 * Web audio engine.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Device } from './Device.js';
import { Assets } from './Assets.js';
import { Stage } from '../view/Stage.js';

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

class WebAudio {

    static init() {

        class Sound {

            constructor(id, path) {
                const self = this;

                this.id = id;
                this.path = Assets.getPath(path);
                if (WebAudio.context.createStereoPanner) this.stereo = WebAudio.context.createStereoPanner();
                this.output = WebAudio.context.createGain();
                this.volume = 1;
                this.rate = 1;
                this.pan = 0;
                this.loop = false;
                if (this.stereo) this.stereo.connect(this.output);
                this.output.connect(WebAudio.output);
                this.output.gain.setValueAtTime(0, WebAudio.context.currentTime);

                this.gain = {
                    set value(value) {
                        self.volume = value;
                        self.output.gain.linearRampToValueAtTime(value, WebAudio.context.currentTime + 0.015);
                    },
                    get value() {
                        return self.volume;
                    }
                };

                this.playbackRate = {
                    set value(value) {
                        self.rate = value;
                        if (self.source) self.source.playbackRate.linearRampToValueAtTime(value, WebAudio.context.currentTime + 0.015);
                    },
                    get value() {
                        return self.rate;
                    }
                };

                this.stereoPan = {
                    set value(value) {
                        self.pan = value;
                        if (self.stereo) self.stereo.pan.linearRampToValueAtTime(value, WebAudio.context.currentTime + 0.015);
                    },
                    get value() {
                        return self.pan;
                    }
                };

                this.play = () => {
                    if (this.element) {
                        this.playing = true;
                        this.element.loop = this.loop;
                        this.element.play();
                    } else {
                        if (!this.ready) WebAudio.loadSound(this.id);
                        this.ready().then(() => {
                            if (this.complete) {
                                if (this.stopping && this.loop) {
                                    this.stopping = false;
                                    return;
                                }
                                this.playing = true;
                                this.source = WebAudio.context.createBufferSource();
                                this.source.buffer = this.buffer;
                                this.source.loop = this.loop;
                                this.source.playbackRate.setValueAtTime(this.rate, WebAudio.context.currentTime);
                                this.source.connect(this.stereo ? this.stereo : this.output);
                                this.source.start();
                            }
                        });
                    }
                    this.output.gain.linearRampToValueAtTime(this.volume, WebAudio.context.currentTime + 0.015);
                };

                this.stop = () => {
                    if (this.element) this.element.pause();
                    else this.source.stop();
                    this.playing = false;
                };
            }
        }

        if (!this.active) {
            this.active = true;

            const self = this;
            const sounds = {};
            let context;

            if (window.AudioContext) {
                context = new AudioContext();
                this.output = context.createGain();
                this.volume = 1;
                this.output.connect(context.destination);
                this.gain = {
                    set value(value) {
                        self.volume = value;
                        self.output.gain.linearRampToValueAtTime(value, context.currentTime + 0.015);
                    },
                    get value() {
                        return self.volume;
                    }
                };
                this.context = context;
            }

            this.loadSound = (id, callback) => {
                const promise = Promise.create();
                if (callback) promise.then(callback);
                callback = promise.resolve;
                const sound = sounds[id];
                window.fetch(sound.path, Assets.OPTIONS).then(response => {
                    if (!response.ok) return callback();
                    response.arrayBuffer().then(data => {
                        context.decodeAudioData(data, buffer => {
                            sound.buffer = buffer;
                            sound.complete = true;
                            callback();
                        }, () => {
                            callback();
                        });
                    });
                }).catch(() => {
                    callback();
                });
                sound.ready = () => promise;
            };

            this.createSound = (id, path, callback) => {
                sounds[id] = new Sound(id, path);
                if (Device.os === 'ios' && callback) callback();
                else this.loadSound(id, callback);
                return sounds[id];
            };

            this.createStream = (id, path) => {
                const sound = new Sound(id, path),
                    audio = document.createElement('audio');
                audio.src = sound.path;
                audio.crossOrigin = Assets.CORS;
                audio.autoplay = false;
                audio.loop = sound.loop;
                sound.source = context.createMediaElementSource(audio);
                sound.source.connect(sound.stereo ? sound.stereo : sound.output);
                sound.element = audio;
                sounds[id] = sound;
                return sounds[id];
            };

            this.getSound = id => {
                return sounds[id];
            };

            this.trigger = id => {
                if (!context) return;
                if (context.state === 'suspended') context.resume();
                const sound = sounds[id];
                if (sound) sound.play();
            };

            this.play = (id, volume = 1, loop) => {
                if (!context) return;
                if (typeof volume === 'boolean') {
                    loop = volume;
                    volume = 1;
                }
                const sound = sounds[id];
                if (sound) {
                    sound.volume = volume;
                    sound.loop = !!loop;
                    this.trigger(id);
                }
            };

            this.fadeInAndPlay = (id, volume, loop, time, ease, delay = 0) => {
                if (!context) return;
                const sound = sounds[id];
                if (sound) {
                    sound.volume = 0;
                    sound.loop = !!loop;
                    this.trigger(id);
                    tween(sound.gain, { value: volume }, time, ease, delay);
                }
            };

            this.fadeOutAndStop = (id, time, ease, delay = 0) => {
                if (!context) return;
                const sound = sounds[id];
                if (sound && sound.playing) {
                    tween(sound.gain, { value: 0 }, time, ease, delay, () => {
                        if (!sound.stopping) return;
                        sound.stopping = false;
                        sound.stop();
                    });
                    sound.stopping = true;
                }
            };

            this.remove = id => {
                const sound = sounds[id];
                if (sound && sound.source) {
                    if (sound.element) {
                        sound.element.pause();
                        sound.element.src = '';
                    } else {
                        sound.source.stop();
                        sound.source.buffer = null;
                    }
                    sound.source.disconnect();
                    sound.source = null;
                    sound.playing = false;
                    delete sounds[id];
                }
            };

            this.mute = () => {
                if (!context) return;
                tween(this.gain, { value: 0 }, 300, 'easeOutSine');
            };

            this.unmute = () => {
                if (!context) return;
                tween(this.gain, { value: 1 }, 500, 'easeOutSine');
            };

            this.stop = () => {
                this.active = false;
                if (!context) return;
                for (let id in sounds) this.remove(id);
                context.close();
            };
        }

        Stage.WebAudio = this;
    }
}

export { WebAudio };
