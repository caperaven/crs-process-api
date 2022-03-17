export default class ArrayProvider {
    static async validate(schema, process, step) {
        const processObj = schema[process];
        const stepObj = processObj.steps[step];

        const rule = globalThis.crs.validate.arrayMap[stepObj.action];
        return rule(schema, process, step);
    }

    static async clean(schema, process, step) {

    }
}