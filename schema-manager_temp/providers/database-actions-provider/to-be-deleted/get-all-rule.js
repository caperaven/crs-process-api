import {assertStep} from "../provider-utils.js";

export default async function getAllRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "target"]);
}