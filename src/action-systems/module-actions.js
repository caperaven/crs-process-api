export class ModuleActions {
    static async perform(step, context, process, item) {
        const ctx = step.args.context ? await crs.process.getValue(step.args.context, context, process, item) : context;
        const result = await this[step.action]?.(step, ctx);

        if (result != null && step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
    }

    static async call(step, context) {
        return await crs.modules.call(step.args.module, context, step.args.fnName, step.args.parameters);
    }
}