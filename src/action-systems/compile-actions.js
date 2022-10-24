export class CompileActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async if_value(step, context, process, item) {
        const exp = await crs.process.getValue(step.args.exp, context, process, item);
        const fn = await crsbinding.expression.ifFunction(exp);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, fn, context, process, item);
        }

        return fn;
    }

    static async case_value(step, context, process, item) {
        let exp = await crs.process.getValue(step.args.exp, context, process, item);
        const fn = await crsbinding.expression.caseFunction(exp);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, fn, context, process, item);
        }

        return fn;
    }
}

crs.intent.compile = CompileActions;