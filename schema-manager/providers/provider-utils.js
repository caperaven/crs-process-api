export async function validate(schema, process, step, map) {
    const processObj = schema[process];
    const stepObj = processObj.steps[step];

    const rule = map[stepObj.action];
    return rule(schema, process, step);
}

export async function assertStep(schema, process, step, required) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: required
    })
}