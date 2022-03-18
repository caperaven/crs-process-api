import {assertStep} from "../provider-utils";

export default async function setErrorsRule(schema, process, step) {
    return await assertStep(schema, process, step, ["source"]);
}