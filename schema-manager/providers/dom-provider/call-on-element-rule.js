import {assertStep} from "../provider-utils.js";

export default async function callOnElementRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "action", "parameters", "target"]);
}