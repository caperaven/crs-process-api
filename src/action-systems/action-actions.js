export class ActionActions {
    static async perform(step, context, process, item) {
        let expr = `return await ${step.action.replace("$", "")}(...(args||[]))`;

        let fn = process?.functions[expr];

        if (fn == null) {
            fn = new globalThis.crs.AsyncFunction("context", "process", "item", "args", expr);

            if (process != null) {
                process.functions[expr] = fn;
            }
        }

        let parameters = await crs.process.getValue(step.args.parameters, context, process, item);

        if (parameters != null) {
            for (let i = 0; i < parameters.length; i++) {
                const path = parameters[i];
                const value = await crs.process.getValue(path, context, process, item);
                parameters[i] = value;
            }
        }

        const result = await fn(context, process, item, step.args.parameters);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}