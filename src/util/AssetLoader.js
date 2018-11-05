/**
 * Asset loader with promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from './Utils.js';
import { Events } from './Events.js';
import { Component } from './Component.js';
import { Assets } from './Assets.js';
import { Stage } from '../view/Stage.js';

class AssetLoader extends Component {

    constructor(assets, callback) {

        if (Array.isArray(assets)) {
            assets = (() => {
                const keys = assets.map(path => {
                    return Utils.basename(path);
                });
                return keys.reduce((object, key, i) => {
                    object[key] = assets[i];
                    return object;
                }, {});
            })();
        }

        super();
        const self = this;
        let total = Object.keys(assets).length,
            loaded = 0;

        for (let key in assets) loadAsset(key, assets[key]);

        function loadAsset(key, path) {
            const ext = Utils.extension(path);
            if (ext.includes(['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                Assets.createImage(path, increment);
                return;
            }
            if (ext.includes(['mp3', 'm4a', 'ogg', 'wav', 'aif'])) {
                if (!window.AudioContext || !Stage.WebAudio) return increment();
                Stage.WebAudio.createSound(key, path, increment);
                return;
            }
            window.get(Assets.getPath(path), Assets.OPTIONS).then(data => {
                if (ext === 'json') Assets.storeData(key, data);
                if (ext === 'js') window.eval(data.replace('use strict', ''));
                increment();
            }).catch(() => {
                increment();
            });
        }

        function increment() {
            self.percent = ++loaded / total;
            self.events.fire(Events.PROGRESS, { percent: self.percent }, true);
            if (loaded === total) complete();
        }

        function complete() {
            self.events.fire(Events.COMPLETE, null, true);
            if (callback) callback();
        }

        this.add = (num = 1) => {
            total += num;
        };

        this.trigger = (num = 1) => {
            for (let i = 0; i < num; i++) increment();
        };
    }

    static loadAssets(assets, callback) {
        const promise = Promise.create();
        if (!callback) callback = promise.resolve;
        promise.loader = new AssetLoader(assets, callback);
        return promise;
    }
}

export { AssetLoader };
