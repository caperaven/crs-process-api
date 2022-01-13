import init, {
    filter_data,
    sort_data,
    group_data,
    aggregate_rows,
    calculate_group_aggregate,
    iso8601_to_string,
    in_filter,
    unique_values
} from "./../bin/data.js";

await init();

export class DataActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async debug() {
        init_panic_hook();
    }

    static async filter(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.filter, context, process, item) || [];

        let result = filter_data(JSON.stringify(intent), JSON.stringify(source));
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async sort(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.sort, context, process, item) || [];
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        let result = sort_data(JSON.stringify(intent), JSON.stringify(source), rows);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async group(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.fields, context, process, item) || [];

        let result = group_data(JSON.stringify(intent), JSON.stringify(source));
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async aggregate(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.aggregate, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        let result = aggregate_rows(JSON.stringify(intent), JSON.stringify(source), rows);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async aggregateGroup(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const group = await crs.process.getValue(step.args.group, context, process, item);
        let intent = await crs.process.getValue(step.args.aggregate, context, process, item);

        let result = calculate_group_aggregate(JSON.stringify(group), JSON.stringify(intent), JSON.stringify(source));
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

    static async in_filter(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.filter, context, process, item) || [];

        const result = in_filter(JSON.stringify(intent), JSON.stringify(source));
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    static async unique_values(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.fields, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        let result = unique_values(JSON.stringify(intent), JSON.stringify(source), rows);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.data = DataActions;