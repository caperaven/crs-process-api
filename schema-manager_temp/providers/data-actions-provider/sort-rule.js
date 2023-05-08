import {assertStep} from "../provider-utils.js";

export default async function sortRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "sort", "target"]);
}