/**
 * Accelerometer helper class.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Device } from '../util/Device.js';

class Accelerometer {

    static init() {

        if (!this.active) {
            this.active = true;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.alpha = 0;
            this.beta = 0;
            this.gamma = 0;
            this.heading = 0;
            this.rotationRate = {};
            this.rotationRate.alpha = 0;
            this.rotationRate.beta = 0;
            this.rotationRate.gamma = 0;
            this.toRadians = Device.os === 'ios' ? Math.PI / 180 : 1;

            const updateAccel = e => {
                switch (window.orientation) {
                    case 0:
                        this.x = -e.accelerationIncludingGravity.x;
                        this.y = e.accelerationIncludingGravity.y;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = e.rotationRate.beta * this.toRadians;
                            this.rotationRate.beta = -e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                    case 180:
                        this.x = e.accelerationIncludingGravity.x;
                        this.y = -e.accelerationIncludingGravity.y;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = -e.rotationRate.beta * this.toRadians;
                            this.rotationRate.beta = e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                    case 90:
                        this.x = e.accelerationIncludingGravity.y;
                        this.y = e.accelerationIncludingGravity.x;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.beta = e.rotationRate.beta * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                    case -90:
                        this.x = -e.accelerationIncludingGravity.y;
                        this.y = -e.accelerationIncludingGravity.x;
                        this.z = e.accelerationIncludingGravity.z;
                        if (e.rotationRate) {
                            this.rotationRate.alpha = -e.rotationRate.alpha * this.toRadians;
                            this.rotationRate.beta = -e.rotationRate.beta * this.toRadians;
                            this.rotationRate.gamma = e.rotationRate.gamma * this.toRadians;
                        }
                        break;
                }
            };

            const updateOrientation = e => {
                for (let key in e) if (~key.toLowerCase().indexOf('heading')) this.heading = e[key];
                switch (window.orientation) {
                    case 0:
                        this.alpha = e.beta * this.toRadians;
                        this.beta = -e.alpha * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                    case 180:
                        this.alpha = -e.beta * this.toRadians;
                        this.beta = e.alpha * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                    case 90:
                        this.alpha = e.alpha * this.toRadians;
                        this.beta = e.beta * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                    case -90:
                        this.alpha = -e.alpha * this.toRadians;
                        this.beta = -e.beta * this.toRadians;
                        this.gamma = e.gamma * this.toRadians;
                        break;
                }
                this.tilt = e.beta * this.toRadians;
                this.yaw = e.alpha * this.toRadians;
                this.roll = -e.gamma * this.toRadians;
                if (Device.os === 'Android') this.heading = compassHeading(e.alpha, e.beta, e.gamma);
            };

            const compassHeading = (alpha, beta, gamma) => {
                const degtorad = Math.PI / 180,
                    x = beta ? beta * degtorad : 0,
                    y = gamma ? gamma * degtorad : 0,
                    z = alpha ? alpha * degtorad : 0,
                    cY = Math.cos(y),
                    cZ = Math.cos(z),
                    sX = Math.sin(x),
                    sY = Math.sin(y),
                    sZ = Math.sin(z),
                    Vx = -cZ * sY - sZ * sX * cY,
                    Vy = -sZ * sY + cZ * sX * cY;
                let compassHeading = Math.atan(Vx / Vy);
                if (Vy < 0) compassHeading += Math.PI;
                else if (Vx < 0) compassHeading += 2 * Math.PI;
                return compassHeading * (180 / Math.PI);
            };

            window.addEventListener('devicemotion', updateAccel);
            window.addEventListener('deviceorientation', updateOrientation);

            this.stop = () => {
                this.active = false;
                window.removeEventListener('devicemotion', updateAccel);
                window.removeEventListener('deviceorientation', updateOrientation);
            };
        }
    }
}

export { Accelerometer };
