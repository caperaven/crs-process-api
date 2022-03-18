import {assertStep} from "../provider-utils";

export default async function getPropertyRule(schema, process, step) {
    return await assertStep(schema, process, step, ["target", "property"]);
}