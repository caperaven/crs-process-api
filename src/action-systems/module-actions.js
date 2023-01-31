export class ModuleActions {
    static async perform(step, context, process, item) {
        const ctx = step.args.context ? await crs.process.getValue(step.args.context, context, process, item) : context;
        const result = await this[step.action]?.(step, ctx);

        if (result != null && step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
    }

    /**
     * > Call a module function
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the module.
     *
     * @param module {string} - The name of the module to call.
     * @param function {string} - The name of the function to call.
     * @param parameters {object} - The parameters to pass to the function.
     *
     * @returns The result of the module call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("module", "call", {
     *     module: "module",
     *     function: "function",
     *     parameters: {
     *       parameter: "value"
     *     }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "module",
     *    "action": "call",
     *    "args": {
     *        "module": "module",
     *        "function": "function",
     *        "parameters": {
     *              "parameter": "value"
     *          }
     *    }
     * }
     *
     */
    static async call(step, context) {
        if (step.args.default === true) {
            return await crs.modules.callDefault(step.args.module, context, step.args.parameters);
        }

        return await crs.modules.call(step.args.module, context, step.args.fnName, step.args.parameters);
    }

    /**
     * creates an instance of a module
     * @param step - The step object that is being executed.
     *
     * @param module {string} - The name of the module that contains the class.
     * @param parameters {object} - The parameters to pass to the constructor.
     *
     * @returns The instance of the class.
     *
     * @example <caption>javascript example</caption>
     * const instance = await crs.call("module", "create_class", {
     *     module: "module",
     *     parameters: {
     *          parameter: "value"
     *     }
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "module",
     *   "action": "create_class",
     *   "args": {
     *      "module": "module",
     *      "parameters": {
     *          "parameter": "value"
     *      }
     *    }
     * }
     *
     */
    static async create_class(step) {
        if (step.args.default === true) {
            return await crs.modules.getInstanceOfDefault(step.args.module, step.args.parameters);
        }

        return await crs.modules.getInstanceOf(step.args.module, step.args.class, step.args.parameters);
    }

    /**
     * It returns the value of a constant in a module
     * @param step - The step object that is being executed.
     *
     * @param module {string} - The name of the module that contains the constant.
     * @param name {string} - The name of the constant.
     *
     * @returns The constant value of the module and name.
     *
     * @example <caption>javascript example</caption>
     * const constant = await crs.call("module", "get_constant", {
     *    module: "module",
     *    name: "constant"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "module",
     *      "action": "get_constant",
     *      "args": {
     *          "module": "module",
     *          "name": "constant"
     *      }
     * }
     */
    static async get_constant(step) {
        return await crs.modules.getConstant(step.args.module, step.args.name);
    }
}

crs.intent.module = ModuleActions;