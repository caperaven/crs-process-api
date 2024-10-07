import init, {unique_values, filter, group, sort, get_perspective, init_panic_hook, aggregate, fuzzy_filter} from "./../bin/data_processing.js";

await init();

export class DataProcessing {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method init_panic_hook - initializes the panic hook for the wasm module.
     * This allows better debugging of the wasm module as it provides you with a stack trace
     * @param step
     * @param context
     * @param process
     * @param item
     */
    static init_panic_hook(step, context, process, item) {
        init_panic_hook();
    }

    static async aggregate(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.intent, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);

        const result = aggregate(data, intent, rows);

        if (step.args.target) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
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

    /**
     * @method filter - filters the data based on the intent
     * @param step {object} - the step to perform
     * @param context {object} - the context of the process
     * @param process {object} - the process currently running
     * @param item {object} - the item
     *
     * @param step.args.source {Array} - the data to filter
     * @param step.args.intent {object} - the intent to filter on
     * @param step.args.case_sensitive {boolean} - should the filter should be case-sensitive
     * @returns {Promise<Array<*>>}
     */
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

    /**
     * @method group - groups the data based on the intent
     * @param step {object} - the step to perform
     * @param context {object} - the context of the process
     * @param process {object} - the process currently running
     * @param item {object} - the item
     *
     * @param step.args.source {Array} - the data to group
     * @param step.args.intent {object} - the intent to group on
     * @param step.args.rows {Array} - optional indexes of rows to group
     * @returns {Promise<any>}
     */
    static async group(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.intent, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);
        const result = group(data, intent, rows)

        if (step.args.target) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async sort(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.intent, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);
        const result = sort(data, intent, rows)

        if (step.args.target) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async get_perspective(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.intent, context, process, item);
        const result = get_perspective(data, intent);

        if (step.args.target) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async fuzzy_filter(step, context, process, item) {
        const data = await crs.process.getValue(step.args.source, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        if (data == null || data.length === 0) return [];

        let fields;

        const include = await crs.process.getValue(step.args.include ?? [], context, process, item);

        if (include.length > 0) {
            fields = include;
        }
        else {
            const exclude = await crs.process.getValue(step.args.exclude ?? [], context, process, item);
            fields = Object.keys(data[0]).filter(key => !exclude.includes(key));
        }

        return fuzzy_filter(data, {fields, value: String(value)});
    }
}


crs.intent.data_processing = DataProcessing;