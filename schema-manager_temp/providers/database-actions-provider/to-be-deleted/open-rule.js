import {assertStep} from "../provider-utils.js";

export default async function openRule(schema, process, step) {
    return await assertStep(schema, process, step, ["name", "version", "tables", "target"]);
}