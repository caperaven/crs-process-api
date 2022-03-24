import {assertStep} from "../provider-utils.js";

export default async function createElementRule(schema, process, step) {
    return await assertStep(schema, process, step, ["parent", "tag_name"]);
}