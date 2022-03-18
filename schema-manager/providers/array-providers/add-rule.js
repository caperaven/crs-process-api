import {assertStep} from "../provider-utils";

export default async function addRule(schema, process, step) {
    return await assertStep(schema, process, step, ["target", "value"]);
}