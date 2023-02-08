/**
 * @class CompileActions - Actions that compile expressions
 * @memberof crs.intent
 *
 * Features:
 * perform - The perform function is a static function that is called by the process function. It calls the action
 * if_value - If the expression is true, return the value of the expression, otherwise return null
 * case_value - Compiles a case statement and returns the value of the first expression that is true
 */
export class CompileActions {
    /**
     * @method - The `perform` function is a static function that is called by the `process` function. It calls the `action`
     * function that is passed in the `step` object
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The process object that is being executed.
     * @param item - The item that is being processed.
     */
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method -If the expression is true, return the value of the expression, otherwise return null
     *
     * @param step - The step object
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.exp - The expression to evaluate
     * @param {string} [step.args.target] - The target to set the result of the expression to
     *
     * @returns The function that is returned is the function that will be used to evaluate the expression.
     *
     * @example <caption>javascript<example>
     * const result = await crs.call("compile", "if_value", {
     *     exp: "value == 10 ? true",
     *     target: "result"
     * };
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "compile",
     *     "action": "if_value",
     *     "args": {
     *         "exp": "10",
     *         "target": "result"
     *     }
     *  }
     */
    static async if_value(step, context, process, item) {
        const exp = await crs.process.getValue(step.args.exp, context, process, item);
        const fn = await crsbinding.expression.ifFunction(exp);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, fn, context, process, item);
        }

        return fn;
    }

    /**
     * @method - Compiles a case expression
     * @param step
     * @param context
     * @param process
     * @param item
     *
     * @param {string} step.args.exp - The expression to evaluate
     * @param {string} [step.args.target] - The target to set the result of the expression to
     *
     * @returns {Promise<Function | Function>}
     *
     * @example <caption>javascript<example>
     * const result = await crs.call("compile", "case_value", {
     *    exp: "value < 10: 'yes', value < 20: 'ok', default: 'no'"
     *    target: "result"
     *    };
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "compile",
     *     "action": "case_value",
     *     "args": {
     *         "exp": "value < 10: 'yes', value < 20: 'ok', default: 'no'",
     *         "target": "result"
     *     }
     * }
     */
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