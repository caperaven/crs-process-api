export class UrlActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    /**
     * Redirect the browser to the specified URL hash.
     *
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object.
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.hash {string} - The hash value to set in the URL.
     * @param step.args.parameters {object} - The parameters to inflate the hash template.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("url", "set_hash", {
     *     hash: "page?param1=${param1}&param2=${param2}",
     *     parameters: {
     *         param1: "value1",
     *         param2: "value2"
     *     }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "url",
     *     "action": "set_hash",
     *     "args": {
     *         "hash": "page?param1=${param1}&param2=${param2}",
     *         "parameters": {
     *             "param1": "value1",
     *             "param2": "value2"
     *         }
     *     }
     * }
     */
    static async set_hash(step, context, process, item) {
        await crs.validate(step, context, process, item, {
            hash: { required: true, type: "string" },
            parameters: { required: false, type: "object" }
        }, "UrlActions.set_hash");

        globalThis.location.hash = await crs.call("string", "inflate", {
            template: step.args.hash,
            parameters: step.args.parameters
        }, context, process, item);
    }

    /**
     * Get the search parameters from the hash
     * @param step - The step object
     * @param context - The context of the process
     * @param process - The process object
     * @param item - Item object
     *
     * @param step.args.target - The target to store the search parameters in
     *
     * @returns {Promise<{}>}
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "url",
     *    "action": "get_hash_search_parameters",
     *    "args": {
     *      "target": "$context.parameters"
     *    }
     * }
     *
     * @example <caption>javascript example</caption>
     * const searchParameters = await crs.call("url", "get_hash_search_parameters", {})
     */
    static async get_hash_search_parameters(step, context, process, item) {
        const hash = globalThis.location.hash;
        const search = hash.split("?")[1];
        const params = new URLSearchParams(search);
        const result = {};

        for (const [key, value] of params) {
            result[key] = value;
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }
}

crs.intent.url = UrlActions;