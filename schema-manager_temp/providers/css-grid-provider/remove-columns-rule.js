import {assertStep} from "../provider-utils";

export default async function removeColumnsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element"]);
}