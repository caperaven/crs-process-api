import {assertStep} from "../provider-utils.js";

export default async function deleteRule(schema, process, step) {
    return await assertStep(schema, process, step, ["name"]);
}