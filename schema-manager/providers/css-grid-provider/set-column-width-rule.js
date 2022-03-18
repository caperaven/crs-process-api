import {assertStep} from "../provider-utils";

export default async function setColumnWidthRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "position", "width"]);
}