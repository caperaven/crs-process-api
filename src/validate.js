import {ProcessRunner} from "./process-runner.js";

export async function validateArgs(step, context, process, item, def, prefix = "") {
    if (!step.args) {
        throw new Error(`${prefix}Arguments are required`.trim());
    }

    for (const key in def) {
        const arg = def[key];
        const value = await crs.process.getValue(step.args[key], context, process, item);

        if (arg.required && value === undefined) {
            throw new Error(`${prefix}Argument "${key}" is required`.trim());
        }

        if (value !== undefined) {
            const expectedType = arg.type.toLowerCase();
            const actualType = typeof value === "object"
                ? value.constructor.name.toLowerCase()
                : typeof value;

            if (actualType !== expectedType) {
                throw new Error(
                    `${prefix}Argument "${key}" should be of type "${arg.type}"`.trim(),
                );
            }
        } else if (arg.default !== undefined) {
            step.args[key] = arg.default;
        }
    }
}