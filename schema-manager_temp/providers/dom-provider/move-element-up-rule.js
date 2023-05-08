import {assertStep} from "../provider-utils.js";

export default async function moveElementUpRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element"]);
}