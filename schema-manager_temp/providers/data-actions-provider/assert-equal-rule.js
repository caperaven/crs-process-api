import {assertStep} from "../provider-utils.js";

export default async function assertEqualRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "expr", "target"]);
}