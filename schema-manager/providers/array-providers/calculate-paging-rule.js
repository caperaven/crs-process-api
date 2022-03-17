export default async function calculatePagingRule(schema, process, step) {
    return await crs.call("validate", "assert", {
        source: schema,
        process: process,
        step: step,
        required: {
            source: '"source" must have a value',
            page_size: '"page_size" must have a value',
            target: '"target" must have a value'
        }
    })
}