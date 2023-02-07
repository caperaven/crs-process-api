/**
 * @class ProcessActions - This class is used to run a process from another process.
 *
 * Features:
 * perform - This method takes the step, context, process, and item, and then emits an event with the same information
 */
export class ProcessActions {
    /**
     * @method It takes the step, context, process, and item, and then emits an event with the same information
     * @param step - The step object that is being executed.
     * @param context - The context of the current process.
     * @param process - The process that is being run.
     * @param item - The item that is being processed.
     *
     * @param step.args.parameters {object}- The parameters to pass to the event.
     *
     * @returns The event is being emitted.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("process", "perform", {
     *      parameters: {"parameter1", "parameter2"}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "process",
     *      "action": "perform",
     *      "args": {
     *          "parameters": {
     *              "parameter1": "parameter1",
     *              "parameter2": "parameter2"
     *           }
     *      }
     * }
     */
    static async perform(step, context, process, item) {
        const parameters = {};

        if (step.args?.parameters != null) {
            const keys = Object.keys(step.args.parameters);
            for (let key of keys) {
                parameters[key] = await crs.process.getValue(step.args.parameters[key], context, process, item);
            }
        }

        await crsbinding.events.emitter.emit("run-process", {
            step: step,
            context: context,
            process: process,
            item: item,
            parameters: parameters,
        });
    }
}

crs.intent.process = ProcessActions;