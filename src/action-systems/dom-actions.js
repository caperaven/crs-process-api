export class DomActions {
    static async perform(step, context, process) {
        await this[step.action]?.(step.args.message, context, process);
    }

    static async setAttribute(step, context, process, item) {

    }

    static async getAttribute(step, context, process, item) {

    }

    static async getStyle(step, context, process, item) {

    }

    static async setStyle(step, context, process, item) {

    }

    static async getText(step, context, process, item) {

    }

    static async setText(step, context, process, item) {

    }

    static async createElement(step, context, process, item) {

    }

    static async postMessage(step, context, process, item) {

    }
}