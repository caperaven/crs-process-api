export default class ArrayProvider {
    static async validate(schema, process, step) {
        return await crs.call("validate", "assert_step", {
            source: schema,
            process: process,
            step: step,
            required: ["action"]
        })
    }

    static async clean(schema, process, step) {

    }
}