import init, {unique_values, filter} from "./../bin/data_processing.js";

await init();

export class DataProcessing {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method unique_values - returns a map of unique values for each field
     * It will tell you what the unique values in the array is and how many times it appears
     * @param step {object} - the step to perform
     * @param context {object} - the context of the process
     * @param process {object} - the process currently running
     * @param item {object} - the item
     *
     * @param step.args.source {Array} - the data to check for unique values
     * @param step.args.fields {Array} - the fields to get the unique values for
     * @param step.args.target {string} - the target to store the result in
     * @param step.args.rows {Array} - the rows indexes to check for unique values
     *
     * @returns {Promise<void>}
     *
     * @example <caption>js example</caption>
     * const result = await crs.call("data_processing", "unique_values", {
     *     source: [{value: 1}, {value: 2}, {value: 3}, {value: 3}, {value: null}],
     *     fields: ["value"]
     * })
     *
     * @example <caption>json example</caption>
     * {
     *     "type: "data_processing",
     *     "action": "unique_values",
     *     "args": {
     *         "source": "@context.data",
     *         "fields": ["value"],
     *         "target": "@context.result"
     *     }
     * }
     */
    static async unique_values(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const fields = await crs.process.getValue(step.args.fields, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);

        if (!Array.isArray(data)) {
            throw new Error("Fields must be an array");
        }

        if (!Array.isArray(fields)) {
            throw new Error("Fields must be an array");
        }

        const result = unique_values(data, fields, rows);

        if (step.args.target) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async filter(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.intent, context, process, item);
        const case_sensitive = await crs.process.getValue(step.args.case_sensitive ?? false, context, process, item);

        const result = filter(data, intent, case_sensitive);

        if (step.args.target) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}


crs.intent.data_processing = DataProcessing;