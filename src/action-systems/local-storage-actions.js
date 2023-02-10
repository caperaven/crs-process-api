/**
 * @class LocalStorageAction - This class contains the actions for local storage.
 * @description It provides a set of functions that allow you to interact with the local storage of the browser.
 *
 * Features:
 * perform - This is the main function that is called by the action system.
 * set_value - This function sets a value in local storage.
 * get_value - This function gets a value from local storage.
 * set_object - It takes a key and a value, converts the value to JSON, and stores it in local storage
 * get_object - It gets the value of a key from local storage, parses it as JSON, and returns it
 * remove - Remove the item with the specified key from the local storage
 */
export class LocalStorageAction {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method set_value - Set a value in local storage
     * @param step - The step object from the process.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string} - The key to set the value to.
     * @param step.args.value {string} - The value to set.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("local_storage", "set_value", {
     *      key: "key",
     *      value: "value"
     *  },context, process, item);
     *
     *  @example <caption>json example</caption>
     *  {
     *      "type": "local_storage",
     *      "action": "set_value",
     *      "args": {
     *          "key": "key",
     *          "value": "value"
     *      }
     *  }
     */
    static async set_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        localStorage.setItem(key, value);
    }


    /**
     * @method get_value - It gets the value of a key from local storage and returns it
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string} - The key to get the value from.
     * @param [step.args.target = "$context.result"] {string} - The target to set the value to.
     *
     * @returns The value of the key in local storage.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("local_storage", "get_value", {
     *      key: "key"
     * },context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "local_storage",
     *     "action": "get_value",
     *     "args": {
     *         "key": "key"
     *         "target": "$context.result"
     *     }
     * }
     */
    static async get_value(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const result = localStorage.getItem(key);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    /**
     * @method set_object - It takes a key and a value, converts the value to JSON, and stores it in local storage
     * @param step - The step object from the process.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - the current item being processed
     *
     * @param step.args.key {string} - The key to set the value to.
     * @param step.args.value {object} - The value to set.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("local_storage", "set_object", {
     *      key: "name",
     *      value: {
     *          firstName: "John",
     *          lastName: "Doe"
     *       }
     * },context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "local_storage",
     *    "action": "set_object",
     *    "args": {
     *        "key": "name",
     *        "value": {
     *             "firstName": "John",
     *             "lastName": "Doe"
     *          }
     *     }
     * }
     */
    static async set_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
    }

    /**
     * @method get_object - It gets the value of a key from local storage, parses it as JSON, and returns it
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The current item being processed.
     *
     * @param step.args.key {string} - The key to get the value from.
     * @param [step.args.target = "$context.result"] {string} - The target to set the value to.
     *
     * @returns The value of the key in local storage parsed as JSON.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("local_storage", "get_object", {
     *     key: "key"
     * },context, process, item);
     *
     *  @example <caption>json example</caption>
     *  {
     *    "type": "local_storage",
     *    "action": "get_object",
     *    "args": {
     *         "key": "key"
     *         "target": "$context.result"
     *     }
     *  }
     */
    static async get_object(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        const value = localStorage.getItem(key);
        const result = JSON.parse(value);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result);
        }

        return result;
    }

    /**
     * @method remove - Remove the item with the specified key from the local storage
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param step.args.key {string} - The key to remove.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("local_storage", "remove", {
     *        key: "name"
     * },context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "local_storage",
     *   "action": "remove",
     *   "args": {
     *       "key": "name"
     *    }
     * }
     */
    static async remove(step, context, process, item) {
        const key = await crs.process.getValue(step.args.key, context, process, item);
        localStorage.removeItem(key);
    }
}

crs.intent.local_storage = LocalStorageAction;