/**
 * ConsoleActions provides access to the console.md with common features
 */

export class ConsoleActions {
    static async perform(step, context, process, item) {
        if (step.args.messages != null) {
            for (let message of step.args.messages) {
                let value = crs.process.getValue(message, context, process, item);
                await this[step.action]?.(value, context, process);
            }
            return;
        }

        await this[step.action]?.(step.args.message, context, process);
    }

    static async log(message) {
        console.log(message);
    }

    static async error(message) {
        console.error(message);
    }

    static async warn(message) {
        console.warn(message);
    }

    static async table(message) {
        console.table(message);
    }
}