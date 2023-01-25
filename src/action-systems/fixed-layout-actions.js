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
     * position a element based on a target element.
     * you can place the element at the top, right, bottom or left of the target.
     * you can also anchor the element based on it's position.
     * for example if you place a element left of target you can anchor it to the top of bottom of the target.
     * if you place it at the top you can anchor it on the left or right.
     * ...
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
        const margin = await crs.process.getValue(step.args.margin || 0, context, process, item);

        element.style.position = "fixed";
        element.style.left = 0;
        element.style.top = 0;

        const elementBounds = element.getBoundingClientRect();

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
        position = this.#ensureInFrustum(position, elementBounds.width, elementBounds.height);
        element.style.translate = `${position.x}px ${position.y}px`;
        element.removeAttribute("hidden");
    }

    static #left(elementBounds, targetBounds, margin, anchor) {
        return {
            x: targetBounds.left - elementBounds.width - margin,
            y: verticalAnchor(anchor, targetBounds, elementBounds)
        }
    }

    static #right(elementBounds, targetBounds, margin, anchor) {
        return {
            x: targetBounds.left + targetBounds.width + margin,
            y: verticalAnchor(anchor, targetBounds, elementBounds)
        }
    }

    static #top(elementBounds, targetBounds, margin, anchor) {
        return {
            x: horizontalAnchor(anchor, targetBounds, elementBounds),
            y: targetBounds.top - elementBounds.height - margin
        }
    }

    static #bottom(elementBounds, targetBounds, margin, anchor) {
        return {
            x: horizontalAnchor(anchor, targetBounds, elementBounds),
            y: targetBounds.top + targetBounds.height + margin
        }
    }

    static #ensureInFrustum(position, width, height) {
        if (position.x < 0) {
            position.x = 1;
        }

        if (position.x + width > window.innerWidth) {
            position.x = window.innerWidth - width - 1;
        }

        if (position.y < 0) {
            position.y = 1;
        }

        if (position.y + height > window.innerHeight) {
            position.y = window.innerHeight - height - 1;
        }

        return position;
    }
}

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