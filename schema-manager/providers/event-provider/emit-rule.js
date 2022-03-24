import {assertStep} from "../provider-utils.js";

export default async function emitRule(schema, process, step) {
    return await assertStep(schema, process, step, ["event", "parameters"]);
}