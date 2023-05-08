import {assertStep} from "../provider-utils.js";

export default async function setPropertiesRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "properties"]);
}