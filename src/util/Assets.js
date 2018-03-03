/**
 * Assets helper class with image promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Assets {

    static init() {
        this.CDN = '';
        this.CORS = null;
        const images = {},
            json = {};

        this.getPath = src => {
            if (~src.indexOf('//')) return src;
            if (this.CDN && !~src.indexOf(this.CDN)) src = this.CDN + src;
            return src;
        };

        this.createImage = (src, store, callback) => {
            if (typeof store !== 'boolean') {
                callback = store;
                store = undefined;
            }
            const img = new Image();
            img.crossOrigin = this.CORS;
            img.src = this.getPath(src);
            img.onload = callback;
            img.onerror = callback;
            if (store) images[src] = img;
            return img;
        };

        this.getImage = src => {
            return images[src];
        };

        this.storeData = (name, data) => {
            json[name] = data;
            return json[name];
        };

        this.getData = name => {
            return json[name];
        };
    }

    static loadImage(img) {
        if (typeof img === 'string') img = this.createImage(img);
        const promise = Promise.create();
        img.onload = promise.resolve;
        img.onerror = promise.resolve;
        return promise;
    }
}

Assets.init();

export { Assets };
