/**
 * Shader 3D interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Component } from '../util/Component.js';
import { Interaction3D } from './Interaction3D.js';

class ShaderInteraction3D extends Component {

    constructor() {
        super();

        this.meshes = [];
        this.objects = [];

        function hover(e) {
            const object = self.objects[self.meshes.indexOf(e.mesh)];
            object.onOver({ action: e.action, object });
        }

        function click(e) {
            const object = self.objects[self.meshes.indexOf(e.mesh)];
            object.onClick({ action: e.action, object });
        }

        this.add = (object, camera) => {
            this.meshes.push(object.mesh);
            this.objects.push(object);
            Interaction3D.find(camera).add(object.mesh, hover, click);
        };

        this.remove = (object, camera) => {
            Interaction3D.find(camera).remove(object.mesh);
            const i = this.meshes.indexOf(object.mesh);
            if (~i) {
                this.meshes.splice(i, 1);
                this.objects.splice(i, 1);
            }
        };
    }
}

export { ShaderInteraction3D };
