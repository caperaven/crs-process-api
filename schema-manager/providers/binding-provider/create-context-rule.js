export default async function createContextRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: []
    })
}