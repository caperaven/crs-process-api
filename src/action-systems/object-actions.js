export class ObjectActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    static async set(step, context, process, item) {
        await globalThis.crs.process.setValue(step.args.target, step.args.value, context, process, item);
    }

    static async get(step, context, process, item) {
        const result = await globalThis.crs.process.getValue(step.args.source, context, process, item);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}