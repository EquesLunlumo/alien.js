/**
 * Mouse interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interaction } from './Interaction.js';
import { Stage } from '../view/Stage.js';

class Mouse {

    static init() {

        if (!this.active) {
            this.active = true;
            this.x = 0;
            this.y = 0;
            this.normal = {
                x: 0,
                y: 0
            };
            this.tilt = {
                x: 0,
                y: 0
            };
            this.inverseNormal = {
                x: 0,
                y: 0
            };

            const update = e => {
                this.x = e.x;
                this.y = e.y;
                this.normal.x = e.x / Stage.width;
                this.normal.y = e.y / Stage.height;
                this.tilt.x = this.normal.x * 2 - 1;
                this.tilt.y = 1 - this.normal.y * 2;
                this.inverseNormal.x = this.normal.x;
                this.inverseNormal.y = 1 - this.normal.y;
            };

            this.input = Stage.initClass(Interaction);
            Stage.events.add(this.input, Interaction.START, update);
            Stage.events.add(this.input, Interaction.MOVE, update);
            update({
                x: Stage.width / 2,
                y: Stage.height / 2
            });

            this.stop = () => {
                this.active = false;
                Stage.events.remove(this.input, Interaction.START, update);
                Stage.events.remove(this.input, Interaction.MOVE, update);
            };
        }

        Stage.Mouse = this;
    }
}

export { Mouse };
