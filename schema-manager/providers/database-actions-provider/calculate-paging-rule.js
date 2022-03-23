import {assertStep} from "../provider-utils.js";

export default async function calculatePagingRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "page_size", "target"]);
}