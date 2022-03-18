import {assertStep} from "./provider-utils.js";

export default class ConditionProvider {
    static async validate(schema, process, step) {
        const processObj = schema[process];
        const stepObj = processObj.steps[step];

        const result =  await assertStep(schema, process, step, ["condition"]);

        if (stepObj["pass_step"] == null && stepObj["fail_step"] == null) {
            result.pass = false;
            result.messages = result.messages || [];
            result.messages.push('"pass_step" or "fail_step" required');
        }

        return result;
    }
}