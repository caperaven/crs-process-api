export class ConditionActions {
    static async perform(step, context, process) {
        let exp = step.args.condition.replace("@item", "context");
        const expf = crsbinding.expression.compile(exp);

        if (expf.function(context) == true && step.args.pass_step != null) {
            await crs.process.runStep(step.args.pass_step, context, process);
        }
    }
}