/**
 * Browser detection and helper functions.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Device {

    static init() {
        this.agent = navigator.userAgent.toLowerCase();
        this.pixelRatio = window.devicePixelRatio;
        this.webcam = !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        this.language = navigator.userLanguage || navigator.language;
        this.webaudio = !!window.AudioContext;
        this.os = (() => {
            if (this.detect(['iphone', 'ipad'])) return 'ios';
            if (this.detect(['android'])) return 'android';
            if (this.detect(['blackberry'])) return 'blackberry';
            if (this.detect(['mac os'])) return 'mac';
            if (this.detect(['windows'])) return 'windows';
            if (this.detect(['linux'])) return 'linux';
            return 'unknown';
        })();
        this.browser = (() => {
            if (this.os === 'ios') {
                if (this.detect(['safari'])) return 'safari';
                return 'unknown';
            }
            if (this.os === 'android') {
                if (this.detect(['chrome'])) return 'chrome';
                if (this.detect(['firefox'])) return 'firefox';
                return 'browser';
            }
            if (this.detect(['msie'])) return 'ie';
            if (this.detect(['trident']) && this.detect(['rv:'])) return 'ie';
            if (this.detect(['windows']) && this.detect(['edge'])) return 'ie';
            if (this.detect(['chrome'])) return 'chrome';
            if (this.detect(['safari'])) return 'safari';
            if (this.detect(['firefox'])) return 'firefox';
            return 'unknown';
        })();
        this.mobile = this.detect(['iphone', 'ipad', 'android', 'blackberry']);
        if (this.mobile) {
            this.tablet = Math.max(window.screen ? screen.width : window.innerWidth, window.screen ? screen.height : window.innerHeight) > 1000;
            this.phone = !this.tablet;
        }
        this.webgl = (() => {
            try {
                const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'],
                    canvas = document.createElement('canvas');
                let gl;
                for (let i = 0; i < names.length; i++) {
                    gl = canvas.getContext(names[i]);
                    if (gl) break;
                }
                const info = gl.getExtension('WEBGL_debug_renderer_info'),
                    output = {};
                if (info) output.gpu = gl.getParameter(info.UNMASKED_RENDERER_WEBGL).toLowerCase();
                output.renderer = gl.getParameter(gl.RENDERER).toLowerCase();
                output.version = gl.getParameter(gl.VERSION).toLowerCase();
                output.glsl = gl.getParameter(gl.SHADING_LANGUAGE_VERSION).toLowerCase();
                output.extensions = gl.getSupportedExtensions();
                output.detect = matches => {
                    if (output.gpu && output.gpu.includes(matches)) return true;
                    if (output.version && output.version.includes(matches)) return true;
                    for (let i = 0; i < output.extensions.length; i++) if (output.extensions[i].toLowerCase().includes(matches)) return true;
                    return false;
                };
                return output;
            } catch (e) {
                return false;
            }
        })();
    }

    static detect(matches) {
        return this.agent.includes(matches);
    }

    static vibrate(time) {
        if (navigator.vibrate) navigator.vibrate(time);
    }
}

Device.init();

export { Device };
