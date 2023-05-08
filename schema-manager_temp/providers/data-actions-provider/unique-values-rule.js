import {assertStep} from "../provider-utils.js";

export default async function uniqueValuesRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source", "fields", "target"]);
}