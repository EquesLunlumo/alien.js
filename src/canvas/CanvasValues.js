/**
 * Canvas values.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class CanvasValues {

    constructor(style) {
        this.styles = {};
        if (!style) this.data = new Float32Array(6);
        else this.styled = false;
    }

    setTRSA(x, y, r, sx, sy, a) {
        const m = this.data;
        m[0] = x;
        m[1] = y;
        m[2] = r;
        m[3] = sx;
        m[4] = sy;
        m[5] = a;
    }

    calculate(values) {
        const v = values.data,
            m = this.data;
        m[0] = m[0] + v[0];
        m[1] = m[1] + v[1];
        m[2] = m[2] + v[2];
        m[3] = m[3] * v[3];
        m[4] = m[4] * v[4];
        m[5] = m[5] * v[5];
    }

    calculateStyle(parent) {
        if (!parent.styled) return false;
        this.styled = true;
        const values = parent.values;
        for (let key in values) if (!this.styles[key]) this.styles[key] = values[key];
    }

    get shadowOffsetX() {
        return this.styles.shadowOffsetX;
    }

    set shadowOffsetX(v) {
        this.styled = true;
        this.styles.shadowOffsetX = v;
    }

    get shadowOffsetY() {
        return this.styles.shadowOffsetY;
    }

    set shadowOffsetY(v) {
        this.styled = true;
        this.styles.shadowOffsetY = v;
    }

    get shadowBlur() {
        return this.styles.shadowBlur;
    }

    set shadowBlur(v) {
        this.styled = true;
        this.styles.shadowBlur = v;
    }

    get shadowColor() {
        return this.styles.shadowColor;
    }

    set shadowColor(v) {
        this.styled = true;
        this.styles.shadowColor = v;
    }

    get values() {
        return this.styles;
    }
}

export { CanvasValues };
