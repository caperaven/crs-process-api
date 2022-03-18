import {assertStep} from "../provider-utils";

export default async function removeRowsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element"]);
}