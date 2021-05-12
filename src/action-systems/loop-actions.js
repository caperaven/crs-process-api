export class LoopActions {
    static async perform(step, context, process) {
        const source = await crs.process.getValue(step.args.source, context, process);
        const startStep = step.args.steps[step.args.start];

        for (let item of source) {
            await crs.process.runStep(startStep, context, process, item);
        }
    }
}