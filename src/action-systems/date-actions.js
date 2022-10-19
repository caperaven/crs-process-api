import init, {date_difference_str} from "../bin/data.js";

await init();

export class DataActions {

    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async date_diff(step, context, process, item) {
        const date1 = await crs.process.getValue(step.args.date1);
        const date2 = await crs.process.getValue(step.args.date2);

        const res = date_difference_str(date1, date2);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, res);
        }

        return res;
    }
}

crs.intent.date = DataActions;

