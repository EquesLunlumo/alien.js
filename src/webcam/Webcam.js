/**
 * Webcam interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Device } from '../util/Device.js';
import { Component } from '../util/Component.js';
import { Interface } from '../util/Interface.js';
import { Canvas } from '../canvas/Canvas.js';

if (!navigator.getUserMedia) navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

class Webcam extends Component {

    constructor(width, height, audio) {
        super();
        const self = this;
        this.facing = 'back';
        const cameras = {};
        let back = false,
            attempts = 0;

        createVideo();

        function createVideo() {
            self.element = document.createElement('video');
            self.element.width = width;
            self.element.height = height;
            self.element.autoplay = true;
            self.object = new Interface(self.element);
            self.width = width;
            self.height = height;
            self.object.size(self.width, self.height);
            if (!Device.mobile) self.object.transform({ scaleX: -1 });
        }

        function establishWebcam() {
            if (attempts >= 2) return error();
            lookupDevices().then(() => {
                if (self.stream && self.config.back) self.stream.getTracks()[0].stop();
                navigator.getUserMedia({
                    video: self.config.back ? cameras.back : cameras.front || true,
                    audio
                }, success, error);
            });
            attempts += 1;
        }

        function lookupDevices() {
            const promise = Promise.create();
            if (!Device.mobile) return Promise.resolve();
            navigator.mediaDevices.enumerateDevices().then(devices => {
                devices.forEach(device => {
                    if (device.label.includes('front')) {
                        cameras.front = {
                            deviceId: { exact: device.deviceId }
                        };
                    }
                    if (device.label.includes('back')) {
                        cameras.back = {
                            deviceId: { exact: device.deviceId }
                        };
                        back = true;
                    }
                });
                if (!cameras.front) {
                    cameras.front = {
                        facingMode: 'user'
                    };
                }
                if (!cameras.back) {
                    cameras.back = {
                        facingMode: 'environment'
                    };
                    back = false;
                }
                promise.resolve();
            });
            return promise;
        }

        function success(stream) {
            self.denied = false;
            self.stream = stream;
            if (self.config.back && !back) {
                establishWebcam();
            } else {
                self.element.srcObject = stream;
                self.events.fire(Events.READY, null, true);
            }
        }

        function error() {
            self.denied = true;
            self.events.fire(Events.ERROR, null, true);
        }

        this.createStream = config => {
            attempts = 0;
            this.config = config;
            establishWebcam();
        };

        this.flip = () => {
            if (!back) return;
            let direction;
            if (this.facing === 'front') {
                this.facing = 'back';
                direction = cameras.back;
            } else {
                this.facing = 'front';
                direction = cameras.front;
            }
            this.stream.getTracks()[0].stop();
            navigator.getUserMedia({
                video: direction || true,
                audio
            }, success, error);
        };

        this.size = (w, h) => {
            this.element.width = this.width = w;
            this.element.height = this.height = h;
            this.object.size(this.width, this.height);
        };

        this.getPixels = (w = this.width, h = this.height) => {
            if (!this.canvas) this.canvas = this.initClass(Canvas, w, h);
            this.canvas.context.drawImage(this.element, 0, 0, w, h);
            return this.canvas.context.getImageData(0, 0, w, h);
        };

        this.ready = () => {
            return this.element.readyState > 0;
        };

        this.end = () => {
            this.active = false;
            this.element.pause();
            if (this.stream) this.stream.getTracks()[0].enabled = false;
        };

        this.restart = () => {
            this.element.play();
            if (this.stream) this.stream.getTracks()[0].enabled = true;
            this.active = true;
        };

        this.destroy = () => {
            this.element.src = '';
            this.object.destroy();
            return super.destroy();
        };
    }
}

export { Webcam };
