/**
 * @class ColorsActions - This class contains the actions that are available to the colors action system.
 *
 * Features:
 * - hex_to_rgb - Converts a hex color to rgb.
 * - hex_to_rgba - Converts a hex color to rgba.
 * - hex_to_normalised - Converts a hex color to a normalised rgba color.
 * - rgb_to_hex - Converts a rgb color to hex.
 * - rgb_text_to_hex - Converts a rgb text color to hex.
 * - css_to_hex - Converts a css color to hex.
 * - css_to_normalized - Converts a css color to a normalised rgba color.
 */
export class ColorsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method - It takes a hex value, and returns an object with the red, green, and blue values
     * @param step - The step object from the process.
     * @param context  - The context object that is passed to the process.
     * @param process - The process object that is being run.
     * @param item - The item that is being processed.
     *
     * @param step.args.hex {string} - The hex value to convert to rgb.
     *
     * @returns An object with the RGB values of the hex color.
     *
     * @example <caption>javascript<example>
     * const result = await crs.call("colors", "hex_to_rgb", {
     *     hex: "#ff0000"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "colors",
     *     "action": "hex_to_rgb",
     *     "args": {
     *         "hex": "#ff0000"
     *     }
     *  }
     */
    static async hex_to_rgb(step, context, process, item) {
        const hex = await crs.process.getValue(step.args.hex, context, process, item);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * @method - It takes a hex color code and returns an object with the red, green, blue, and alpha values
     * @param step - The step object from the process.
     * @param context - The context object that is passed to the process.
     * @param process - The process object that is currently being executed.
     * @param item - The item that is being processed.
     *
     * @param step.args.hex {string} - The hex value to convert to rgba.
     *
     * @returns An object with the following properties:
     *     r: The red value of the color
     *     g: The green value of the color
     *     b: The blue value of the color
     *     a: The alpha value of the color
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("colors", "hex_to_rgba", {
     *    hex: "#ff0000ff"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "colors",
     *     "action": "hex_to_rgba",
     *     "args": {
     *         "hex": "#ff0000ff"
     *     }
     * }
     */
    static async hex_to_rgba(step, context, process, item) {
        const hex = await crs.process.getValue(step.args.hex, context, process, item);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: parseInt(result[4], 16)
        } : null;
    }

    /**
     * @method - It converts a hexadecimal color value to a normalized RGBA color value where the values range between 0 and 1.
     * @param step - The step number of the current step in the process.
     * @param context - The context of the current step.
     * @param process - The process object that is passed to the step.
     * @param item - The item to be processed.
     *
     * @param step.args.hex {string} - The hex value to convert to rgba.
     *
     * @returns An object with the properties r, g, b, a.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("colors", "hex_to_normalised", {
     *    hex: "#ff0000ff"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "colors",
     *     "action": "hex_to_normalised",
     *     "args": {
     *         "hex": "#ff0000ff"
     *     }
     * }
     */
    static async hex_to_normalised(step, context, process, item) {
        const result = await this.hex_to_rgba(step, context, process, item);
        result.r = await crs.call("math", "normalize", { value: result.r, min: 0, max: 255 });
        result.g = await crs.call("math", "normalize", { value: result.g, min: 0, max: 255 });
        result.b = await crs.call("math", "normalize", { value: result.b, min: 0, max: 255 });
        result.a = await crs.call("math", "normalize", { value: result.a, min: 0, max: 255 });
        return result;
    }

    /**
     * @method rgb_to_hex - It takes three numbers (red, green, and blue) and returns a hexadecimal color code
     * @param step - The step object that is being processed.
     * @param context - The current context of the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.r {number} - The red value of the color
     * @param step.args.g {number} - The green value of the color
     * @param step.args.b {number} - The blue value of the color
     *
     * @returns A string in the format of #RRGGBB
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("colors", "rgb_to_hex", {
     *   r: 255,
     *   g: 0,
     *   b: 0
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "colors",
     *    "action": "rgb_to_hex",
     *    "args": {
     *        "r": 255,
     *        "g": 0,
     *        "b": 0
     *    }
     * }
     */
    static async rgb_to_hex(step, context, process, item) {
        const r = (await crs.process.getValue(step.args.r, context, process, item)) || 0;
        const g = (await crs.process.getValue(step.args.g, context, process, item)) || 0;
        const b = (await crs.process.getValue(step.args.b, context, process, item)) || 0;

        return ["#", decimalToHex(r), decimalToHex(g), decimalToHex(b)].join("");
    }

    /**
     * @method - It takes four arguments, each of which is a number between 0 and 255, and returns a string that represents the RGBA
     * color in hexadecimal format
     * @param step - The step object that is being processed.
     * @param context - The context of the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param [step.args.r=0] {number} - The red value of the color
     * @param [step.args.g=0] {number} - The green value of the color
     * @param [step.args.b=0] {number} - The blue value of the color
     * @param [step.args.a=255] {number} - The alpha value of the color
     *
     * @returns A string in the format of #RRGGBBAA
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("colors", "rgba_to_hex", {
     *     r: 255,
     *     g: 0,
     *     b: 0,
     *     a: 255
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "colors",
     *     "action": "rgba_to_hex",
     *     "args": {
     *         "r": 255,
     *         "g": 0,
     *         "b": 0,
     *         "a": 255
     *     }
     * }
     */
    static async rgba_to_hex(step, context, process, item) {
        const r = (await crs.process.getValue(step.args.r, context, process, item)) || 0;
        const g = (await crs.process.getValue(step.args.g, context, process, item)) || 0;
        const b = (await crs.process.getValue(step.args.b, context, process, item)) || 0;
        const a = (await crs.process.getValue(step.args.a, context, process, item)) || 255;

        return ["#", decimalToHex(r), decimalToHex(g), decimalToHex(b), decimalToHex(a)].join("");
    }

    /**
     * @method - It takes a string in the format of `rgb(255, 255, 255)` or `rgba(255, 255, 255, 1)` and converts it to a hex string
     * @param step - The step object that is being processed.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.value {string} - The rgb or rgba value to convert to hex
     *
     * @returns The hex value of the rgb value.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("colors", "rgb_text_to_hex", {
     *    value: "rgb(255, 0, 0)"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "colors",
     *     "action": "rgb_text_to_hex",
     *     "args": {
     *         "value": "rgb(255, 0, 0)"
     *     }
     * }
     */
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

    /**
     * @method - Get a css variable and convert it to a hex string
     * @param step - The step object
     * @param context - The context of the current process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.element {HTMLElement} - The element to get the css variable from
     * @param step.args.variables {array of string} - The names of the css variable to convert to hex
     *
     * @returns - array of hex values
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("colors", "css_to_hex", {
     *     element: document.body,
     *     variables: ["--primary-color", "--secondary-color"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "colors",
     *     "action": "css_to_hex",
     *     "args": {
     *         "element": "document.body",
     *         "variables": ["--primary-color", "--secondary-color"]
     *     }
     * }
     */
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
        return results;
    }

    /**
     * @method - Gets a css variables from an element, converts it to a hex string, then converts that hex string to a normalized hex string
     * @param step - The step object from the pipeline
     * @param context - The context of the current step.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.element {HTMLElement} - The element to get the css variable from
     * @param step.args.variables {array of string} - The names of the css variable to convert to hex
     *
     * @returns - array of normalized hex values
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("colors", "css_to_normalized", {
     *    element: document.body,
     *    variables: ["--primary-color", "--secondary-color"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "colors",
     *     "action": "css_to_normalized",
     *     "args": {
     *         "element": "document.body",
     *         "variables": ["--primary-color", "--secondary-color"]
     *     }
     * }
     */
    static async css_to_normalized(step, context, process, item) {
        const results = await this.css_to_hex(step, context, process, item);
        const keys = Object.keys(results);

        for (const key of keys) {
            const value = results[key];
            results[key] = await this.hex_to_normalised({args: {hex: value}}, context, process, item).catch(e => console.error(error));
        }

        return results;
    }
}


/**
 *  It takes a list of CSS variables, gets the computed value of each, and then passes that value to a callback function
 * @param step - The step object
 * @param context - The context object that is passed to the process.
 * @param process - the current process
 * @param item - the current item being processed
 * @param callback - a function that takes a string and returns a value.
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
 * Converts a decimal value to a normalized hex string
 * @param value
 * @returns {string} - the hex value of that decimal
 */
function decimalToHex(value) {
    const hex = value.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

crs.intent.colors = ColorsActions;