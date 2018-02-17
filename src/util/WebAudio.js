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

            if (window.AudioContext) context = new AudioContext();
            if (!context) return;
            this.globalGain = context.createGain();
            this.globalGain.connect(context.destination);
            this.globalGain.value = this.globalGain.gain.defaultValue;
            this.gain = {
                set value(value) {
                    self.globalGain.value = value;
                    self.globalGain.gain.setTargetAtTime(value, context.currentTime, 0.01);
                },
                get value() {
                    return self.globalGain.value;
                }
            };

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
                        sound.audioGain.gain.setTargetAtTime(value, context.currentTime, 0.01);
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
                        sound.source = context.createBufferSource();
                        sound.source.buffer = sound.buffer;
                        sound.source.connect(sound.audioGain);
                        sound.audioGain.gain.setValueAtTime(0, context.currentTime);
                        sound.source.loop = !!sound.loop;
                        sound.source.start();
                        sound.audioGain.gain.setTargetAtTime(sound.audioGain.value, context.currentTime, 0.01);
                    }
                });
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
                this.active = false;
                if (!context) return;
                for (let id in sounds) {
                    const sound = sounds[id];
                    if (sound) sound.stop();
                }
                context.close();
            };
        }

        window.WebAudio = this;
    }
}

export { WebAudio };
