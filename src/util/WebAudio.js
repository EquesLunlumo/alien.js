/**
 * Web audio engine.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Device } from './Device.js';
import { Assets } from './Assets.js';
import { TweenManager } from '../tween/TweenManager.js';

if (!window.AudioContext) window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;

class WebAudio {

    static init() {

        class Sound {

            constructor(asset) {
                const self = this;
                this.asset = Assets.getPath(asset);
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
                        self.output.gain.setTargetAtTime(value, WebAudio.context.currentTime, 0.01);
                    },
                    get value() {
                        return self.volume;
                    }
                };
                this.playbackRate = {
                    set value(value) {
                        self.rate = value;
                        if (self.source) self.source.playbackRate.setTargetAtTime(value, WebAudio.context.currentTime, 0.01);
                    },
                    get value() {
                        return self.rate;
                    }
                };
            }

            setPanTo(value) {
                if (this.stereo) this.stereo.pan.setTargetAtTime(value, WebAudio.context.currentTime, 0.01);
            }

            stop() {
                if (this.source) {
                    this.source.stop();
                    this.playing = false;
                }
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
                        self.output.gain.setTargetAtTime(value, context.currentTime, 0.01);
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
                window.fetch(sound.asset).then(response => {
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

            this.createSound = (id, asset, callback) => {
                sounds[id] = new Sound(asset);
                if (Device.os === 'ios') callback();
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
                        defer(() => sound.output.gain.setTargetAtTime(sound.volume, context.currentTime, 0.01));
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
                    TweenManager.tween(sound.gain, { value: volume }, time, ease, delay);
                }
            };

            this.fadeOutAndStop = (id, time, ease, delay = 0) => {
                if (!context) return;
                const sound = this.getSound(id);
                if (sound && sound.playing) {
                    TweenManager.tween(sound.gain, { value: 0 }, time, ease, delay, () => {
                        if (!sound.stopping) return;
                        sound.stopping = false;
                        sound.stop();
                    });
                    sound.stopping = true;
                }
            };

            this.mute = () => {
                if (!context) return;
                TweenManager.tween(this.gain, { value: 0 }, 300, 'easeOutSine');
            };

            this.unmute = () => {
                if (!context) return;
                TweenManager.tween(this.gain, { value: 1 }, 500, 'easeOutSine');
            };

            this.stop = () => {
                if (!context) return;
                this.active = false;
                for (let id in sounds) {
                    const sound = sounds[id];
                    if (sound) sound.stop();
                }
                this.context.close();
            };
        }

        window.WebAudio = this;
    }
}

export { WebAudio };
