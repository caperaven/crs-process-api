import {assertStep} from "../provider-utils.js";

export default async function getElementRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "target"]);
}