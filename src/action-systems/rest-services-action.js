export class SystemActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    get(step, context, process, item) {
        // url:// https://api.guildwars2.com/v2/account/achievements/
    }

    post(step, context, process, item) {

    }

    put(step, context, process, item) {

    }

    delete(step, context, process, item) {

    }
}