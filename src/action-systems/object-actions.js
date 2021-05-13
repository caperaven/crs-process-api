export class ObjectActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async set(step, context, process, item) {
        await globalThis.crs.process.setValue(step.args.target, step.args.value, context, process, item);
    }
}