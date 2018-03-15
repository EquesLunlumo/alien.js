/**
 * Webcam interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils.js';
import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Stage } from '../view/Stage.js';
import { Webcam } from './Webcam.js';

class WebcamMotion extends Component {

    static instance() {
        if (!this.singleton) this.singleton = new WebcamMotion();
        return this.singleton;
    }

    constructor(width = 64, height = 48, threshold = 80, length = 50, fps = 24) {
        super();
        const self = this;
        const gesture = {
                xDir: null,
                xValue: 0,
                yDir: null,
                yValue: 0
            },
            motion = [],
            average = {},
            lastAverage = {},
            event = {},
            callbacks = [],
            outputAverage = {};
        let webcam, oldPixels, first, outputMotion;

        if (!navigator.getUserMedia) return;
        initCamera();

        function initCamera() {
            webcam = self.initClass(Webcam, width, height, false);
            webcam.events.add(Events.READY, webcamReady);
            webcam.object.css({
                position: 'absolute',
                right: '100%'
            });
            Stage.add(webcam);
        }

        function webcamReady() {
            self.activated = true;
        }

        function loop() {
            process();
            track();
        }

        function process() {
            const pixels = webcam.getPixels().data;
            if (!first) {
                oldPixels = pixels;
                first = true;
            }
            motion.length = 0;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const w = i * width + j,
                        oldR = oldPixels[w * 4 + 0],
                        oldG = oldPixels[w * 4 + 1],
                        oldB = oldPixels[w * 4 + 2],
                        newR = pixels[w * 4 + 0],
                        newG = pixels[w * 4 + 1],
                        newB = pixels[w * 4 + 2];
                    if (Math.abs(newR - oldR) > threshold || Math.abs(newG - oldG) > threshold || Math.abs(newB - oldB) > threshold) motion.push([j, i]);
                }
            }
            oldPixels = pixels;
            let totalX = 0,
                totalY = 0;
            motion.forEach(p => {
                totalX += p[0];
                totalY += p[1];
            });
            average.x = totalX / motion.length;
            average.y = totalY / motion.length;
        }

        function track() {
            if (isNaN(average.x)) return;
            if (motion.length < length) return;
            outputAverage.x = 1 - average.x / width;
            outputAverage.y = average.y / height;
            outputMotion = Utils.cloneArray(motion);
            outputMotion.forEach(p => {
                p[0] = 1 - p[0] / width;
                p[1] /= height;
            });
            event.average = outputAverage;
            event.motion = outputMotion;
            fire('motion', event);
            if (lastAverage) {
                const diffX = lastAverage.x - average.x,
                    xDir = diffX < 0 ? 'left' : 'right';
                if (xDir !== gesture.xDir) {
                    gesture.xDir = xDir;
                    gesture.xValue = Math.abs(diffX);
                }
                gesture.xValue += Math.abs(diffX);
                if (gesture.xValue > 20) {
                    fire('gesture', gesture.xDir);
                    gesture.xValue = 0;
                }
                const diffY = lastAverage.y - average.y,
                    yDir = diffY < 0 ? 'down' : 'up';
                if (yDir !== gesture.yDir) {
                    gesture.yDir = yDir;
                    gesture.yValue = Math.abs(diffY);
                }
                gesture.yValue += Math.abs(diffY);
                if (gesture.yValue > 20) {
                    fire('gesture', gesture.yDir);
                    gesture.yValue = 0;
                }
            }
            lastAverage.x = average.x;
            lastAverage.y = average.y;
        }

        function fire(event, data) {
            for (let i = 0; i < callbacks.length; i++) if (callbacks[i].event === event) callbacks[i].callback(data);
        }

        this.start = () => {
            this.startRender(loop, fps);
        };

        this.stop = () => {
            this.stopRender(loop);
        };

        this.bind = (event, callback) => {
            callbacks.push({ event, callback });
        };

        this.unbind = (event, callback) => {
            for (let i = 0; i < callbacks.length; i++) if (callbacks[i].event === event && callbacks[i].callback === callback) callbacks.splice(i, 1)[0] = null;
        };
    }
}

export { WebcamMotion };
