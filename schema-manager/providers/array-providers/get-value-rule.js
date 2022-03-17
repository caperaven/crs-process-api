export default async function getValueRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: {
            source      : '"source" must have a value',
            target      : '"target" must have a value',
            index       : '"index" must have a value',
            field       : '"field" must have a value',
        }
    })
}