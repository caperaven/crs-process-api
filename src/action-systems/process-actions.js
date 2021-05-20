export class ProcessActions {
    static async perform(step, context, process, item) {
        await crsbinding.events.emitter.emit("run-process", {
            step: step,
            context: context,
            process: process,
            item: item
        });
    }
}