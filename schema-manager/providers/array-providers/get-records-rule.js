import {assertStep} from "../provider-utils";

export default async function getRecordsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "target", "page_number", "page_size"]);
}