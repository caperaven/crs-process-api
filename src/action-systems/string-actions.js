export class StringActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Given this format, inflate a string and replace the string literal markers with the actual value.
     * Examples.
     *      "#input/${id}?type='tasks'&typeId='${typeId}'"
     *      "${firstName} ${lastName} = ${age} old"
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

    static async to_array(step, context, process, item) {
        let str = await crs.process.getValue(step.args.source, context, process, item);
        let result = str.split(step.args.pattern);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async from_array(step, context, process, item) {
        let array = await crs.process.getValue(step.args.source, context, process, item);
        let separator = step.args.separator || "";
        let result = array.join(separator);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    static async replace(step, context, process, item) {
        let str = await crs.process.getValue(step.args.source, context, process, item);
        const pattern = await crs.process.getValue(step.args.pattern, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        let result = str.split(pattern).join(value);

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

crs.intent.string = StringActions;