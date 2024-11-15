/**
 * @class FixedPositionActions - This is a static class that contains the actions for the fixed position action system.
 *
 * Features:
 * -set - set the element to a fixed position
 *
 */
export class FixedPositionActions {
    /**
     * Perform the action
     * @param step {Object} - step to perform
     * @param context {Object} - context of the action
     * @param process {Object} - process that is performing the action
     * @param item {Object} - item that is performing the action
     * @returns {Promise<void>}
     */
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method set -Set the element to a fixed position
     * @param step {Object} - step to perform
     * @param context {Object} - context of the action
     * @param process {Object} - process that is performing the action
     * @param item {Object} - item that is performing the action
     *
     * @param  step.args.element {string} - element to position
     * @param  step.args.position {string} - position to set the element to, values: ["top-left", "top-right", "bottom-left", "bottom-right"]
     * @param  [step.args.margin=0] {number} - margin to apply to the element
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("fixed_position", "set", {
     *     element: element,
     *     position: "top-left",
     *     margin: 10
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "fixed_position",
     *    "action": "set",
     *    "args": {
     *      "element": "@process.element",
     *      "position": "top-left",
     *      "margin": 10
     *    }
     * }
     */
    static async set(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const position = await crs.process.getValue(step.args.position, context, process, item);
        const margin = await crs.process.getValue(step.args.margin || 0, context, process, item);

        element.style.position = "fixed";
        element.style.left = 0;
        element.style.top = 0;

        const elementBounds = element.getBoundingClientRect();

        Positioning[position](element, margin, elementBounds);
    }
}

/**
 * @class Positioning - This is a static class that contains the positioning functions for the fixed position action.
 * Positions supported are:
 * - top-left
 * - top-center
 * - top-right
 * - bottom-left
 * - bottom-center
 * - bottom-right
 * - center-screen
 *
 * Features:
 * -top-left - position the element at the top left
 * -top-center - position the element at the top center
 * -top-right - position the element at the top right
 * -bottom-left - position the element at the bottom left
 * -bottom-center - position the element at the bottom center
 * -bottom-right - position the element at the bottom right
 * -center-screen - position the element at the center of the screen
 *
 *
 * @param {HTMLElement} element - element to position
 * @param {number} margin - margin to use
 * @param {DOMRect} elementBounds - bounds of the element
 * @returns {void}
 * @private
 */
class Positioning {
    /**
     * @method "top-left" Position the element at the top left
     * @param element {HTMLElement} - element to position
     * @param margin {Number} - margin to use
     *
     * @example <caption>javascript</caption>
     * Positioning["top-left"](element, margin);
     *
     **/
    static "top-left"(element, margin) {
        margin = Math.round(margin);
        element.style.translate = `${margin}px ${margin}px`;
    }

    /**
     * @method "top-center" - Position the element at the top center
     * @param element {HTMLElement} - element to position
     * @param margin {Number} - margin to use
     * @param elementBounds {Bounding Rect} - bounds of the element
     *
     * @example <caption>javascript</caption>
     * Positioning["top-center"](element, margin, elementBounds);
     */
    static "top-center"(element, margin, elementBounds) {
        const x = Math.round((globalThis.innerWidth / 2) - (elementBounds.width / 2));
        const y = Math.round(margin);
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * @method "top-right" - Position the element at the top right
     * @param element {HTMLElement} - element to position
     * @param margin {Number} - margin to use
     * @param elementBounds {Bounding Rect} - bounds of the element
     *
     * @example <caption>javascript</caption>
     * Positioning["top-right"](element, margin, elementBounds);
     *
     */
    static "top-right"(element, margin, elementBounds) {
        const x = Math.round(globalThis.innerWidth - elementBounds.width - margin);
        const y = Math.round(margin);
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * @method "bottom-left" - Position the element at the bottom left
     * @param element {HTMLElement} - element to position
     * @param margin {Number} - margin to use
     * @param elementBounds {Bounding Rect} - bounds of the element
     *
     * @example <caption>javascript</caption>
     * Positioning["bottom-left"](element, margin, elementBounds);
     */
    static "bottom-left"(element, margin, elementBounds) {
        const x = Math.round(margin);
        const y = Math.round(globalThis.innerHeight - elementBounds.height - margin);
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * @method "bottom-center" - Position the element at the bottom center
     * @param element {HTMLElement} - element to position
     * @param margin {Number} - margin to use
     * @param elementBounds {Bounding Rect} - bounds of the element
     *
     * @example <caption>javascript</caption>
     * Positioning["bottom-center"](element, margin, elementBounds);
     */
    static "bottom-center"(element, margin, elementBounds) {
        const x = Math.round((globalThis.innerWidth / 2) - (elementBounds.width / 2));
        const y = Math.round(globalThis.innerHeight - elementBounds.height - margin);
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * @method "bottom-right" - Position the element at the bottom right
     * @param element {HTMLElement} - element to position
     * @param margin {Number} - margin to use
     * @param elementBounds {Bounding Rect} - bounds of the element
     */
    static "bottom-right"(element, margin, elementBounds) {
        const x = Math.round(globalThis.innerWidth - elementBounds.width - margin);
        const y = Math.round(globalThis.innerHeight - elementBounds.height - margin);
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * @method "center-screen" - Position the element at the center of the screen
     * @param element {HTMLElement} - element to position
     * @param margin {Number} - margin to use
     * @param elementBounds {Bounding Rect} - bounds of the element
     *
     * @example <caption>javascript</caption>
     * Positioning["center-screen"](element, margin, elementBounds);
     */
    static "center-screen"(element, margin, elementBounds) {
        const x = Math.round((globalThis.innerWidth / 2) - (elementBounds.width / 2));
        const y = Math.round((globalThis.innerHeight / 2) - (elementBounds.height / 2));
        element.style.translate = `${x}px ${y}px`;
    }
}

crs.intent.fixed_position = FixedPositionActions;