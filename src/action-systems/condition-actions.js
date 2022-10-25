export class ConditionActions {
    static async perform(step, context, process, item) {
        const fn = compileExpression(step.args.condition, process);

        const success = fn(context, process, item);

        if (success && step.pass_step != null) {
            const nextStep = await crs.getNextStep(process, step.pass_step);
            await crs.process.runStep(nextStep, context, process, item);
        }
        if (!success && step.fail_step != null) {
            const nextStep = await crs.getNextStep(process, step.fail_step);
            await crs.process.runStep(nextStep, context, process, item);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, success, context, process, item);
        }

        return success;
    }
}

function compileExpression(condition, process) {
    let exp = condition;

    for (const key of Object.keys(process.prefixes)) {
        exp = exp.split(key).join(process.prefixes[key]);
    }

    if (exp.indexOf("$binding") != -1) {
        exp = exp.split("$binding(").join(`crsbinding.data.getProperty(${process.parameters.bId},`);
    }

    exp = exp.split("$").join("");

    const code = `return ${exp}`;
    return new Function("context", "process", "item", code);
}

crs.intent.condition = ConditionActions;