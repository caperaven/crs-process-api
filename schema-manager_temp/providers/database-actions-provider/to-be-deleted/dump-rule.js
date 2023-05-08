import {assertStep} from "../provider-utils.js";

export default async function dumpRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "records"]);
}