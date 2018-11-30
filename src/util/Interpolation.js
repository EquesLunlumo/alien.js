/**
 * Interpolation helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Power1, Power2, Power3, Power4, Sine, Expo, Circ, Elastic, Back, Bounce, Linear } from '../gsap/TweenMax.js';

class Interpolation {

    static getEase(ease) {
        switch (ease) {
            case 'easeInQuad':
                return Power1.easeIn;
            case 'easeInCubic':
                return Power2.easeIn;
            case 'easeInQuart':
                return Power3.easeIn;
            case 'easeInQuint':
                return Power4.easeIn;
            case 'easeInSine':
                return Sine.easeIn;
            case 'easeInExpo':
                return Expo.easeIn;
            case 'easeInCirc':
                return Circ.easeIn;
            case 'easeInElastic':
                return Elastic.easeIn;
            case 'easeInBack':
                return Back.easeIn;
            case 'easeInBounce':
                return Bounce.easeIn;
            case 'easeOutQuad':
                return Power1.easeOut;
            case 'easeOutCubic':
                return Power2.easeOut;
            case 'easeOutQuart':
                return Power3.easeOut;
            case 'easeOutQuint':
                return Power4.easeOut;
            case 'easeOutSine':
                return Sine.easeOut;
            case 'easeOutExpo':
                return Expo.easeOut;
            case 'easeOutCirc':
                return Circ.easeOut;
            case 'easeOutElastic':
                return Elastic.easeOut;
            case 'easeOutBack':
                return Back.easeOut;
            case 'easeOutBounce':
                return Bounce.easeOut;
            case 'easeInOutQuad':
                return Power1.easeInOut;
            case 'easeInOutCubic':
                return Power2.easeInOut;
            case 'easeInOutQuart':
                return Power3.easeInOut;
            case 'easeInOutQuint':
                return Power4.easeInOut;
            case 'easeInOutSine':
                return Sine.easeInOut;
            case 'easeInOutExpo':
                return Expo.easeInOut;
            case 'easeInOutCirc':
                return Circ.easeInOut;
            case 'easeInOutElastic':
                return Elastic.easeInOut;
            case 'easeInOutBack':
                return Back.easeInOut;
            case 'easeInOutBounce':
                return Bounce.easeInOut;
            case 'linear':
                return Linear.easeNone;
            default:
                return Power2.easeOut;
        }
    }

    static getRatio(ease) {
        return this.getEase(ease).getRatio;
    }

    static interpolate(num, alpha, ease) {
        const fn = this.getRatio(ease);
        return num * fn(alpha);
    }

    static interpolateValues(start, end, alpha, ease) {
        const fn = this.getRatio(ease);
        return start + (end - start) * fn(alpha);
    }
}

export { Interpolation };
