import "./no-content/no-content.js";

export class NoContentActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async show(step, context, process, item) {
        const parent = await crs.dom.get_element(step.args.parent, context, process, item);
        const instance = document.createElement("no-content");
        parent.appendChild(instance);
    }

    static async hide(step, context, process, item) {
        const parent = await crs.dom.get_element(step.args.parent, context, process, item);
        parent.querySelector("no-content")?.remove();
    }
}

crs.intent.no_content = NoContentActions;