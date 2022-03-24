import {assertStep} from "../provider-utils.js";

export default async function filterChildrenRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "filter"]);
}