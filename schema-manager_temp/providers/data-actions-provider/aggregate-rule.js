import {assertStep} from "../provider-utils.js";

export default async function aggregateRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "aggregate", "target"]);
}