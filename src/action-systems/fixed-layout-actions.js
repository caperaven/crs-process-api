/**
 * @class FixedLayoutActions - It positions an element based on a target element or point
 * Features:
 * -set - position an element based on a target element.
 * -left - position an element based on a target element.
 * -right - position an element based on a target element.
 * -top - position an element based on a target element.
 * -bottom - position an element based on a target element.
 * -ensureInFrustum - ensure the element is in the frustum of the camera.
 */
export class FixedLayoutActions {
    static #actions = Object.freeze({
        "left": this.#left,
        "right": this.#right,
        "top": this.#top,
        "bottom": this.#bottom
    })

    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method set - position a element based on a target element.
     * You can place the element at the top, right, bottom or left of the target.
     * You can also anchor the element based on it's position.
     * For example if you place a element left of target you can anchor it to the top of bottom of the target
     * if you place it at the top you can anchor it on the left or right.
     *
     * @param step {Object} - step to perform
     * @param context {Object} - context of the action
     * @param process {Object} - process that is performing the action
     * @param item {Object} - item that is performing the action
     *
     * @param  step.args.element {string} - element to position
     * @param  step.args.target {string} - target element to position the element to
     * @param  step.args.point {Object} - point to position the element to
     * @param  [step.args.at="bottom"] {string} - position to set the element to, values: ["top", "right", "bottom", "left"]
     * @param  [step.args.anchor] {string} - anchor the element to the target, values: ["top", "right", "bottom", "left", "middle"]
     * @param  [step.args.margin=0] {number} - margin to apply to the element
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("fixed_layout", "set", {
     *   element: "my-element",
     *   target: "my-target",
     *   at: "left",
     *   anchor: "top",
     *   margin: 10
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "fixed_layout",
     *  "action_type": "set",
     *  "args": {
     *    "element": "my-element",
     *    "target": "my-target",
     *    "at": "left",
     *    "anchor": "top",
     *    "margin": 10
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async set(step, context, process, item) {
        /**
         * JHR:
         * 1. todo. add point location
         * 2. anchor middle
         */

        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const target = await crs.dom.get_element(step.args.target, context, process, item);
        const point = await crs.process.getValue(step.args.point, context, process, item);
        const at = await crs.process.getValue(step.args.at || "bottom", context, process, item);
        const anchor = await crs.process.getValue(step.args.anchor, context, process, item);
        const container = await crs.process.getValue(step.args.container || document.body, context, process, item);
        const margin = await crs.process.getValue(step.args.margin || 0, context, process, item);

        element.style.position = "fixed";
        element.style.left = 0;
        element.style.top = 0;

        const elementBounds = element.getBoundingClientRect();

        const containerBounds = container.getBoundingClientRect();

        let targetBounds;

        if (target != null) {
            targetBounds = target.getBoundingClientRect();
        }
        else {
            targetBounds = {
                x: point.x,
                left: point.x,
                y: point.y,
                top: point.y,
                width: 1,
                height: 1,
                right: point.x + 1,
                bottom: point.y + 1
            }
        }

        let position = this.#actions[at](elementBounds, targetBounds, margin, anchor);
        position.x -= containerBounds.left;
        position.y -= containerBounds.top;
        position = this.#ensureInFrustum(position, elementBounds.width, elementBounds.height);
        element.style.translate = `${position.x}px ${position.y}px`;
        element.removeAttribute("hidden");
    }

    /**
     * @method left - "If the element is to the left of the target, return the element's left edge minus the element's width minus the
     * margin."
     *
     * The function is called with the following arguments:
     *
     * * elementBounds: The bounding rectangle of the element.
     * * targetBounds: The bounding rectangle of the target.
     * * margin: The margin between the element and the target.
     * * anchor: The vertical anchor of the element
     * @param elementBounds {DOMRect}- The bounds of the element you want to position.
     * @param targetBounds {DOMRect} - The bounding rectangle of the target element.
     * @param margin {Number}- The distance between the element and the target.
     * @param anchor {String}- The anchor point of the element.
     * @returns The x and y coordinates of the element.
     */
    static #left(elementBounds, targetBounds, margin, anchor) {
        return {
            x: targetBounds.left - elementBounds.width - margin,
            y: verticalAnchor(anchor, targetBounds, elementBounds)
        }
    }

    /**
     * @method right - "If the element is to the right of the target, return the x and y coordinates of the element."
     *
     * @param elementBounds {DOMRect}- The bounds of the element to be positioned
     * @param targetBounds {DOMRect}- The bounds of the target element.
     * @param margin {Number}- The distance between the element and the target.
     * @param anchor {Number}- The anchor point of the element to be positioned.
     * @returns The x and y coordinates of the element.
     */
    static #right(elementBounds, targetBounds, margin, anchor) {
        return {
            x: targetBounds.left + targetBounds.width + margin,
            y: verticalAnchor(anchor, targetBounds, elementBounds)
        }
    }

    /**
     * @method top - "If the element is anchored to the top of the target, return the horizontal anchor and the top of the target minus
     * the height of the element minus the margin."
     *
     * @param elementBounds {DOMRect}- The bounds of the element you want to position.
     * @param targetBounds {DOMRect}- The bounds of the target element.
     * @param margin {Number}- The margin between the element and the target.
     * @param anchor {String}- The anchor point of the element.
     * @returns The x and y coordinates of the element.
     */
    static #top(elementBounds, targetBounds, margin, anchor) {
        return {
            x: horizontalAnchor(anchor, targetBounds, elementBounds),
            y: targetBounds.top - elementBounds.height - margin
        }
    }

    /**
     * @method bottom - "If the element is anchored to the bottom of the target, return the x and y coordinates of the element's top left
     * corner."
     *
     * The function uses the horizontalAnchor function to calculate the x coordinate of the element's top left corner
     * @param elementBounds {DOMRect}- The bounds of the element you want to position.
     * @param targetBounds {DOMRect}- The bounds of the target element.
     * @param margin {Number}- The margin between the element and the target.
     * @param anchor {Number}- The anchor point of the element.
     *
     * The function returns an object with two properties:
     *
     * x: The x coordinate of the element's top left corner.
     * y: The y coordinate of the element's top left corner.
     * @returns The x and y coordinates of the element.
     */
    static #bottom(elementBounds, targetBounds, margin, anchor) {
        return {
            x: horizontalAnchor(anchor, targetBounds, elementBounds),
            y: targetBounds.top + targetBounds.height + margin
        }
    }

    /**
     * @method ensureInFrustum - If the position of the popup is outside the viewport, move it back inside
     * @param position {Object}- The position of the top left corner of the globalThis.
     * @param width {Number}- The width of the tooltip.
     * @param height {Number}- The height of the tooltip.
     *
     * @example <caption>javascript</caption>
     * // If the tooltip is outside the viewport, move it back inside
     * position = this.#ensureInFrustum(position, elementBounds.width, elementBounds.height);
     *
     * @returns The position of the element.
     */
    static #ensureInFrustum(position, width, height) {
        if (position.x < 0) {
            position.x = 1;
        }

        if (position.x + width > globalThis.innerWidth) {
            position.x = globalThis.innerWidth - width - 1;
        }

        if (position.y < 0) {
            position.y = 1;
        }

        if (position.y + height > globalThis.innerHeight) {
            position.y = globalThis.innerHeight - height - 1;
        }

        position.x = Math.round(position.x);
        position.y = Math.round(position.y);

        return position;
    }
}

