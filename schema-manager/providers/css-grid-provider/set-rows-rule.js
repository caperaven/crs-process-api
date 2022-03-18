import {assertStep} from "../provider-utils";

export default async function setRowsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "rows"]);
}