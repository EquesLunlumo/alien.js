/**
 * Webcam interface.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from '../util/Events.js';
import { Component } from '../util/Component.js';
import { Interface } from '../util/Interface.js';
import { Canvas } from '../canvas/Canvas.js';

if (!navigator.getUserMedia) navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

class Webcam extends Component {

    constructor(width, height, audio) {
        super();
        const self = this;

        createVideo();
        initUserMedia();

        function createVideo() {
            self.element = document.createElement('video');
            self.element.width = width;
            self.element.height = height;
            self.element.autoplay = true;
            self.object = new Interface(self.element);
        }

        function initUserMedia() {
            navigator.getUserMedia({ video: true, audio }, success, error);
        }

        function success(stream) {
            self.element.src = URL.createObjectURL(stream);
            self.events.fire(Events.READY, null, true);
        }

        function error() {
            self.events.fire(Events.ERROR, null, true);
        }

        this.size = (w, h) => {
            this.element.width = width = w;
            this.element.height = height = h;
            if (this.canvas) this.canvas.size(w, h);
        };

        this.getPixels = () => {
            if (!this.canvas) this.canvas = this.initClass(Canvas, width, height);
            this.canvas.context.drawImage(this.element, 0, 0, width, height);
            return this.canvas.context.getImageData(0, 0, width, height);
        };

        this.ready = () => {
            return this.element.readyState > 0;
        };

        this.destroy = () => {
            this.element.src = '';
            this.object.destroy();
            return super.destroy();
        };
    }
}

export { Webcam };
