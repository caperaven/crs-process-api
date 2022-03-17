export default async function concatRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: {
            sources: '"sources" must have a value',
            target: '"target" must have a value',
        }
    })
}