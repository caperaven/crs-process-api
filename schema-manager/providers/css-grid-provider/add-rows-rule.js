import {assertStep} from "../provider-utils";

export default async function addRowsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "height"]);
}