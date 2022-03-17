export default async function addRule(schema, process, step) {
    return await crs.call("validate", "assert", {
        source: schema,
        process: process,
        step: step,
        required: {
            target: '"target" must have a value',
            value: '"value" must have a value'
        }
    })
}