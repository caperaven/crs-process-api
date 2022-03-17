export default async function mapObjectRule(schema, process, step) {
    return await crs.call("validate", "assert", {
        source: schema,
        process: process,
        step: step,
        required: {
            source      : '"source" must have a value',
            target      : '"target" must have a value',
            field       : '"field" must have a value',
        }
    })
}