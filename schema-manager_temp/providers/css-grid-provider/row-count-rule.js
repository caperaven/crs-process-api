import {assertStep} from "../provider-utils";

export default async function rowCountRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element"]);
}