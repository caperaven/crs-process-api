import {assertStep} from "../provider-utils.js";

export default async function setStyleRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "style", "value"]);
}