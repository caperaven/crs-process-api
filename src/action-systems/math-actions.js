/**
 * @class MathActions - This class contains all math actions that can be performed by the action system.
 * @description  It takes a step, context, process, and item, and then it gets the value of each of the arguments, calls the appropriate
 * Math function, and then sets the result to the target
 *
 * Features:
 * perform - This function is called by the action system.
 * add - This function adds two numbers together
 * subtract - This function subtracts the value of the second input from the value of the first input
 * multiply - This function multiplies two numbers together
 * divide - This function divides the value of the first input by the value of the second input
 * do_math -  It takes two values, performs a mathematical operation on them, and then stores the result in a variable and returns it.
 * do_math_api - it gets the value of each of the arguments, calls the appropriate Math function, and then sets the result to the target
 * normalize - This function normalizes a value between a min and max value
 */
export class MathActions {
    static async perform(step, context, process, item) {
        if (this[step.action] != null) {
            return await this[step.action](step, context, process, item);
        }
        else {
            return await this.do_math_api(step, context, process, item);
        }
    }


    /**
     * @method This function adds two numbers together
     * @param step - the step object
     * @param context - The context object that is passed to the step.
     * @param process - The process object that is currently running.
     * @param item - the item that is being processed
     *
     * @param step.args.value1 {string} - The first value to add
     * @param step.args.value2 {string} - The second value to add
     * @param step.args.target {string} - The target to store the result in
     *
     * @returns The result of the do_math function.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("math", "add", {
     *     value1: 1,
     *     value2: 2
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "math",
     *      "action": "add",
     *      "args": {
     *          "value1": 1,
     *          "value2": 2
     *      }
     *   }
     */
    static async add(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 + value2);
    }

    /**
     * @method Subtracts the value of the second input from the value of the first input
     * @param step - The step object from the workflow definition
     * @param context - The context object that is passed to the function.
     * @param process - The process object
     * @param item - the item that is being processed
     *
     * @param step.args.value1 {string} - The first value to subtract from
     * @param step.args.value2 {string} - The second value to subtract
     * @param step.args.target {string} - The target to store the result in
     *
     * @returns The result of the math operation.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("math", "subtract", {
     *    value1: 5,
     *    value2: 2
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "math",
     *     "action": "subtract",
     *     "args": {
     *          "value1": 5,
     *          "value2": 2
     *          "target": "$context.result"
     *     }
     * }
     */
    static async subtract(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 - value2);
    }


    /**
     * @method This function takes two numbers, multiplies them, and returns the result
     * @param step - the step object
     * @param context - The context object that is passed to the step.
     * @param process - the process object
     * @param item - the item that is being processed
     *
     * @param step.args.value1 {string} - The first value to multiply
     * @param step.args.value2 {string} - The second value to multiply
     * @param step.args.target {string} - The target to store the result in
     *
     * @returns The result of the math operation.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("math", "multiply", {
     *    value1: 2,
     *    value2: 3
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "math",
     *    "action": "multiply",
     *    "args": {
     *          "value1": 2,
     *          "value2": 3
     *          "target": "$context.result"
     *    }
     * }
     */
    static async multiply(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 * value2);
    }

    /**
     * @method This function divides the first input by the second input and returns the result
     * @param step - the step object
     * @param context - The context object that is passed to the function.
     * @param process - The process object that is currently running.
     * @param item - the item that is being processed
     *
     * @param step.args.value1 {string} - The first value to divide
     * @param step.args.value2 {string} - The second value to divide by
     * @param step.args.target {string} - The target to store the result in
     *
     * @returns The result of the do_math function.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("math", "divide", {
     *   value1: 6,
     *   value2: 2
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "math",
     *   "action": "divide",
     *   "args": {
     *          "value1": 6,
     *          "value2": 2
     *          "target": "$context.result"
     *    }
     * }
     */
    static async divide(step, context, process, item) {
        return await this.do_math(step, context, process, item, (value1, value2) => value1 / value2);
    }

    /**
     * @method It takes two values, performs a mathematical operation on them,and then stores the result in a variable
     * and returns it.
     * @param step - The step object
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.value1 {string} - The first value to perform the math operation on
     * @param step.args.value2 {string} - The second value to perform the math operation on
     * @param step.args.target {string} - The target to store the result in
     *
     * @returns The result of the math operation.
     */
    static async do_math(step, context, process, item, fn) {
        const value1 = await crs.process.getValue(step.args.value1, context, process, item);
        const value2 = await crs.process.getValue(step.args.value2, context, process, item);
        const result =  fn(value1, value2)

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method It takes a step, context, process, and item, and then it gets the value of each of the arguments, calls the
     * appropriate Math function, and then sets the result to the target
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.value {object} - The [value] to perform the math operation on
     * @param step.args.target {string} - The target to store the result in
     *
     * @returns The result of the math operation.
     */
    static async do_math_api(step, context, process, item) {
        const args = [];

        const params = Array.isArray(step.args.value) ? step.args.value : [step.args.value];
        for (let param of params) {
            const value = await crs.process.getValue(param, context, process, item);
            args.push(value);
        }

        const result = Math[step.action]?.(...args);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method This function takes a number and returns the absolute value of that number
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.value {string} - The value to perform the math operation on
     * @param step.args.min {string} - The minimum value to return
     * @param step.args.max {string} - The maximum value to return
     * @param step.args.target {string} - The target to store the result in
     *
     * @returns The normalized value.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("math", "normalize", {
     *     value: 10,
     *     min: 0,
     *     max: 100
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "math",
     *    "action": "normalize",
     *    "args": {
     *        "value": 10,
     *        "min": 0,
     *        "max": 100
     *        "target": "$context.result"
     *     }
     * }
     */
    static async normalize(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const min = await crs.process.getValue(step.args.min, context, process, item);
        const max = await crs.process.getValue(step.args.max, context, process, item);
        const result = Number(((value - min) / (max - min)).toFixed(2));

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.math = MathActions;