import {assertStep} from "../provider-utils.js";

export default async function deleteRecordRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "key"]);
}