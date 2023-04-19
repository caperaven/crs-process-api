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
     *         isValid: "boolean",
     *         records: {
     *             definition: {
     *                 ... same as above: N levels deep
     *             },
     *             count: 10 // if count is defined it's an array of objects else it is just an object of defined fields.
     *         },
     *     }
     * })
     */
    static async generate_object(step, context, process, item) {
        const definition = await crs.process.getValue(step.args.definition, context, process, item);
        const result = {};

        for (let [field, value] of Object.entries(definition)) {
            let parts = value.split(":");
            const type = parts[0];
            parts.splice(0, 1);

            switch(type) {
                case "auto": {
                    result[field] = step.args.auto;
                    break;
                }
                case "string": {
                    result[field] = await RandomActions.string({ args: { length: parts[0] } }, context, process, item);
                    break;
                }
                case "integer": {
                    result[field] = await RandomActions.integer({ args: { min: parts[0], max: parts[1] } }, context, process, item);
                    break;
                }
                case "float": {
                    result[field] = await RandomActions.float({ args: { min: parts[0], max: parts[1] } }, context, process, item);
                    break;
                }
                case "date": {
                    result[field] = await RandomActions.date({ args: { min: parts[0], max: parts[1] } }, context, process, item);
                    break;
                }
                case "time": {
                    result[field] = await RandomActions.time({ args: {} }, context, process, item);
                    break;
                }
                case "duration": {
                    result[field] = await RandomActions.duration({ args: {} }, context, process, item);
                    break;
                }
                case "boolean": {
                    result[field] = await RandomActions.boolean({args: {}}, context, process, item);
                }
                case "uuid": {
                        result[field] = crypto.randomUUID();
                    break;
                }
            }
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
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

        const result = [];

        for (let i = 0; i < count; i++) {
            result.push(await RandomActions.generate_object({
                args: {
                    auto: i,
                    definition
                }
            }, context, process, item));
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
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

    /**
     * @method - Generate a random string of a given length
     * @param step
     * @param context
     * @param process
     * @param item
     *
     * @param step.args.length {number} - The length of the string to generate.
     * @param [step.args.target = "$context.result"] {string} - The target variable to store the result in.
     * @returns {Promise<void>}
     *
     * @example <cpation>javascript example</caption>
     * const result = await crs.call("random", "string", {
     *     length: 10
     * })
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "random",
     *     "action": "string",
     *     "args": {
     *         "length": 10,
     *         "target": "$context.result"
     *     }
     * }
     */
    static async string(step, context, process, item) {
        let length = await crs.process.getValue(step.args.length, context, process, item);

        if (length == "auto") {
            length = Math.floor(Math.random() * (20 - 1)) + 0;
        }

        let result = Math.random().toString(36).substring(2, Number(length) + 2);

        if (step.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method - Generate a random date between the min and max dates.
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that was passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("random", "date", {
     *     min: "2020-01-01",
     *     max: "2020-12-31"
     * })
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "random",
     *    "action": "date",
     *    "args": {
     *        "min": "2020-01-01",
     *        "max": "2020-12-31",
     *        "target": "$context.result"
     *    }
     * }
     */
    static async date(step, context, process, item) {
        const start = await crs.process.getValue(step.args.min, context, process, item);
        const end = await crs.process.getValue(step.args.max, context, process, item);

        const startDate = new Date(start);
        const endDate = new Date(end);

        let result = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

        if (step.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method - Generate a random time.
     *
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that was passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("random", "time", {})
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "random",
     *   "action": "time",
     *   "args": {
     *        "target": "$context.result"
     *    }
     * }
     */
    static async time(step, context, process, item) {
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        const seconds = Math.floor(Math.random() * 60);
        const result = `${hours}:${minutes}:${seconds}`;

        if (step.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method - Generate a random duration using iso8601 format.
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that was passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     * @returns {Promise<void>}
     */
    static async duration(step, context, process, item) {
        const day = Math.floor(Math.random() * 365);
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        const seconds = Math.floor(Math.random() * 60);
        const result = `P${day}DT${hours}H${minutes}M${seconds}S`;

        if (step.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method - Generate a random boolean value.
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that was passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     * @returns {Promise<void>}
     */
    static async boolean(step, context, process, item) {
        let result = Math.random() >= 0.5;

        if (step.args?.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.random = RandomActions;