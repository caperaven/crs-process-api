export class RandomActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    static async integer(step, context, process, item) {
        let result =  Math.floor(Math.random() * (step.args.max - step.args.min + 1)) + step.args.min;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async float(step, context, process, item) {
        let result =  (Math.random() * (step.args.max - step.args.min + 1)) + step.args.min;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}