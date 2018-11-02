/**
 * State dispatcher.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Events } from './Events.js';
import { Component } from './Component.js';

class StateDispatcher extends Component {

    constructor(hash) {
        super();
        const self = this;
        let storePath, storeState,
            rootPath = '/';

        this.locked = false;

        addListeners();
        storePath = getPath();

        function addListeners() {
            if (hash) window.addEventListener('hashchange', hashChange);
            else window.addEventListener('popstate', popState);
        }

        function hashChange() {
            handleStateChange(null, getPath());
        }

        function popState(e) {
            handleStateChange(e.state, getPath());
        }

        function getPath() {
            if (hash) return location.hash.slice(3);
            return (rootPath !== '/' ? location.pathname.split(rootPath)[1] : location.pathname.slice(1)) || '';
        }

        function handleStateChange(state, path) {
            if (path === storePath) return;
            if (self.locked) {
                if (!storePath) return;
                if (hash) location.hash = '!/' + storePath;
                else history.pushState(storeState, null, rootPath + storePath);
                return;
            }
            storePath = path;
            storeState = state;
            self.events.fire(Events.UPDATE, { value: state, path }, true);
        }

        this.getState = () => {
            const path = getPath();
            return { value: storeState, path };
        };

        this.setRoot = root => {
            rootPath = root.charAt(0) === '/' ? root : '/' + root;
        };

        this.setState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path === storePath) return;
            storePath = path;
            storeState = state;
            if (hash) location.hash = '!/' + path;
            else history.pushState(state, null, rootPath + path);
        };

        this.replaceState = (state, path) => {
            if (typeof state !== 'object') {
                path = state;
                state = null;
            }
            if (path === storePath) return;
            storePath = path;
            storeState = state;
            if (hash) location.hash = '!/' + path;
            else history.replaceState(state, null, rootPath + path);
        };

        this.setTitle = title => document.title = title;

        this.lock = () => this.locked = true;

        this.unlock = () => this.locked = false;

        this.useHash = () => hash = true;

        this.destroy = () => {
            window.removeEventListener('hashchange', hashChange);
            window.removeEventListener('popstate', popState);
            return super.destroy();
        };
    }
}

export { StateDispatcher };
