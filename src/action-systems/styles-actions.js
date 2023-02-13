/**
 * @class StylesActions - This class contains the actions for the styles action system.
 * @description  It loads and unloads CSS files.
 *
 * Features:
 * perform - This method is called by the action system to perform the action.
 * load_file - This method loads a CSS file into the page.
 * unload_file - This method unloads a CSS file from the page.
 */
export class StylesActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method load_file - It loads a CSS file into the page
     * @param step - The step object from the process.
     * @param context - The context of the current process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.id {string} - The id of the link tag.
     * @param step.args.file {string} - The file to load.
     *
     * @returns The link element.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("styles", "load_file", {
     *    id: "my-style",
     *    file: "my-style.css"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "styles",
     *     "action": "load_file",
     *     "args": {
     *         "id": "my-style",
     *         "file": "my-style.css"
     *     }
     * }
     */
    static async load_file(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const file = await crs.process.getValue(step.args.file, context, process, item);

        if (document.querySelector(`#${id}`) != null) return;

        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = file;
        document.getElementsByTagName("head")[0].appendChild(link)

        return link;
    }

    /**
     * @method unload_file - It removes a link from the DOM
     * @param step - The step object from the process.
     * @param context - The context of the current step.
     * @param process - The process object that is running the step.
     * @param item - The item that is being processed.
     *
     * @param step.args.id {string} - The id of the link tag.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("styles", "unload_file", {
     *      id: "my-style"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "styles",
     *     "action": "unload_file",
     *     "args": {
     *         "id": "my-style"
     *     }
     * }
     */
    static async unload_file(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id);
        const link = document.querySelector(`#${id}`);
        link.parentElement.removeChild(link);
    }
}

crs.intent.styles = StylesActions;

