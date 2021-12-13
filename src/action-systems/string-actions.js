export class StringActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Given this format, inflate a string and replace the string literal markers with the actual value.
     * Example. "#input/${id}?type='tasks'&typeId='${typeId}'"
     */
    static async inflate (step, context, process, item) {
        if (step.args.parameters == null) {
            return step.args.template;
        }

        let template = step.args.template;
        let parameters = step.args.parameters;

        let result = await inflate_string(template, parameters, context, process, item);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

async function inflate_string(string, parameters, context, process, item) {
    string = string.split("${").join("${context.");
    parameters = await sanitise_parameters(parameters, context, process, item);

    let fn = new Function("context", ["return `", string, "`;"].join(""));
    let result = fn(parameters);
    fn = null;
    return result;
}

// Get the values for each property on the parameters.
async function sanitise_parameters(parameters, context, process, item) {
    const keys = Object.keys(parameters);

    for (let key of keys) {
        let value = parameters[key];
        parameters[key] = await crs.process.getValue(value, context, process, item);
    }

    return parameters
}