import {assertStep} from "../provider-utils";

export default async function getValueRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "target", "index", "field"]);
}