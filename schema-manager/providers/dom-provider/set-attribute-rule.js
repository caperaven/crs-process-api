import {assertStep} from "../provider-utils.js";

export default async function setAttributeRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "attr", "value"]);
}