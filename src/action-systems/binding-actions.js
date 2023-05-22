/**
 * @class BindingActions - This class contains all the actions that can be performed on a binding object.
 *
 * Features:
 * -create_context - Create a new context object and return the id of the new context
 * -free_context - Free binding context, If the process has a bId parameter, remove the object from the data store and delete the bId parameter
 * -get_property - Get the value of a property from the current item
 * -set_property - Set the value of a property on the current item
 * -get_data - Get the value of a property from the data store
 * -set_error - Set the error property on the current item
 * -set_global - Set the value of a property on the global object
 * -get_global - Get the value of a property from the global object
 * -set_globals - Set the value of a property on the global object
 * -get_globals - Get the value of a property from the global object
 */
export class BindingActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method create_context - Create a new context object and return the id of the new context
     * You are responsible to clear the context once done using "free_context"
     * @param step {Object} - The current step in the process.
     * @param context {Object} - The context object that is passed to the step.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param [step.args.context_id = "process_text"] {String|Number} - The name of the context object.
     *
     * @returns The bId is being returned.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "create_context", {
     *   context_id: "my_context"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "create_context",
     *     "args": {
     *         "context_id": "my_context"
     *      }
     * }
     */
    static async create_context(step, context, process, item) {
        const name = process.id || step?.args?.context_id || "process_context";
        const bId = crs.binding.data.addObject(name);

        if (process != null) {
            process.parameters = process.parameters || {};
            process.parameters.bId = bId;
        }

        crs.binding.data.addContext(bId, {});

        return bId;
    }

    /**
     * @method free_context - Free binding context, If the process has a bId parameter, remove the object from the data store and delete the bId parameter
     * @param step {Object} - The step object that is being executed.
     * @param context {Object} - The context object that was passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @requires process.parameters.bId {String} - The bId of the context object.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "free_context", {}, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "binding",
     *    "action": "free_context"
     *    "args": {}
     * }
     */
    static async free_context(step, context, process, item) {
        if (process.parameters.bId != null) {
            crs.binding.data.remove(process.parameters.bId);
            delete process.parameters.bId;
        }
    }

    /**
     * @method get_property - Get the value of a property from the current item
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The current process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.property {String} - The property to get the value from.
     * @param step.args.target {String} - The target to set the value to.
     *
     * @returns The value of the property.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "get_property", {
     *     property: "name"
     *     target: "my_name"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "binding",
     *    "action": "get_property",
     *    "args": {
     *       "property": "name",
     *       "target": "@process.target"
     *    }
     * }
     *
     */
    static async get_property(step, context, process, item) {
        const property = step.args.property;
        const value = await crs.binding.data.getProperty(process.parameters.bId, property);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * @method set_property - Set the value of a property on the current item
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.property {String} - The property to set the value to.
     * @param step.args.value {String} - The value to set the property to.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "set_property", {
     *    property: "name",
     *    value: "my_name"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "set_property",
     *     "args": {
     *         "property": "name",
     *         "value": "my_name"
     *     }
     * }
     */
    static async set_property(step, context, process, item) {
        const property = step.args.property;
        const value = await crs.process.getValue(step.args.value, context, process, item);
        crs.binding.data.setProperty(process.parameters.bId, property, value);
    }

    /**
     * @method get_data - Get the data from the binding and set it to the target
     * @param step {Object} - The step object
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.target {String} - The target to set the value to.
     * @requires process.parameters.bId - The binding id
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "get_data", {
     *    target: "my_data"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "get_data",
     *     "args": {
     *         "target": "my_data"
     *     }
     * }
     */
    static async get_data(step, context, process, item) {
        const data = crs.binding.data._data[process.parameters.bId];

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, data, context, process, item);
        }
    }

    /**
     * @method set_errors - Set the errors in the error store
     * Default store is "errors" if you don't provide a store.
     * @param step {Object} - The step object
     * @param context {Object} - The context of the current step.
     * @param process {Object} - The current process
     * @param item {Object} - The current item in the loop
     *
     * @param step.args.errors {[String]} - The errors to set
     * @param [step.args.error_store="errors"] {String} - The store to set the errors to.
     *
     * @requires process.parameters.bId - The binding id
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "set_errors", {
     *   errors: ["error1", "error2"]
     *   error_store: "my_errors"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "set_errors",
     *     "args": {
     *         "errors": ["error1", "error2"],
     *         "error_store": "my_errors"
     *     }
     * }
     */
    static async set_errors(step, context, process, item) {
        const store = step.args.error_store || "errors";
        const source = await crs.process.getValue(step.args.errors, context, process, item);
        const errors = [];

        for (let error of source) {
            errors.push({
                message: error
            })
        }

        await crs.binding.data.setProperty(process.parameters.bId, store, errors);
    }

    /**
     * @method set_global - Set a global property to a value
     * @param step {Object} - The step object that is being executed.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object}  - The process object
     * @param item {Object}  - The current item being processed.
     *
     * @param step.args.property {String} - The property to set the value to.
     * @param step.args.value {String} - The value to set the property to.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "set_global", {
     *   property: "name",
     *   value: "my_name"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "set_global",
     *     "args": {
     *         "property": "name",
     *         "value": "my_name"
     *     }
     * }
     */
    static async set_global(step, context, process, item) {
        const property = await crs.process.getValue(step.args.property, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        crs.binding.data.setProperty(crs.binding.$globals, property, value);
    }

    /**
     * @method set_globals - Set the values of the global variables
     * @param step {Object}  - The step object from the process definition.
     * @param context {Object}  - The context object that is passed to the process.
     * @param process {Object}  - The process object
     * @param item {Object}  - The current item being processed.
     *
     * @param step.args.values {Object} - The values to set the global variables to with the key being the name of the variable and the value being the value of the variable.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "set_globals", {
     *     values: {
     *         name: "my_name",
     *         age: 30
     *     }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "set_globals",
     *     "args": {
     *         "values": {
     *         "name": "my_name",
     *         "age": 30
     *     }
     * }
     */
    static async set_globals(step, context, process, item) {
        const values = await crs.process.getValue(step.args.values, context, process, item);
        const keys = Object.keys(values);

        for (let key of keys) {
            crs.binding.data.setProperty(crs.binding.$globals, key, values[key]);
        }
    }

    /**
     * @method get_global - Get the value of a global property and optionally store it in a variable
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.property {String} - The property to get the value of.
     * @param step.args.target {String}- The variable to store the value in.
     *
     * @returns The value of the property.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "get_global", {
     *     property: "name"
     *     target: "my_name"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "get_global",
     *     "args": {
     *         "property": "name",
     *         "target": "my_name"
     *     }
     * }
     */
    static async get_global(step, context, process, item) {
        const property = await crs.process.getValue(step.args.property, context, process, item);
        const value = crs.binding.data.getProperty(crs.binding.$globals, property);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * @method get_globals - Get the values of the global variables specified in the `values` argument and store them in the `target` argument
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.values {[String]} - The global variables to get
     * @param step.args.target {String} - The target to store the values in.
     *
     * @returns The values of the global variables.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("binding", "get_globals", {
     *    values: ["global1", "global2"],
     *    target: "my_globals"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "binding",
     *     "action": "get_globals",
     *     "args": {
     *         "values": ["global1", "global2"],
     *         "target": "my_globals"
     *     }
     * }
     */
    static async get_globals(step, context, process, item) {
        const values = await crs.process.getValue(step.args.values, context, process, item);
        const keys = Object.keys(values);

        for (let key of keys) {
            const value = crs.binding.data.getProperty(crs.binding.$globals, key);
            values[key] = value;
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return values;
    }
}

crs.intent.binding = BindingActions;