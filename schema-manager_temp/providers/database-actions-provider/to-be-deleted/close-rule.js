import {assertStep} from "../provider-utils.js";

export default async function closeRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db"]);
}