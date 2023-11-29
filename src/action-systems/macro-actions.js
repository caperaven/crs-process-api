export class MacroActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async start(step, context, process, item) {

    }

    static async stop(step, context, process, item) {

    }

    static async pause(step, context, process, item) {

    }

    static async resume(step, context, process, item) {

    }

    static async clear(step, context, process, item) {

    }

    static async save(step, context, process, item) {

    }

    static async load(step, context, process, item) {

    }
}

crs.managers ||= {};
crs.intent.macro_recorder = MacroActions;