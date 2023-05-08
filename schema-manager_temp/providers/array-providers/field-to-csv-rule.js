import {assertStep} from "../provider-utils";

export default async function fieldToCsvRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "target", "delimiter", "field"]);
}