import {assertStep} from "../provider-utils";

export default async function setPropertyRule(schema, process, step) {
    return await assertStep(schema, process, step, ["property", "value"]);
}