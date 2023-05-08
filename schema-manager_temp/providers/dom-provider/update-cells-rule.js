import {assertStep} from "../provider-utils.js";

export default async function updateCellsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["template_id", "data", "parent"]);
}