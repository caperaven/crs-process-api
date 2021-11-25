export class SystemActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    get(step, context, process, item) {

    }

    post(step, context, process, item) {

    }

    put(step, context, process, item) {

    }

    delete(step, context, process, item) {

    }
}