import {assertStep} from "../provider-utils.js";

export default async function perspectiveRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "perspective", "target"]);
}