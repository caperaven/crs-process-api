export default class ArrayProvider {
    static async validate(schema, process, step) {
        const rule = globalThis.crs.validate.arrayMap[step.action];
        return rule(schema, process, step);
    }

    static async clean(schema, process, step) {

    }
}