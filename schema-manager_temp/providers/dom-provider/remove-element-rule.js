import {assertStep} from "../provider-utils.js";

export default async function removeElementRule(schema, process, step) {
    return await assertStep(schema, process, step, ["parent"]);
}