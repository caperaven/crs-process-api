import {assertStep} from "../provider-utils";

export default async function setRowHeightRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "position", "height"]);
}