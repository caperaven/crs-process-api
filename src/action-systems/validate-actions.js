export class ValidateActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

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
            const passed = await crs.call("object", "assert", {source: stepObj.args, paths: [property]});

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

    static async required(step, context, process, item) {
        const success = await crs.call("object", "assert", step.args, context, process, item);

        if (success && step.pass_step != null) {
            const nextStep = await crs.intent.condition.getNextStep(process, step.pass_step);
            await crs.process.runStep(nextStep, context, process, item);
        }

        if (!success && step.fail_step != null) {
            const nextStep = await crs.intent.condition.getNextStep(process, step.fail_step);
            await crs.process.runStep(nextStep, context, process, item);
        }

        return success;
    }
}