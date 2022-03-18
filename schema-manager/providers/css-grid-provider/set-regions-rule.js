import {assertStep} from "../provider-utils";

export default async function setRegionsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "areas"]);
}