/**
 * ConsoleActions provides access to the console.md with common features
 */

export class ConsoleActions {
    static async perform(step, context, process) {
        if (step.args.messages != null) {
            for (let message of step.args.messages) {
                await this[step.action]?.(message, context, process);
            }
            return;
        }

        await this[step.action]?.(step.args.message, context, process);
    }

    static async log(message, context, process) {
        console.log(await crs.process.getValue(message, context, process));
    }

    static async error(message, context, process) {
        console.error(await crs.process.getValue(message, context, process));
    }

    static async warn(message, context, process) {
        console.warn(await crs.process.getValue(message, context, process));
    }

    static async table(message, context, process) {
        console.table(await crs.process.getValue(message, context, process));
    }
}