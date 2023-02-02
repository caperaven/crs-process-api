export class RandomActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    /**
     * > Generate a random integer between the min and max values
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.min - The minimum value
     * @param step.args.max - The maximum value
     * @param step.args.target - The target variable to store the result in.
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
     *           "max": 10
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
     * > Generate a random float between the min and max values
     * @param step - The step object that is being executed.
     * @param context - The context object that was passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.min - The minimum value
     * @param step.args.max - The maximum value
     * @param step.args.target - The target variable to store the result in.
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