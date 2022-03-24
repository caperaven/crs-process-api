import {assertStep} from "../provider-utils.js";

export default async function createInflationTemplateRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "source", "tag_name"]);
}