export class ProcessActions {
    static async perform(step, context, process, item) {
        const parameters = {};

        if (step.args?.parameters != null) {
            const keys = Object.keys(step.args.parameters);
            for (let key of keys) {
                parameters[key] = await crs.process.getValue(step.args.parameters[key], context, process, item);
            }
        }

        await crsbinding.events.emitter.emit("run-process", {
            step: step,
            context: context,
            process: process,
            item: item,
            parameters: parameters
        });
    }
}