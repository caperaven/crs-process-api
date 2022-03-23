import {assertStep} from "../provider-utils.js";

export default async function getPageRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "page_size", "page_number", "fields", "target"]);
}