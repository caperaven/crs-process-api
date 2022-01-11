import init, {
    filter_data,
    sort_data,
    group_data,
    aggregate_rows,
    iso8601_to_string
} from "./../bin/data.js";

await init();

export class DataActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async filter(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = step.args.filter || [];

        if (intent.length > 0) {
            let result = filter_data(JSON.stringify(intent), JSON.stringify(source));

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }

            return result;
        }
    }

    static async sort(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = step.args.sort || [];
        const rows = step.args.rows || [];

        if (intent.length > 0) {
            let result = sort_data(JSON.stringify(intent), JSON.stringify(source), rows);

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }

            return result;
        }
    }

    static async group(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = step.args.fields || [];

        if (intent.length > 0) {
            const result = group_data(JSON.stringify(intent), JSON.stringify(source));

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }

            return result;
        }
    }

    static async aggregate(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = step.args.aggregate;
        const rows = step.args.rows || [];

        if (intent != null) {
            const result = aggregate_rows(JSON.stringify(intent), JSON.stringify(source), rows);

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }

            return result;
        }
    }

    static async iso8601_to_string(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);

        if (value.trim().length > 0) {
            const result = iso8601_to_string(value);
            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }

            return result;
        }
    }
}

crs.intent.data = DataActions;