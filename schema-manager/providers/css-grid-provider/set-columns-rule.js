import {assertStep} from "../provider-utils";

export default async function setColumnsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "columns"]);
}