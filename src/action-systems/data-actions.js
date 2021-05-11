export class DataActions {
    static async perform(step, context, process) {
        await this[step.action](step.args, context, process);
    }

    static async getLocalData(args, context, process) {
        const source = await crs.process.getValue(args.source, context, process);
        await crs.process.setValue(args.target, source, context, process);
    }
}