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
}

crs.intent.random = RandomActions;