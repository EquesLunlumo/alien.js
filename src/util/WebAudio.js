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

            constructor(path) {
                const self = this;

                this.path = Assets.getPath(path);
                if (WebAudio.context.createStereoPanner) this.stereo = WebAudio.context.createStereoPanner();
                this.output = WebAudio.context.createGain();
                this.volume = 1;
                this.rate = 1;
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

                this.stop = () => {
                    if (this.source) {
                        this.source.stop();
                        this.playing = false;
                    }
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
                const sound = this.getSound(id);
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
                sounds[id] = new Sound(path);
                if (Device.os === 'ios' && callback) callback();
                else this.loadSound(id, callback);
                return sounds[id];
            };

            this.getSound = id => {
                return sounds[id];
            };

            this.trigger = id => {
                if (!context) return;
                if (context.state === 'suspended') context.resume();
                const sound = this.getSound(id);
                if (!sound.ready) this.loadSound(id);
                sound.ready().then(() => {
                    if (sound.complete) {
                        if (sound.stopping && sound.loop) {
                            sound.stopping = false;
                            return;
                        }
                        sound.playing = true;
                        sound.source = context.createBufferSource();
                        sound.source.buffer = sound.buffer;
                        sound.source.loop = sound.loop;
                        sound.source.playbackRate.setValueAtTime(sound.rate, context.currentTime);
                        sound.source.connect(sound.stereo ? sound.stereo : sound.output);
                        sound.source.start();
                        sound.output.gain.linearRampToValueAtTime(sound.volume, context.currentTime + 0.015);
                    }
                });
            };

            this.play = (id, volume = 1, loop) => {
                if (!context) return;
                if (typeof volume === 'boolean') {
                    loop = volume;
                    volume = 1;
                }
                const sound = this.getSound(id);
                if (sound) {
                    sound.volume = volume;
                    sound.loop = !!loop;
                    this.trigger(id);
                }
            };

            this.fadeInAndPlay = (id, volume, loop, time, ease, delay = 0) => {
                if (!context) return;
                const sound = this.getSound(id);
                if (sound) {
                    sound.volume = 0;
                    sound.loop = !!loop;
                    this.trigger(id);
                    tween(sound.gain, { value: volume }, time, ease, delay);
                }
            };

            this.fadeOutAndStop = (id, time, ease, delay = 0) => {
                if (!context) return;
                const sound = this.getSound(id);
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
                const sound = this.getSound(id);
                if (sound && sound.source) {
                    sound.source.buffer = null;
                    sound.source.stop();
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
                for (let id in sounds) {
                    const sound = sounds[id];
                    if (sound) sound.stop();
                }
                context.close();
            };
        }

        Stage.WebAudio = this;
    }
}

export { WebAudio };
