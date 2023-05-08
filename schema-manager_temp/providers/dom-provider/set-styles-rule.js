import {assertStep} from "../provider-utils.js";

export default async function setStylesRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "styles"]);
}