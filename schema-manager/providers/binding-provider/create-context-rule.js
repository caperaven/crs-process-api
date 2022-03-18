import {assertStep} from "../provider-utils";

export default async function createContextRule(schema, process, step) {
    return await assertStep(schema, process, step, ["context_id"]);
}