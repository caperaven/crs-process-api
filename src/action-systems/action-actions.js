export class ActionActions {
    static async perform(step, context, process, item) {
        let expr = `await ${step.args.action.replace("@", "")}(...args)`;
        const fn = new globalThis.crs.AsyncFunction("context", "process", "item", "args", expr);
        return await fn(context, process, item, step.args.parameters);
    }
}