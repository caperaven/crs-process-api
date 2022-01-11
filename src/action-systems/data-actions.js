import init, {filter_data, sort_data} from "./../bin/data.js";

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
        const records = step.args.records || [];

        if (intent.length > 0) {
            let result = sort_data(JSON.stringify(intent), JSON.stringify(source), records);

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }

            return result;
        }
    }

    static async group(step, context, process, item) {

    }

    static async aggregate(step, context, process, item) {

    }
}

crs.intent.data = DataActions;