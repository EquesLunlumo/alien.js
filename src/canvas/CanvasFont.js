/**
 * Canvas font utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { CanvasGraphics } from './CanvasGraphics.js';

class CanvasFont {

    static createText(canvas, width, height, str, props) {

        const defaults = {
            textBaseline: 'alphabetic',
            lineHeight: height,
            letterSpacing: 0,
            textAlign: 'start'
        };
        props = Object.assign(defaults, props);

        const context = canvas.context;
        if (height === props.lineHeight) {
            return createText(canvas, width, height, str, props);
        } else {
            const text = new CanvasGraphics(width, height),
                words = str.split(' '),
                lines = [];
            let line = '';
            text.totalWidth = 0;
            text.totalHeight = 0;
            context.font = props.font;
            for (let n = 0; n < words.length; n++) {
                let split;
                if (~words[n].indexOf('\n')) split = words[n].split('\n');
                const testLine = line + (split ? split[0] : words[n]) + ' ',
                    characters = testLine.split('');
                let testWidth = 0;
                for (let i = 0; i < characters.length; i++) testWidth += context.measureText(characters[i]).width + props.letterSpacing;
                if (testWidth > width && n > 0) {
                    lines.push(line.slice(0, -1));
                    if (split) lines.push(split[0]);
                    line = (split ? split[1] : words[n]) + ' ';
                } else {
                    if (split) lines.push(line + split[0]);
                    line = (split ? split[1] + ' ' : testLine);
                }
            }
            lines.push(line);
            lines.forEach((line, i) => {
                const graphics = createText(canvas, width, props.lineHeight, line, props);
                graphics.y = i * props.lineHeight;
                text.add(graphics);
                text.totalWidth = Math.max(graphics.totalWidth, text.totalWidth);
                text.totalHeight += props.lineHeight;
            });
            return text;
        }

        function createText(canvas, width, height, str, { font, textBaseline, letterSpacing, textAlign, fillStyle, strokeStyle, lineWidth }) {
            const context = canvas.context,
                graphics = new CanvasGraphics(width, height);
            graphics.font = font;
            graphics.fillStyle = fillStyle;
            graphics.strokeStyle = strokeStyle;
            graphics.lineWidth = lineWidth;
            graphics.textBaseline = textBaseline;
            graphics.totalWidth = 0;
            graphics.totalHeight = height;
            const characters = str.split('');
            let chr,
                index = 0,
                currentPosition = 0;
            context.font = font;
            for (let i = 0; i < characters.length; i++) graphics.totalWidth += context.measureText(characters[i]).width + letterSpacing;
            switch (textAlign) {
                case 'start':
                case 'left':
                    currentPosition = 0;
                    break;
                case 'end':
                case 'right':
                    currentPosition = width - graphics.totalWidth;
                    break;
                case 'center':
                    currentPosition = (width - graphics.totalWidth) / 2;
                    break;
            }
            do {
                chr = characters[index++];
                if (fillStyle) graphics.fillText(chr, currentPosition, 0);
                if (strokeStyle) graphics.strokeText(chr, currentPosition, 0);
                currentPosition += context.measureText(chr).width + letterSpacing;
            } while (index < str.length);
            return graphics;
        }
    }
}

export { CanvasFont };
