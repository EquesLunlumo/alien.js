/**
 * State dispatcher.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events.js';
import { Component } from './Component.js';

class StateDispatcher extends Component {

    constructor(forceHash) {
        super();
        const self = this;
        this.locked = false;
        let storePath, storeState,
            rootPath = '/';

        createListener();
        storePath = getPath();

        function createListener() {
            if (forceHash) window.addEventListener('hashchange', hashChange, true);
            else window.addEventListener('popstate', popState, true);
        }

        function hashChange() {
            handleStateChange(null, getPath());
        }

        function popState(e) {
            handleStateChange(e.state, getPath());
        }

        function getPath() {
            if (forceHash) return location.hash.slice(3);
            return rootPath !== '/' ? location.pathname.split(rootPath)[1] : location.pathname.slice(1) || '';
        }

        function handleStateChange(state, path) {
            if (path !== storePath) {
                if (!self.locked) {
                    storePath = path;
                    storeState = state;
                    self.events.fire(Events.UPDATE, { value: state, path }, true);
                } else if (storePath) {
                    if (forceHash) location.hash = '!/' + storePath;
                    else history.pushState(storeState, null, rootPath + storePath);
                }
            }
        }

        this.getState = () => {
            const path = getPath();
            return { value: storeState, path };
        };

        this.setState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path !== storePath) {
                storePath = path;
                storeState = state;
                if (forceHash) location.hash = '!/' + path;
                else history.pushState(state, null, rootPath + path);
            }
        };

        this.replaceState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path !== storePath) {
                storePath = path;
                storeState = state;
                if (forceHash) history.replaceState(null, null, '#!/' + path);
                else history.replaceState(state, null, rootPath + path);
            }
        };

        this.setTitle = title => document.title = title;

        this.lock = () => this.locked = true;

        this.unlock = () => this.locked = false;

        this.forceHash = () => forceHash = true;

        this.setPathRoot = path => {
            if (path.charAt(0) === '/') rootPath = path;
            else rootPath = '/' + path;
        };

        this.destroy = () => {
            window.removeEventListener('hashchange', hashChange, true);
            window.removeEventListener('popstate', popState, true);
            return super.destroy();
        };
    }
}

export { StateDispatcher };
