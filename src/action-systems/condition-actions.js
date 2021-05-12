export class ConditionActions {
    static async perform(step, context, process, item) {
        let ctx;
        if (step.args.condition.indexOf("@context") != -1) {
            ctx = context;
        }

        if (step.args.condition.indexOf("@process") != -1) {
            ctx = process;
        }

        if (step.args.condition.indexOf("@item") != -1) {
            ctx = item;
        }

        let exp = step.args.condition.replace("@item", "context");
        const expf = crsbinding.expression.compile(exp);

        if (expf.function(ctx) == true && step.args.pass_step != null) {
            await crs.process.runStep(step.args.pass_step, context, process, item);
        }
        else if (step.args.fail_step != null) {
            await crs.process.runStep(step.args.fail_step, context, process, item);
        }
    }
}