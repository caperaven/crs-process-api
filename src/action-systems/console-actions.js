/**
 * ConsoleActions provides access to the console.md with common features
 */
import * as Console from "console";

export class ConsoleActions {
    static async perform(step, context, process, item) {
        if (step.args.messages != null) {
            for (let message of step.args.messages) {
                let value = await crs.process.getValue(message, context, process, item);
                await this[step.action]?.(value, context, process);
            }
            return;
        }

        const message = await crs.process.getValue(step.args.message, context, process, item);
        await this[step.action]?.(message, context, process);
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

crs.intent.console = ConsoleActions;