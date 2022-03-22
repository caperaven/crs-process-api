import {assertStep} from "../provider-utils.js";

export default async function iso8601BatchRule(schema, process, step) {
    return await assertStep(schema, process, step, ["value", "target"]);
}