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

        let parameters = await getParameters(step, context, process, item);

        const result = await fn(context, process, item, parameters);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

export async function getParameters(step, context, process, item) {
    const parameters = await crs.process.getValue(step.args.parameters, context, process, item);

    let result = [];

    if (parameters == null) return result;

    for (const parameter of parameters) {
        const value = await crs.process.getValue(parameter, context, process, item);
        result.push(value);
    }

    return result;
}