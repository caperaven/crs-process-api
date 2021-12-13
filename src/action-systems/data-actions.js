import init, {filter_data} from "./../bin/data.js";

await init();

export class DataActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async filter(step, context, process, item) {
        const source = Array.isArray(step.args.source) == true ? step.args.source : await crs.process.getValue(step.args.source, context, process, item);
        const intent = step.args.filter || [];

        if (intent.length > 0) {
            let result = filter_data(intent, source);

            if (step.args.target != null) {
                await crs.process.setValue(step.args.target, result, context, process, item);
            }

            return result;
        }
    }

    static async sort(step, context, process, item) {

    }

    static async group(step, context, process, item) {

    }

    static async aggregate(step, context, process, item) {

    }
}
