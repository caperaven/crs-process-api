import {assertStep} from "../provider-utils.js";

export default async function getStyleRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "styles", "target"]);
}