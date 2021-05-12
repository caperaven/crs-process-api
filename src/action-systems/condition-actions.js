export class ConditionActions {
    static async perform(step, context, process, item) {
        const ctx = step.args.condition.indexOf("@item" != -1) ? item : context;

        let exp = step.args.condition.replace("@item", "context");
        const expf = crsbinding.expression.compile(exp);

        if (expf.function(ctx) == true && step.args.pass_step != null) {
            await crs.process.runStep(step.args.pass_step, context, process, item);
        }
    }
}