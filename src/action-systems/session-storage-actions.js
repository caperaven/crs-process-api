/**
 * @class SessionStorageAction - This class contains the actions that can be performed on the browser's session storage.
 * @description It provides a set of functions that allow you to interact with the browser's session storage
 *
 * Features:
 * perform - This is the main function that is called to perform the action.
 * set_value - This function sets a value in the browser's session storage.
 * get_value - This function gets a value from the browser's session storage.
 * set_object - This function sets an object in the browser's session storage.
 * get_object - This function gets an object from the browser's session storage.
 * remove - This function removes a value from the browser's session storage.
 */
export class SessionStorageAction {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method set_value - Set a value in the browser's session storage
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string} - The key to store the value under.
     * @param step.args.value {string} - The value to store.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("session_storage", "set_value", {
     *     key: "my-key",
     *     value: "my-value"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "session_storage",
     *     "action": "set_value",
     *     "args": {
     *         "key": "my-key",
     *         "value": "my-value"
     *      }
     * }
     */
    static async set_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        sessionStorage.setItem(key, value);
    }

    /**
     * @method get_value - It gets the value of the key from the session storage and returns it
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string} - The key to get the value for.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The value of the key in sessionStorage.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("session_storage", "get_value", {
     *     key: "my-key"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "session_storage",
     *     "action": "get_value",
     *     "args": {
     *          "key": "my-key",
     *          "target": "$context.result"
     *     }
     * }
     */
    static async get_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const result = sessionStorage.getItem(key);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    /**
     * @method set_object - It takes a key and a value, converts the value to JSON, and stores it in the browser's session storage
     * @param step - The step object from the process.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - the current item being processed
     *
     * @param step.args.key {string} - The key to store the value under.
     * @param step.args.value {string} - The value to store.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("session_storage", "set_object", {
     *     key: "my-key",
     *     value: "$context.value"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "session_storage",
     *     "action": "set_object",
     *     "args": {
     *         "key": "my-key",
     *         "value": "$context.value"
     *      }
     * }
     */
    static async set_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const json = JSON.stringify(value);
        sessionStorage.setItem(key, json);
    }

    /**
     * @method get_object - It gets the value of the key argument, gets the value from session storage, parses it as JSON, and then sets the
     * value of the target argument to the result
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The current item being processed.
     *
     * @param step.args.key {string} - The key to get the value for.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The value of the key in the session storage.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("session_storage", "get_object", {
     *     key: "my-key"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "session_storage",
     *     "action": "get_object",
     *     "args": {
     *          "key": "my-key",
     *          "target": "$context.result"
     *     }
     * }
     */
    static async get_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = sessionStorage.getItem(key);
        const result = JSON.parse(value);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    /**
     * @method remove - Remove a value from the session storage
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string} - The key to remove the value for.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("session_storage", "remove_value", {
     *     key: "my-key"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "session_storage",
     *     "action": "remove_value",
     *     "args": {
     *         "key": "my-key"
     *     }
     * }
     */
    static async remove(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        sessionStorage.removeItem(key);
    }
}

crs.intent.session_storage = SessionStorageAction;