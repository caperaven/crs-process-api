import {BindingActions} from "./binding-actions.js";

export class ColorsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async hex_to_rgb(step, context, process, item) {
        const hex = await crs.process.getValue(step.args.hex, context, process, item);
        const result = hexToRgb(hex);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.value, result, context, process, item);
        }

        return result;
    }

    static async rgb_to_hex(step, context, process, item) {
        const r = (await crs.process.getValue(step.args.r, context, process, item)) || 0;
        const g = (await crs.process.getValue(step.args.g, context, process, item)) || 0;
        const b = (await crs.process.getValue(step.args.b, context, process, item)) || 0;
        const result = `#${decimalToHex(r)}${decimalToHex(g)}${decimalToHex(b)}`;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.value, result, context, process, item);
        }

        return result;
    }
}

function decimalToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

crs.intent.colors = ColorsActions;
