export default async function changeValuesRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: {
            source: '"source" must have a value',
            changes: '"changes" must have a value',
        }
    })
}