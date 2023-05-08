export default class ActionProvider {
    static async validate(schema, process, step) {
        const processObj = schema[process];
        const stepObj = processObj.steps[step];
        return await crs.call("object", "assert", {source: stepObj, properties: ["action"]});
    }
}