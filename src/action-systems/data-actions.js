import init, {
    filter_data,
    sort_data,
    group_data,
    aggregate_rows,
    calculate_group_aggregate,
    iso8601_to_string,
    iso8601_batch,
    in_filter,
    unique_values,
    init_panic_hook,
    evaluate_obj,
    build_perspective
} from "./../bin/data.js";

/**
 * todo: free up the data objects after transactions are done. IDB
 */


await init();


/**
 * @class DataActions - It provides a set of functions that can be used to manipulate data
 * Features:
 * filter - It filters data based on a set of criteria
 * sort - It sorts data based on a set of criteria
 *
 *
 **/
export class DataActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async debug() {
        init_panic_hook();
    }

    /**
     * @method - The function takes a JSON string, a source string, and a boolean value. It returns a JSON string
     *
     * @param step - The step object from the process.
     * @param context - The context of the current process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.source {String} - The source string that will be filtered.
     * @param step.args.filter {String} - The filter criteria.
     * @param step.args.case_sensitive {Boolean} - A boolean value that determines if the filter is case-sensitive.
     * @param step.args.target {String} - The target where the result will be stored.
     *
     * @example
     *
     * @returns The result of the filter_data function.
     */
    static async filter(step, context, process, item) {
        await crs.call("data", "debug");

        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.filter, context, process, item) || [];
        const case_sensitive = await crs.process.getValue(step.args.case_sensitive, context, process, item);

        let result = filter_data(JSON.stringify(intent), source, case_sensitive == true);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async sort(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.sort, context, process, item) || [];
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        let result = sort_data(JSON.stringify(intent), source, rows);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async group(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.fields, context, process, item) || [];

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        let result = group_data(JSON.stringify(intent), source);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async aggregate(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.aggregate, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        let result = aggregate_rows(JSON.stringify(intent), source, rows);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async aggregate_group(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const group = await crs.process.getValue(step.args.group, context, process, item);
        let intent = await crs.process.getValue(step.args.aggregate, context, process, item);

        let result = calculate_group_aggregate(JSON.stringify(group), JSON.stringify(intent), source);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async iso8601_to_string(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const result = iso8601_to_string(value);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async iso8601_batch(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const field = await crs.process.getValue(step.args.field, context, process, item);


        let result = iso8601_batch(JSON.stringify(value), field);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async in_filter(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.filter, context, process, item) || [];
        const case_sensitive = await crs.process.getValue(step.args.case_sensitive, context, process, item);

        const result = in_filter(JSON.stringify(intent), source, case_sensitive == true);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async unique_values(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.fields, context, process, item);

        let result = unique_values(JSON.stringify(intent), source, rows);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async assert_equal(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.expr, context, process, item);
        const case_sensitive = await crs.process.getValue(step.args.case_sensitive, context, process, item);

        let result = evaluate_obj(JSON.stringify(intent), source, case_sensitive == true);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async perspective(step, context, process, item) {
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);

        let result = build_perspective(JSON.stringify(perspective), source, rows);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.data = DataActions;