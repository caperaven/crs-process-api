import {assertStep} from "../provider-utils.js";

export default async function aggregateGroupRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "group", "aggregate", "target"]);
}