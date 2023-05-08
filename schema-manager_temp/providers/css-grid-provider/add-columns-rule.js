import {assertStep} from "../provider-utils";

export default async function addColumnsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "width"]);
}