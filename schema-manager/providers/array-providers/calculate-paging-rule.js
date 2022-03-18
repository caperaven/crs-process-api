export default async function calculatePagingRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: ["source", "page_size", "target"]
    })
}