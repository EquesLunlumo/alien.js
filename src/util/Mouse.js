/**
 * Mouse interaction.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Interaction } from './Interaction.js';
import { Stage } from '../view/Stage.js';

class Mouse {

    static init() {
        const self = this;
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

        this.input = new Interaction();
        Stage.events.add(this.input, Interaction.START, update);
        Stage.events.add(this.input, Interaction.MOVE, update);
        update({
            x: Stage.width / 2,
            y: Stage.height / 2
        });

        function update(e) {
            self.x = e.x;
            self.y = e.y;
            self.normal.x = e.x / Stage.width;
            self.normal.y = e.y / Stage.height;
            self.tilt.x = self.normal.x * 2 - 1;
            self.tilt.y = 1 - self.normal.y * 2;
            self.inverseNormal.x = self.normal.x;
            self.inverseNormal.y = 1 - self.normal.y;
        }
    }
}

export { Mouse };
