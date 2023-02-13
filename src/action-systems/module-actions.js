/**
 * @class ModuleActions - The module action system.
 * @description It provides a way to call a module function, create an instance of a module class, or get the value of
 * a module constant
 *
 * Features:
 * perform - The main entry point for the module action system.
 * call - Call a module function.
 * create_class - Create an instance of a module class.
 * get_constant - Get the value of a module constant and returns it.
 */
export class ModuleActions {
    static async perform(step, context, process, item) {
        const ctx = step.args.context ? await crs.process.getValue(step.args.context, context, process, item) : context;
        const result = await this[step.action]?.(step, ctx);

        if (result != null && step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
    }

    /**
     * @method call - Call a module function
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the module.
     *
     * @param step.args.default {boolean} - If true, it will call the default function in the module.
     * @param step.args.module {string} - The name of the module to call.
     * @param step.args.fnName {string} - The name of the function to call.
     * @param step.args.parameters {object} - The parameters to pass to the function.
     * @param [step.args.target = "$context.result] {string} - The name of the variable to store the result in.
     *
     * @returns The result of the module call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("module", "call", {
     *     default: true,
     *     module: "module",
     *    "parameters": {parameters}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "module",
     *    "action": "call",
     *    "args": {
     *        "default": false,
     *        "module": "module",
     *        "function": "function",
     *        "parameters": {parameters},
     *        "target": "$context.result"
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
     * @method create_class - creates an instance of a module
     * @param step - The step object that is being executed.
     *
     * @param step.args.default {boolean} - If true, it will create an instance of the default class in the module.
     * @param step.args.module {string} - The name of the module that contains the class.
     * @param [step.args.class = "class"] {string} - The name of the class to create an instance of.
     * @param step.args.parameters {object} - The parameters to pass to the constructor.
     * @param [step.args.target = "$context.result] {string} - The name of the variable to store the result in.
     *
     * @returns The instance of the class.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("module", "create_class", {
     *     default: false,
     *     module: "module",
     *     class: "class",
     *     parameters: {parameters},
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "module",
     *   "action": "create_class",
     *   "args": {
     *      "default": true,
     *      "module": "module",
     *      "parameters": {parameters},
     *      "target": "$context.result"
     *   }
     * }
     */
    static async create_class(step) {
        if (step.args.default === true) {
            return await crs.modules.getInstanceOfDefault(step.args.module, step.args.parameters);
        }

        return await crs.modules.getInstanceOf(step.args.module, step.args.class, step.args.parameters);
    }

    /**
     * @method get_constant - It returns the value of a constant in a module
     * @param step - The step object that is being executed.
     *
     * @param step.args.module {string} - The name of the module that contains the constant.
     * @param step.args.name {string} - The name of the constant.
     * @param [step.args.target = "$context.result] {string} - The name of the variable to store the result in.
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
     *          "name": "constant",
     *          "target": "$context.result"
     *      }
     * }
     */
    static async get_constant(step) {
        return await crs.modules.getConstant(step.args.module, step.args.name);
    }
}

crs.intent.module = ModuleActions;