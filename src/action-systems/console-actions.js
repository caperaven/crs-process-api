/**
 * ConsoleActions provides access to the console.md with common features
 */
export class ConsoleActions {
    /**
     * > The `perform` function is a static function that is called by the `process` function. It takes the `step` object,
     * the `context` object, the `process` function, and the `item` object as arguments. It then calls the `step.action`
     * function, passing the `step`, `context`, `process`, and `item` objects as arguments
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The process object that is being executed.
     * @param item - The item that is being processed.
     *
     * @param {string} step.action - The action to perform
     * @param {object} step.args - The arguments to pass to the action
     * @param {string} step.args.message - The message to log
     * or
     * @param {string} step.args.messages - The messages to log
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("console", "log", {
     *    message: "Hello World"
     *    // or
     *    messages: ["Hello", "World"]
     *    // or
     *    messages: ["Hello", "World", "value"]
     *    // or
     *    messages: ["Hello", "World", "value", {a: 1, b: 2}]
     *    // etc
     * };
     *
     * @example <caption>json example</caption>
     *    {
     *       "type": "console",
     *       "action": "log",
     *       "args": {
     *        "message": "Hello World"
     *        // or
     *        "messages": ["Hello", "World"]
     *       }
     *     }
     *
     * @returns The function that is returned is the function that will be used to evaluate the expression.
     *
     */
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * It takes a message, evaluates it, and logs it to the console
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.message - The message to log
     */
    static async log(step, context, process, item) {
        let message = await crs.process.getValue(step.args.message || step.args.messages, context, process, item);

        if (!Array.isArray(message)) {
            message = [message];
        }

        for (let i = 0; i < message.length; i++) {
            message[i] = await crs.process.getValue(message[i], context, process, item);
        }

        console.log(...message);
    }

    /**
     * > Prints the Error message to the console
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The current item being processed.
     *
     * @param {string} step.args.message - The message to log
     */
    static async error(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        console.error(message);
    }

    /**
     * > This function takes a message and logs it to the console as a warning
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The current item being processed.
     *
     * @param {string} step.args.message - The message to log
     */
    static async warn(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        console.warn(message);
    }

    /**
     * > This function takes a message and displays it in a table
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The current item being processed.
     *
     * @param {string} step.args.message - The message to log
     */
    static async table(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        console.table(message);
    }
}

crs.intent.console = ConsoleActions;