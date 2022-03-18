import {assertStep} from "../provider-utils";

export default async function concatRule(schema, process, step) {
    return await assertStep(schema, process, step, ["sources", "target"]);
}