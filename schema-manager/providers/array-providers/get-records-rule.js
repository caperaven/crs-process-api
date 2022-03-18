export default async function getRecordsRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: ["source", "target", "page_number", "page_size"]
    })
}