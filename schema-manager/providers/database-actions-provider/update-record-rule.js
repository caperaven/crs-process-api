import {assertStep} from "../provider-utils.js";

export default async function updateRecordRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "key", "model"]);
}