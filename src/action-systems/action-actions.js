export class ActionActions {
    static async perform(step, context, process, item) {
        let expr = `return await ${step.action.replace("@", "")}(...(args||[]))`;
        const fn = new globalThis.crs.AsyncFunction("context", "process", "item", "args", expr);
        const result = await fn(context, process, item, step.args.parameters);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}