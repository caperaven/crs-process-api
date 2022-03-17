export default async function getRecordsRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: {
            source      : '"source" must have a value',
            target      : '"target" must have a value',
            page_number : '"page_number" must have a value',
            page_size   : '"page_size" must have a value',
        }
    })
}