import {assertStep} from "../provider-utils.js";

export default async function getValuesRule(schema, process, step) {
    return await assertStep(schema, process, step, ["db", "store", "field", "target"]);
}