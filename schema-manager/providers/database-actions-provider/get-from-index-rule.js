import {assertStep} from "../provider-utils.js";

export default async function getFromIndexRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "keys", "target"]);
}