/**
 * @class ScriptsActions - A collection of actions that can be used to load and unload scripts.
 * @description This class is used to load and unload scripts.
 *
 * Features:
 * perform - The main entry point for the action.
 * load_file - Dynamically load a javascript file from file as a script tag.
 * unload_file - Remove a script file based on id from the dom.
 */
export class ScriptsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method load_file - Dynamically load a javascript file from file as a script tag.
     * @param step - The step object from the process.
     * @param context - The context of the current process.
     * @param process - The current process
     * @param item - The current item being processed.
     *
     * @param step.args.id {string} - The id of the script tag.
     * @param step.args.file {string} - The file to load.
     * @param [step.args.target = "$context.result"] {string} - The target to load the script into.
     *
     * @returns A promise that resolves to the script element.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("scripts", "load_file", {
     *     id: "my-script",
     *     file: file
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "scripts",
     *     "action": "load_file",
     *     "args": {
     *          "id": "my-script",
     *          "file": file,
     *          "target": "$context.myTarget"
     *     }
     * }
     */
    static async load_file(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id, context, process, item);
        const file = await crs.process.getValue(step.args.file, context, process, item);

        return new Promise(resolve => {
            const element = document.querySelector(`#${id}`);

            if (element != null) {
                return resolve(element);
            }

            const script = document.createElement("script");
            script.onload = () => resolve(script);
            script.id = id;

            script.setAttribute("src", file);
            document.getElementsByTagName("head")[0].appendChild(script);
        })
    }

    /**
     * @method unload_file - Remove a script file based on id from the dom.
     * @param step - The step object from the process.
     * @param context - The context of the current step.
     * @param process - The process object that is running the step.
     * @param item - The item that is being processed.
     *
     * @param step.args.id {string} - The id of the script tag.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("scripts", "unload_file", {
     *     id: "my-script"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "scripts",
     *      "action": "unload_file",
     *      "args": {
     *           "id": "my-script"
     *       }
     * }
     */
    static async unload_file(step, context, process, item) {
        const id = await crs.process.getValue(step.args.id);
        const element = document.querySelector(`#${id}`);
        element.parentElement.removeChild(element);
    }
}

crs.intent.scripts = ScriptsActions;

