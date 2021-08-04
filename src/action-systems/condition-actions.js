export class ConditionActions {
    static async perform(step, context, process, item) {
        let ctx;
        let exp;
        if (step.args.condition.indexOf("$context") != -1) {
            ctx = context;
            exp = step.args.condition.replace("$context", "$context");
        }

        if (step.args.condition.indexOf("$process") != -1) {
            ctx = process;
            exp = step.args.condition.replace("$process", "$context");
        }

        if (step.args.condition.indexOf("$item") != -1) {
            ctx = item;
            exp = step.args.condition.replace("$item", "$context");
        }

        const expf = crsbinding.expression.compile(exp);

        if (expf.function(ctx) == true && step.pass_step != null) {
            const nextStep = await this.getNextStep(process, step.pass_step);
            await crs.process.runStep(nextStep, context, process, item);
        }
        else if (step.fail_step != null) {
            const nextStep = await this.getNextStep(process, step.fail_step);
            await crs.process.runStep(nextStep, context, process, item);
        }
    }

    static async getNextStep(process, step) {
        if (typeof step == "object") return step;
        return crsbinding.utils.getValueOnPath(process.steps, step);
    }
}