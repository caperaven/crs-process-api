import {assertStep} from "../provider-utils";

export default async function getRangeRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "target", "field"]);
}