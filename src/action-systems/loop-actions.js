export class LoopActions {
    static async perform(step, context, process) {
        const source = await crs.process.getValue(step.args.source, context, process);
        const stepKeys = Object.keys(step.args.steps);
        for (let item of source) {
            for (let stepKey of stepKeys) {
                const s = step.args.steps[stepKey];
                await crs.process.runStep(s, context, process, item);
            }
        }
    }
}