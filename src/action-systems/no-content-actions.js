import "./no-content/no-content.js";

/**
 * @class NoContentActions - A class that contains all the actions that can be performed on the no-content component.
 * This has two main features.
 * - show - This will add the no-content component to the parent element.
 * - hide - This will remove the no-content component from the parent element.
 *
 * In both cases all you need to provide is the parent that the no-content component should be added to.
 */
export class NoContentActions {
    /**
     * @method perform - standard perform function
     * @param step {object} - The step that is being performed.
     * @param context {object} - The context that the step is being performed in.
     * @param process {object} - The process that the step is being performed in.
     * @param item {object} - The item that the step is being performed in.
     * @returns {Promise<void>}
     */
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method show - This will add the no-content component to the parent element.
     * @param step {object} - The step that is being performed.
     * @param context {object} - The context that the step is being performed in.
     * @param process {object} - The process that the step is being performed in.
     * @param item {object} - The item that the step is being performed in.
     * @returns {Promise<void>}
     *
     * @exmaple <caption>javascript</caption>
     * await crs.call("no_content", "show", {parent: "body"});
     *
     * @example <caption>json</caption>
     * {
     *    "type": "no_content",
     *    "action": "show",
     *    "args": {
     *       "parent": "body"
     *    }
     * }
     */
    static async show(step, context, process, item) {
        const parent = await crs.dom.get_element(step.args.parent, context, process, item);
        const instance = document.createElement("no-content");
        parent.appendChild(instance);
    }

    /**
     * @method hide - This will remove the no-content component from the parent element.
     * @param step {object} - The step that is being performed.
     * @param context {object} - The context that the step is being performed in.
     * @param process {object} - The process that the step is being performed in.
     * @param item {object} - The item that the step is being performed in.
     * @returns {Promise<void>}
     *
     * @exmaple <caption>javascript</caption>
     * await crs.call("no_content", "hide", {parent: "body"});
     *
     * @example <caption>json</caption>
     * {
     *    "type": "no_content",
     *    "action": "hide",
     *    "args": {
     *       "parent": "body"
     *    }
     * }
     */
    static async hide(step, context, process, item) {
        const parent = await crs.dom.get_element(step.args.parent, context, process, item);
        parent.querySelector("no-content")?.remove();
    }
}

crs.intent.no_content = NoContentActions;