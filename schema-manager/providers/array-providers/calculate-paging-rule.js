import {assertStep} from "../provider-utils";

export default async function calculatePagingRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "page_size", "target"]);
}