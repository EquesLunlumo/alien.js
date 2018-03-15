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

        if (!this.active) {
            this.active = true;

            const self = this;
            const sounds = {};
            let context;

            if (window.AudioContext) {
                context = new AudioContext();
                this.globalGain = context.createGain();
                this.globalGain.connect(context.destination);
                this.globalGain.value = this.globalGain.gain.defaultValue;
                this.gain = {
                    set value(value) {
                        self.globalGain.value = value;
                        self.globalGain.gain.cancelScheduledValues(context.currentTime);
                        self.globalGain.gain.setValueAtTime(self.globalGain.gain.value, context.currentTime);
                        self.globalGain.gain.setTargetAtTime(value, context.currentTime, 0.1);
                    },
                    get value() {
                        return self.globalGain.value;
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
                        });
                    });
                }).catch(() => {
                    callback();
                });
                sound.ready = () => promise;
            };

            this.createSound = (id, asset, callback) => {
                const sound = {};
                sound.asset = Assets.getPath(asset);
                sound.audioGain = context.createGain();
                sound.audioGain.connect(this.globalGain);
                sound.audioGain.value = sound.audioGain.gain.defaultValue;
                sound.gain = {
                    set value(value) {
                        sound.audioGain.value = value;
                        sound.audioGain.gain.cancelScheduledValues(context.currentTime);
                        sound.audioGain.gain.setValueAtTime(sound.audioGain.gain.value, context.currentTime);
                        sound.audioGain.gain.setTargetAtTime(value, context.currentTime, 0.1);
                    },
                    get value() {
                        return sound.audioGain.value;
                    }
                };
                sound.stop = () => {
                    if (sound.source) sound.source.stop();
                };
                sounds[id] = sound;
                if (Device.os === 'ios') callback();
                else this.loadSound(id, callback);
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
                        sound.audioGain.gain.cancelScheduledValues(context.currentTime);
                        sound.audioGain.gain.setValueAtTime(0, context.currentTime);
                        sound.source = context.createBufferSource();
                        sound.source.buffer = sound.buffer;
                        sound.source.loop = !!sound.loop;
                        sound.source.connect(sound.audioGain);
                        sound.source.start();
                        sound.audioGain.gain.setTargetAtTime(sound.audioGain.value, context.currentTime, 0.1);
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
                    sound.gain.value = volume;
                    sound.loop = !!loop;
                    this.trigger(id);
                }
            };

            this.fadeInAndPlay = (id, volume, loop, time, ease, delay = 0) => {
                if (!context) return;
                const sound = this.getSound(id);
                if (sound) {
                    sound.gain.value = 0;
                    sound.loop = !!loop;
                    this.trigger(id);
                    TweenManager.tween(sound.gain, { value: volume }, time, ease, delay);
                }
            };

            this.fadeOutAndStop = (id, time, ease, delay = 0) => {
                if (!context) return;
                const sound = this.getSound(id);
                if (sound) TweenManager.tween(sound.gain, { value: 0 }, time, ease, delay, () => sound.stop());
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
