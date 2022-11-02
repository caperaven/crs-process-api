/**
 * ConsoleActions provides access to the console.md with common features
 */
export class ConsoleActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

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

    static async error(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        console.error(message);
    }

    static async warn(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        console.warn(message);
    }

    static async table(step, context, process, item) {
        const message = await crs.process.getValue(step.args.message, context, process, item);
        console.table(message);
    }
}

crs.intent.console = ConsoleActions;