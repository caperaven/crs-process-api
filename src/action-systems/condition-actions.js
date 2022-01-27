export class ConditionActions {
    static async perform(step, context, process, item) {
        let ctx;
        let exp;
        let expf;

        if (step.args.condition.indexOf("$context") != -1) {
            ctx = context;
            exp = step.args.condition.split("$context").join("$context");
        }
        else if (step.args.condition.indexOf("$process") != -1) {
            ctx = process;
            exp = step.args.condition.split("$process").join("$context");
        }
        else if (step.args.condition.indexOf("$item") != -1) {
            ctx = item;
            exp = step.args.condition.split("$item").join("$context");
        }
        else if (step.args.condition.indexOf("$binding") != -1) {
            // todo: Gerhard, give binding expression.
            const bId = process.parameters.bId;
            const parts = step.args.condition.replace("$binding.", "").split(" ");
            const property = parts[0];
            parts.splice(0, 1);

            exp = `return crsbinding.data.getProperty(${bId}, "${property}") ${parts.join(" ")}`;
            expf = crsbinding.expression.compile(exp, null, {sanitize: false});
        }

        expf = expf || crsbinding.expression.compile(exp);
        const success = expf.function(ctx) == true;

        if (success && step.pass_step != null) {
            const nextStep = await this.getNextStep(process, step.pass_step);
            await crs.process.runStep(nextStep, context, process, item);
        }
        if (!success && step.fail_step != null) {
            const nextStep = await this.getNextStep(process, step.fail_step);
            await crs.process.runStep(nextStep, context, process, item);
        }

        return success;
    }

    static async getNextStep(process, step) {
        if (typeof step == "object") return step;
        return crsbinding.utils.getValueOnPath(process.steps, step);
    }
}