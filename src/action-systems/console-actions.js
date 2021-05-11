/**
 * ConsoleActions provides access to the console with common features
 */

export class ConsoleActions {
    static async perform(step, context, process) {
        return await this[step.action]?.(step.args, context, process);
    }

    static async log(args, context, process) {
        console.log(await crs.process.getValue(args?.message, context, process));
    }

    static async error(args, context, process) {
        console.error(await crs.process.getValue(args?.message, context, process));
    }

    static async warn(args, context, process) {
        console.warn(await crs.process.getValue(args?.message, context, process));
    }

    static async table(args, context, process) {
        console.table(await crs.process.getValue(args?.message, context, process));
    }
}