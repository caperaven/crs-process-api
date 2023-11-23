// https://caperaven.co.za/process-api/using-process-ai/colors-module/
export class ColorsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async hex_to_rgb(step, context, process, item) {
        const hex = await crs.process.getValue(step.args.hex, context, process, item);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        const rgb = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, rgb, context, process, item);
        }

        return rgb;
    }

    static async hex_to_rgba(step, context, process, item) {
        const hex = await crs.process.getValue(step.args.hex, context, process, item);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        const rgba = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: parseInt(result[4], 16)
        } : null;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, rgba, context, process, item);
        }

        return rgba;
    }

    static async hex_to_normalised(step, context, process, item) {
        const result = await this.hex_to_rgba(step, context, process, item);
        result.r = await crs.call("math", "normalize", { value: result.r, min: 0, max: 255 });
        result.g = await crs.call("math", "normalize", { value: result.g, min: 0, max: 255 });
        result.b = await crs.call("math", "normalize", { value: result.b, min: 0, max: 255 });
        result.a = await crs.call("math", "normalize", { value: result.a, min: 0, max: 255 });

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async rgb_to_hex(step, context, process, item) {
        const r = (await crs.process.getValue(step.args.r, context, process, item)) || 0;
        const g = (await crs.process.getValue(step.args.g, context, process, item)) || 0;
        const b = (await crs.process.getValue(step.args.b, context, process, item)) || 0;

        const result = ["#", decimalToHex(r), decimalToHex(g), decimalToHex(b)].join("");

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async rgba_to_hex(step, context, process, item) {
        const r = (await crs.process.getValue(step.args.r, context, process, item)) || 0;
        const g = (await crs.process.getValue(step.args.g, context, process, item)) || 0;
        const b = (await crs.process.getValue(step.args.b, context, process, item)) || 0;
        const a = (await crs.process.getValue(step.args.a, context, process, item)) || 255;

        const result = ["#", decimalToHex(r), decimalToHex(g), decimalToHex(b), decimalToHex(a)].join("");

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async rgb_text_to_hex(step, context, process, item) {
        let value = await crs.process.getValue(step.args.value, context, process, item);
        value = value.replace("rgba(", "");
        value = value.replace("rgb(", "");
        value = value.replace(")", "");
        const parts = value.split(",");

        return await this.rgb_to_hex({
            args: {
                r: Number(parts[0].trim()),
                g: Number(parts[1].trim()),
                b: Number(parts[2].trim())
            }
        }, context, process, item);
    }

    static async css_to_hex(step, context, process, item) {
        const results = await processVariables(step, context, process, item, async (value) => {
            if (value.indexOf("#") != -1) {
                if (value.length == 7) {
                    return `${value}ff`;
                }
                return value;
            }
            else {
                value = value.replace("rgba(", "");
                value = value.replace("rgb(", "");
                value = value.replace(")", "");
                const parts = value.split(",");

                return await this.rgba_to_hex({
                    args: {
                        r: Number(parts[0].trim()),
                        g: Number(parts[1].trim()),
                        b: Number(parts[2].trim()),
                        a: parts.length == 3 ? 255 : Number(parts[3].trim())
                    }
                }, context, process, item);
            }
        });

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, results, context, process, item);
        }

        return results;
    }

    static async css_to_normalized(step, context, process, item) {
        const results = await this.css_to_hex(step, context, process, item);
        const keys = Object.keys(results);

        for (const key of keys) {
            const value = results[key];
            results[key] = await this.hex_to_normalised({args: {hex: value}}, context, process, item).catch(e => console.error(error));
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, results, context, process, item);
        }

        return results;
    }
}


/**
 * @function processVariables - It takes a list of CSS variables, gets the computed value of each, and then passes that value to a callback function
 * @param step {Object} - The step object
 * @param context {Object} - The context object that is passed to the process.
 * @param process {Object} - the current process
 * @param item {Object} - the current item being processed
 * @param callback {Function} - a function that takes a string and returns a value.
 *
 * @param step.args.element {HTMLElement} - The element to get the css variable from
 * @param step.args.variables {array of string} - The names of the css variable to convert to hex
 *
 * @returns The result of the callback function.
 * @private
 *
 * @example <caption>javascript</caption>
 * see css_to_hex above on how to use this function
 *
 */
async function processVariables(step, context, process, item, callback) {
    const element = await crs.dom.get_element(step.args.element);
    const variables = await crs.process.getValue(step.args.variables, context, process, item);
    const style = getComputedStyle(element);
    const result = {};

    for (let variable of variables) {
        const cssValue = style.getPropertyValue(variable).trim()
        const value = await callback(cssValue).catch(e => console.error(e));
        result[variable] = value;
    }
    return result;
}

/**
 * @function decimalToHex - Converts a decimal value to a normalized hex string
 * @param value {Number} - the number value to convert
 * @returns {string} - the hex value of that decimal
 */
function decimalToHex(value) {
    const hex = value.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

crs.intent.colors = ColorsActions;