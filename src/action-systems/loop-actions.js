const BATCH_SIZE = 500;
/**
 * @class LoopActions - This class contains the actions that are used to loop over a collection of items.
 * @description It takes a batch of items from the source array, and for each item, it runs the steps in the `steps` array
 *
 * Features:
 * -perform - It takes a batch of items from the source array, and for each item, it runs the steps in the `steps` array
 */
export class LoopActions {
    /**
     * @method perform - It takes a batch of items from the source array, and for each item, it runs the steps in the `steps` array
     * @param step {object} - the current step in the process
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - the process object
     *
     * @param step.args.source {string} - The path to the source array
     * @param step.args.steps {object} - The steps to run for each item in the source array
     * @param [step.args.target == "$context.result"] {string} - The path to the target object to set the value of.
     *
     * @returns The result of the last step in the steps array
     *
     * @example <caption>json example</caption>
     * {
     *   type: "loop",
     *   args: {
     *       source: "$data.items",
     *       steps: {
     *           start: {
     *               type: "array",
     *               action: "add",
     *               args: {
     *                   target: "$item.value",
     *                   value: 1
     *               },
     *               next_step: "add_second"
     *           },
                 add_second: {
     *               type: "array",
     *               action: "add",
     *               args: {
     *                   target: "$item.value",
     *                   value: 2
     *               },
     *               next_step: "add_third"
     *           }
     *           add_third: {
     *               type: "array",
     *               action: "add",
     *               args: {
     *                   target: "$item.value",
     *                   value: 3
     *               }
     *           },
     *       }
     *   },
     *   next_step: "end"
     * }
     */
    static async perform(step, context, process) {
        const source = await crs.process.getValue(step.args.source, context, process);

        if (source == null) {
            throw new Error(`object on path ${step.args.source} was not set`);
        }

        const target    = step.args.target;

        if (source.length <= BATCH_SIZE) {
            await processBatch(step, source, target, context, process, 0, source.length);
        }
        else {
            for (let i = 0; i < source.length; i += BATCH_SIZE) {
                const start = i;
                let end   = i + BATCH_SIZE;
                if (end > source.length) {
                    end = source.length;
                }

                let promise = new Promise(resolve => {
                    let timeout = setTimeout(async () => {
                        await processBatch(step, source, target, context, process, start, end);
                        clearTimeout(timeout);
                        timeout = null;
                        resolve();
                    }, 0)
                })

                await promise;
                promise = null;
            }
        }
    }
}

/**
 * @function processBatch - It takes a collection of items, and for each item, it runs a set of steps
 * @param step - The step object
 * @param stepKeys - The keys of the steps to run.
 * @param collection - The collection to process.
 * @param target - The target object to set the value of.
 * @param context - The context object that is passed to the process.
 * @param process - The process object
 * @param start - The index of the first item in the batch
 * @param end - The index of the last item in the batch.
 *
 * @returns The result of the last step in the steps array
 */
async function processBatch(step, collection, target, context, process, start, end) {
    for (let i = start; i < end; i++) {
        const item = collection[i];

        if (target != null) {
            await crs.process.setValue(target, item, context, process, item);
        }

        await crs.process.runStep(step.args.steps.start, context, process, item, step.args.steps);
    }
}

crs.intent.loop = LoopActions;