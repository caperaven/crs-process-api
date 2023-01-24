/**
 * This is a static class that contains the actions for the fixed position action system.
 *
 * Actions supported are:
 * - set - set the element to a fixed position
 */
export class FixedPositionActions {
    /**
     * Perform the action
     * @param step - step to perform
     * @param context - context of the action
     * @param process - process that is performing the action
     * @param item - item that is performing the action
     * @returns {Promise<void>}
     */
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Set the element to a fixed position
     * @param step - step to perform
     * @param context - context of the action
     * @param process - process that is performing the action
     * @param item - item that is performing the action
     *
     * @param {string} step.args.element - element to position
     * @param {string} step.args.position - position to set the element to
     * @param {number} step.args.margin - margin to apply to the element
     *
     * @returns {Promise<void>}
     *
     * const result = crs.call("fixed_position", "set", {
     *     element: element,
     *     position: "top-left",
     *     margin: 10
     * }, context, process, item);
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
 * This is a static class that contains the positioning functions for the fixed position action.
 * Positions supported are:
 * - top-left
 * - top-center
 * - top-right
 * - bottom-left
 * - bottom-center
 * - bottom-right
 * @param {HTMLElement} element - element to position
 * @param {number} margin - margin to use
 * @param {DOMRect} elementBounds - bounds of the element
 * @returns {void}
 */
class Positioning {
    /**
     * Position the element at the top left
     * @param element - element to position
     * @param margin - margin to use
     */
    static "top-left"(element, margin) {
        element.style.translate = `${margin}px ${margin}px`;
    }

    /**
     * Position the element at the top center
     * @param element - element to position
     * @param margin - margin to use
     * @param elementBounds - bounds of the element
     */
    static "top-center"(element, margin, elementBounds) {
        const x = (window.innerWidth / 2) - (elementBounds.width / 2);
        const y = margin;
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * Position the element at the top right
     * @param element - element to position
     * @param margin - margin to use
     * @param elementBounds - bounds of the element
     */
    static "top-right"(element, margin, elementBounds) {
        const x = window.innerWidth - elementBounds.width - margin;
        const y = margin;
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * Position the element at the bottom left
     * @param element - element to position
     * @param margin - margin to use
     * @param elementBounds - bounds of the element
     */
    static "bottom-left"(element, margin, elementBounds) {
        const x = margin;
        const y = window.innerHeight - elementBounds.height - margin;
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * Position the element at the bottom center
     * @param element - element to position
     * @param margin - margin to use
     * @param elementBounds - bounds of the element
     */
    static "bottom-center"(element, margin, elementBounds) {
        const x = (window.innerWidth / 2) - (elementBounds.width / 2);
        const y = window.innerHeight - elementBounds.height - margin;
        element.style.translate = `${x}px ${y}px`;
    }

    /**
     * Position the element at the bottom right
     * @param element - element to position
     * @param margin - margin to use
     * @param elementBounds - bounds of the element
     */
    static "bottom-right"(element, margin, elementBounds) {
        const x = window.innerWidth - elementBounds.width - margin;
        const y = window.innerHeight - elementBounds.height - margin;
        element.style.translate = `${x}px ${y}px`;
    }
}

crs.intent.fixed_position = FixedPositionActions;