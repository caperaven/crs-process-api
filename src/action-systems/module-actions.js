export class ModuleActions {
    static async perform(step, context, process, item) {
        const ctx = step.args.context ? await crs.process.getValue(step.args.context, context, process, item) : context;
        const result = await this[step.action]?.(step, ctx);

        if (result != null && step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
    }

    static async call(step, context) {
        if (step.args.default === true) {
            return await crs.modules.callDefault(step.args.module, context, step.args.parameters);
        }

        return await crs.modules.call(step.args.module, context, step.args.fnName, step.args.parameters);
    }

    static async create_class(step) {
        if (step.args.default === true) {
            return await crs.modules.getInstanceOfDefault(step.args.module, step.args.parameters);
        }

        return await crs.modules.getInstanceOf(step.args.module, step.args.class, step.args.parameters);
    }

    static async get_constant(step) {
        return await crs.modules.getConstant(step.args.module, step.args.name);
    }
}