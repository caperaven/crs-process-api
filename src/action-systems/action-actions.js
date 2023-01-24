/**
 * This is a static class that contains the actions for the action system
 *
 * Actions support are:
 * - perform - perform an action on a component or element
 *
 */
export class ActionActions {
    /**
     * perform an action on a component or element
     * @param step - step to perform
     * @param context - context of the process
     * @param process - process to perform
     * @param item - item to perform the action on
     *
     * @param step.args.action - action to perform
     * @param step.args.parameters - parameters to pass to the action
     * @param step.args.target - target to set the result of the action to
     *
     * @returns {Promise<*>}
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("action", "perform", {
     *    action: "myAction",
     *    parameters: ["param1", "param2"],
     *    target: "@process.result"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "action",
     *   "action": "perform",
     *   "args": {
     *      "action": "myAction",
     *      "parameters": ["param1", "param2"],
     *      "target": "@process.result"
     *   }, context, process, item);
     **/
    static async perform(step, context, process, item) {
        let expr = `return await ${step.action.replace("$", "")}(...(args||[]))`;

        let fn = process.functions?.[expr];

        if (fn == null) {
            fn = new globalThis.crs.AsyncFunction("context", "process", "item", "args", expr);
            process.functions[expr] = fn;
        }

        let parameters = await getParameters(step, context, process, item);

        const result = await fn(context, process, item, parameters);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

/**
 * get the parameters for the action
 * @param step - step to perform
 * @param context - context of the process
 * @param process - process to perform
 * @param item - item to perform the action on
 *
 * @param step.args.parameters - parameters to pass to the action
 *
 * @returns {Promise<*[]>}
 */
export async function getParameters(step, context, process, item) {
    const parameters = await crs.process.getValue(step.args.parameters, context, process, item);

    let result = [];

    if (parameters == null) return result;

    for (const parameter of parameters) {
        const value = await crs.process.getValue(parameter, context, process, item);
        result.push(value);
    }

    return result;
}

/**
 * utility function to call a function on a path of an object
 * @param source - object to call the function on
 * @param step - step to perform
 * @param context - context of the process
 * @param process - process to perform
 * @param item - item to perform the action on
 *
 * @param step.args.action - action to perform
 * @param step.args.parameters - parameters to pass to the action
 * @param step.args.target - target to set the result of the action to
 *
 * @returns {Promise<*>}
 */
export async function callFunctionOnPath(source, step, context, process, item) {
    const action = await crs.process.getValue(step.args.action, context, process, item);

    const args = await getParameters(step, context, process, item);
    const fn = await crsbinding.utils.getValueOnPath(source, action);

    let callContext = source;
    if(action.indexOf(".") !== -1) {
        const parts = action.split(".");
        parts.pop();
        const contextPath = parts.join(".");
        callContext = await crsbinding.utils.getValueOnPath(source, contextPath);
    }

    return fn.call(callContext, ...args);
}

crs.intent.action = ActionActions;