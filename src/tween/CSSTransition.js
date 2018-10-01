/**
 * CSS3 transition animation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils.js';
import { Timer } from '../util/Timer.js';
import { TweenManager } from './TweenManager.js';

class CSSTransition {

    constructor(object, props, time, ease, delay, callback) {
        const self = this;
        let transformProps, transitionProps;

        this.playing = true;

        initProperties();
        initCSSTween();

        function killed() {
            return !self || self.kill || !object || !object.element;
        }

        function initProperties() {
            const transform = TweenManager.getAllTransforms(object),
                properties = [];
            for (let key in props) {
                if (TweenManager.isTransform(key)) {
                    transform.use = true;
                    transform[key] = props[key];
                    delete props[key];
                } else if (typeof props[key] === 'number' || ~key.indexOf('-')) {
                    properties.push(key);
                }
            }
            if (transform.use) {
                properties.push('transform');
                delete transform.use;
            }
            transformProps = transform;
            transitionProps = properties;
        }

        function initCSSTween() {
            if (killed()) return;
            if (object.cssTween) object.cssTween.stop();
            object.cssTween = self;
            const strings = buildStrings(time, ease, delay);
            object.willChange(strings.props);
            Timer.create(() => {
                if (killed()) return;
                object.element.style.transition = strings.transition;
                object.css(props);
                object.transform(transformProps);
                Timer.create(() => {
                    if (killed()) return;
                    tweenComplete();
                }, time + delay);
            }, 35);
        }

        function buildStrings(time, ease, delay) {
            let props = '',
                transition = '';
            for (let i = 0; i < transitionProps.length; i++) {
                const transitionProp = transitionProps[i];
                props += (props.length ? ', ' : '') + transitionProp;
                transition += (transition.length ? ', ' : '') + transitionProp + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
            }
            return {
                props,
                transition
            };
        }

        function tweenComplete() {
            self.playing = false;
            Timer.create(() => {
                if (killed()) return;
                if (object.cssTween && !object.cssTween.playing) clearCSSTween();
            }, 1000);
            if (callback) callback();
        }

        function clearCSSTween() {
            if (killed()) return;
            self.kill = true;
            object.element.style.transition = '';
            object.willChange(null);
            object.cssTween = null;
            object = props = null;
            Utils.nullObject(self);
        }

        this.stop = clearCSSTween;
    }
}

export { CSSTransition };
