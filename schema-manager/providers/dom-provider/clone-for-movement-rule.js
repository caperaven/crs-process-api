import {assertStep} from "../provider-utils.js";

export default async function openTabRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "parent"]);
}