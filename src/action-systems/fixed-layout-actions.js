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

    static async set(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const target = await crs.dom.get_element(step.args.target, context, process, item);
        const at = await crs.process.getValue(step.args.at || "bottom", context, process, item);
        const anchor = await crs.process.getValue(step.args.anchor, context, process, item);
        const margin = await crs.process.getValue(step.args.margin || 0, context, process, item);

        element.style.position = "fixed";
        element.style.left = 0;
        element.style.top = 0;

        const elementBounds = element.getBoundingClientRect();
        const targetBounds = target.getBoundingClientRect();

        const position = this.#actions[at](elementBounds, targetBounds, margin, anchor);
        element.style.translate = `${position.x}px ${position.y}px`;
    }

    static #left(elementBounds, targetBounds, margin, anchor) {
        return {
            x: targetBounds.left - elementBounds.width - margin,
            y: anchor == "bottom" ? targetBounds.bottom - elementBounds.height : targetBounds.top
        }
    }

    static #right(elementBounds, targetBounds, margin, anchor) {
        return {
            x: targetBounds.left + targetBounds.width + margin,
            y: anchor == "bottom" ? targetBounds.bottom - elementBounds.height : targetBounds.top
        }
    }

    static #top(elementBounds, targetBounds, margin, anchor) {
        return {
            x: anchor == "right" ? targetBounds.right - elementBounds.width : targetBounds.left,
            y: targetBounds.top - elementBounds.height - margin
        }
    }

    static #bottom(elementBounds, targetBounds, margin, anchor) {
        return {
            x: anchor == "right" ? targetBounds.right - elementBounds.width : targetBounds.left,
            y: targetBounds.top + targetBounds.height + margin
        }
    }
}

crs.intent.fixed_layout = FixedLayoutActions;