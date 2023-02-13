/**
 * @class ValidateActions - A set of actions that can be used to validate objects.
 * @description This class contains a set of actions that can be used to validate objects.
 *
 * Features:
 * perform - The main entry point for the class. This method will call the action method that is specified in the step.
 * assert_step - Assert that the specified process step has the specified properties.
 * required - If the object is valid, run the pass step, otherwise run the fail step.
 */
export class ValidateActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    /**
     * @method assert_step - Assert that the specified process step has the specified properties
     * @param step - The step object
     * @param context - The context object that is passed to the process.
     * @param process - The name of the process to run
     * @param item - The item that is being processed.
     *
     * @param step.args.source {string} - The source to get the process from.
     * @param step.args.process {string} - The name of the process to validate.
     * @param step.args.step {string} - The name of the step to validate.
     * @param step.args.required {array} - The [properties] that are required to be present.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns The result of the assertion.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("validate", "assert_step", {
     *      source: context,
     *      process: "my-process",
     *      step: "my-step",
     *      required: ["my-property"]
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "validate",
     *     "action": "assert_step",
     *     "args": {
     *          "source": "context",
     *          "process": "my-process",
     *          "step": "my-step",
     *          "required": ["my-property"]
     *          "target": "$context.result"
     *      }
     * }
     */
    static async assert_step(step, context, process, item) {
        const source = await crs.process.getValue(step.args.source, context, process, item);
        const process_name = await crs.process.getValue(step.args.process, context, process, item);
        const step_name = await crs.process.getValue(step.args.step, context, process, item);
        const required = await crs.process.getValue(step.args.required, context, process, item);

        const result = {
            passed  : true,
            process : process_name,
            step    : step_name
        }

        const processObj = source[process_name];
        const stepObj = processObj.steps[step_name];
        for (const property of required) {
            const passed = await crs.call("object", "assert", {source: stepObj.args, properties: [property]});

            if (passed == false) {
                result.passed = false;
                result.messages = result.messages || [];
                result.messages.push(`"${property}" must have a value`);
            }
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method required - If the object is valid, run the pass step, otherwise run the fail step
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param step.args.source {string} - The source to get the object from.
     * @param step.args.properties {array} - The [properties] to validate.
     * @param step.pass_step {string} - The step to run if the object is valid.
     * @param step.fail_step {string} - The step to run if the object is invalid.
     * @param [step.args.target = "$context.result"] {string} - The target to store the result in.
     *
     * @returns A boolean value.
     * @example <caption>javascript example</caption>
     * const result = await crs.call("validate", "required", {
     *    source: context,
     *    properties: ["my-property"]
     *    pass_step: "my-pass-step",
     *    fail_step: "my-fail-step"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "validate",
     *      "action": "required",
     *      "args": {
     *          "source": "context",
     *          "properties": ["my-property"],
     *          "pass_step": "my-pass-step",
     *          "fail_step": "my-fail-step",
     *          "target": "$context.result"
     *      }
     * }
     */
    static async required(step, context, process, item) {
        const success = await crs.call("object", "assert", step.args, context, process, item);

        if (success && step.pass_step != null) {
            const nextStep = await crs.getNextStep(process, step.pass_step);
            await crs.process.runStep(nextStep, context, process, item);
        }

        if (!success && step.fail_step != null) {
            const nextStep = await crs.getNextStep(process, step.fail_step);
            await crs.process.runStep(nextStep, context, process, item);
        }

        return success;
    }
}

crs.intent.validate = ValidateActions;