/**
 * @function verticalAnchor - It takes an anchor, a targetBounds object, and an elementBounds object, and returns the vertical position of the element
 * based on the anchor
 * @param anchor {String}- The anchor position of the element.
 * @param targetBounds {DOMRect}- The bounds of the target element.
 * @param elementBounds {DOMRect}- The bounds of the element you want to position.
 * @returns The vertical anchor of the element.
 */
function verticalAnchor(anchor, targetBounds, elementBounds) {
    switch(anchor) {
        case "middle": {
            return (targetBounds.top + targetBounds.height / 2) - (elementBounds.height / 2);
            break;
        }
        case "bottom": {
            return targetBounds.bottom - elementBounds.height;
            break;
        }
        case "top": {
            return targetBounds.top;
            break;
        }
    }
}

/**
 * @method horizontalAnchor - It takes an anchor, the bounds of the target element, and the bounds of the element to be positioned, and returns the
 * horizontal position of the element to be positioned
 * @param anchor {String}- The anchor point of the element.
 * @param targetBounds {DOMRect}- The bounds of the target element.
 * @param elementBounds {DOMRect}- The bounds of the element you want to position.
 * @returns The horizontal position of the element.
 */
function horizontalAnchor(anchor, targetBounds, elementBounds) {
    switch(anchor) {
        case "middle": {
            return (targetBounds.left + targetBounds.width / 2) - (elementBounds.width / 2);
            break;
        }
        case "left": {
            return targetBounds.left;
            break;
        }
        case "right": {
            return targetBounds.right - elementBounds.width;
            break;
        }
    }
}

crs.intent.fixed_layout = FixedLayoutActions;