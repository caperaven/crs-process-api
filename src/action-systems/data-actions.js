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

export class DataActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async debug() {
        init_panic_hook();
    }

    static async filter(step, context, process, item) {
        await crs.intent.data.debug();

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