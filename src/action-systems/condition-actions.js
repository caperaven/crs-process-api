/**
 * @class ConditionActions - A class that contains the actions for the condition action system.
 *
 * Features:
 * perform - The perform function is a static function that is called by the process function.
 *
 * If the condition is true, run the pass step, otherwise run the fail step.
 */
export class ConditionActions {

    /** "If the condition is true, run the pass step, otherwise run the fail step."
     * The `perform` method is the only method that is required for a step. It is called when the step is run
     *
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The process object that is being executed.
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.condition - The condition to evaluate
     * @param {string} [step.pass_step] - The step to run if the condition is true
     * @param {string} [step.fail_step] - The step to run if the condition is false
     * @param {string} [step.args.target] - The target to set the result of the condition to
     *
     * @returns {boolean} - The result of the condition
     *
     * @example <caption>javascript<example>
     *     const result = await crs.call("condition", "if", {
     *     condition: "value == 10 ? true"
     *     };
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "condition",
     *    "action": "if",
     *    "args": {
     *    "condition": "value == 10 ? true"
     *    },
     *    "pass_step": "step1",
     *    "fail_step": "step2"
     * }
     */
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

/**
 * @method - It takes a condition and a process, and returns a function that takes a context, process, and item, and returns the
 * result of evaluating the condition
 * @param condition - The condition to be evaluated.
 * @param process - the process object
 *
 * @returns A function that takes in a context, process, and item and returns the result of the expression.
 */
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

/**
 * @method - It takes an expression and replaces all instances of `$binding.property` with `crsbinding.data.getProperty(bindingId,
 * "property")`
 * @param exp - The expression to process
 * @param bId - The binding id of the element.
 * @returns The value of the property.
 */
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