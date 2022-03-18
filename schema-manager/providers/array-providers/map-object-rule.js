export default async function mapObjectRule(schema, process, step) {
    return await crs.call("validate", "assert_step", {
        source: schema,
        process: process,
        step: step,
        required: ["source", "target", "field"]
    })
}