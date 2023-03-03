/**
 * @class RandomActions - A collection of actions that generate random numbers.
 * @description This class is used to generate random numbers.
 *
 * Features:
 * -perform - The main entry point for the class. This method is called by the action system.
 * -integer - Generate a random integer between the min and max values
 * -float - Generate a random float between the min and max values
 */
export class RandomActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }


    /**
     * @method generate_object - Generate an object with defined fields but using random values based on the field type
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.definition {object} - The definition of the object to generate.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("random", "generate_object", {
     *     definition: {
     *         id: "auto",
     *         code: "string:auto",
     *         description: "string:10",
     *         price: "float:1:100",
     *         quantity: "integer:1:100",
     *         date: "date:2020-01-01:2020-12-31",
     *         time: "time:0:24",
     *         duration: "duration:1:10",
     *         isValid: "boolean"
     *     }
     * })
     */
    static async generate_object(step, context, process, item) {
        const definition = await crs.process.getValue(step.args.definition, context, process, item);
    }

    /**
     * @method generate_collection - Generate a collection of objects with defined fields but using random values based on the field type
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.definition {object} - The definition of the object to generate.
     * @param step.args.count {number} - The number of objects to generate.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("random", "generate_collection", {
     *    definition: {
     *      ... see generate_object
     *    },
     *    count: 100
     * })
     */
    static async generate_collection(step, context, process, item) {
        const definition = await crs.process.getValue(step.args.definition, context, process, item);
        const count = await crs.process.getValue(step.args.count, context, process, item);
    }

    /**
     * @method integer - Generate a random integer between the min and max values
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.min {number} - The minimum value
     * @param step.args.max {number} - The maximum value
     * @param [step.args.target = "$context.result"] {string} - The target variable to store the result in.
     *
     * @returns The result of the random number generator.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("random", "integer", {
     *          min: 1,
     *          max: 10
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *       "type": "random",
     *       "action": "integer",
     *       "args": {
     *           "min": 1,
     *           "max": 10,
     *           "target": "$context.result"
     *       }
     * }
     */
    static async integer(step, context, process, item) {
        let result =  Math.floor(Math.random() * (step.args.max - step.args.min + 1)) + step.args.min;

        if (step.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method float - Generate a random float between the min and max values
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that was passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.min {number} - The minimum value
     * @param step.args.max {number} - The maximum value
     * @param [step.args.target = "$context.result"] {string} - The target variable to store the result in.
     *
     * @returns A random number between the min and max values.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("random", "float", {
     *         min: 1,
     *         max: 10
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "random",
     *      "action": "float",
     *      "args": {
     *          "min": 1,
     *          "max": 10,
     *          "target": "$context.result"
     *      }
     * }
     */
    static async float(step, context, process, item) {
        let result =  (Math.random() * (step.args.max - step.args.min + 1)) + step.args.min;

        if (step.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async string(step, context, process, item) {
    }

    static async date(step, context, process, item) {
    }

    static async time(step, context, process, item) {
    }

    static async duration(step, context, process, item) {
    }
}

crs.intent.random = RandomActions;