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
        const padding = await crs.process.getValue(step.args.padding || 0, context, process, item);

        element.style.position = "fixed";
        element.style.left = 0;
        element.style.top = 0;

        const elementBounds = element.getBoundingClientRect();
        const targetBounds = target.getBoundingClientRect();

        const position = this.#actions[at](elementBounds, targetBounds, padding);
        element.style.translate = `${position.x}px ${position.y}px`;
    }

    static #left(elementBounds, targetBounds, padding) {
        return {
            x: targetBounds.left - elementBounds.width - padding,
            y: targetBounds.top
        }
    }

    static #right(elementBounds, targetBounds, padding) {
        return {
            x: targetBounds.left + targetBounds.width + padding,
            y: targetBounds.top
        }
    }

    static #top(elementBounds, targetBounds, padding) {
        return {
            x: targetBounds.left,
            y: targetBounds.top - elementBounds.height - padding
        }
    }

    static #bottom(elementBounds, targetBounds, padding) {
        return {
            x: targetBounds.left,
            y: targetBounds.top + targetBounds.height + padding
        }
    }
}

crs.intent.fixed_layout = FixedLayoutActions;