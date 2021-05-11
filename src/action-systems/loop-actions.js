export class LoopActions {
    static async perform(step, context, process) {
        const source = await crs.process.getValue(step.args.source, context, process);
        for (let item of source) {
            await this.processSteps(step.args.steps, item, process);
        }
    }

    static async processSteps(steps, item, process) {
        for (let step of steps) {
            await crs.intent[step.type].perform(step, item, process);
        }
    }
}