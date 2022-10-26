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
        exp = processBinding(exp, process.parameters.bId);
    }

    exp = exp.split("$").join("");

    const code = `return ${exp}`;
    return new Function("context", "process", "item", code);
}

function processBinding(exp, bId) {
    const is = exp.indexOf("$binding");
    const ie = exp.indexOf(" ", is);
    const sub = exp.substring(is, ie);
    const parts = sub.split(".");
    const property = parts[1];

    const code = [`crsbinding.data.getProperty(${bId}, "${property}")`];

    if (parts.length > 2) {
        parts.splice(0, 2);
        code.push(parts.join("."))
    }

    const expa = Array.from(exp)
    expa.splice(is, ie - is, code.join("."));
    exp = expa.join("");

    if (exp.indexOf("$binding") != -1) {
        exp = processBinding(exp, bId);
    }

    return exp;
}

crs.intent.condition = ConditionActions;