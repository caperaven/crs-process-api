/**
 * This is a static class that contains the actions for the fixed position action system.
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
     * * @returns {Promise<void>}
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
 * @param {HTMLElement} element
 * @param {number} margin
 * @param {DOMRect} elementBounds
 * @returns {void}
 */
class Positioning {
    static "top-left"(element, margin) {
        element.style.translate = `${margin}px ${margin}px`;
    }

    static "top-center"(element, margin, elementBounds) {
        const x = (window.innerWidth / 2) - (elementBounds.width / 2);
        const y = margin;
        element.style.translate = `${x}px ${y}px`;
    }

    static "top-right"(element, margin, elementBounds) {
        const x = window.innerWidth - elementBounds.width - margin;
        const y = margin;
        element.style.translate = `${x}px ${y}px`;
    }

    static "bottom-left"(element, margin, elementBounds) {
        const x = margin;
        const y = window.innerHeight - elementBounds.height - margin;
        element.style.translate = `${x}px ${y}px`;
    }

    static "bottom-center"(element, margin, elementBounds) {
        const x = (window.innerWidth / 2) - (elementBounds.width / 2);
        const y = window.innerHeight - elementBounds.height - margin;
        element.style.translate = `${x}px ${y}px`;
    }

    static "bottom-right"(element, margin, elementBounds) {
        const x = window.innerWidth - elementBounds.width - margin;
        const y = window.innerHeight - elementBounds.height - margin;
        element.style.translate = `${x}px ${y}px`;
    }
}

crs.intent.fixed_position = FixedPositionActions;