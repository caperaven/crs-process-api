import {assertStep} from "../provider-utils.js";

export default async function postMessageRule(schema, process, step) {
    return await assertStep(schema, process, step, ["query", "parameters"]);
}