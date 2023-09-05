/**
 * @class SwitchActions - Switch actions are used to perform actions based on a switch statement.
 * @example <caption>json example</caption>
 * {
 *     "type": "switch",
 *     "args": {
 *          "check": "$parameters.entityName",
 *          "cases": {
 *              "value1": "step1",
 *              "value2": "step2"
 *          },
 *          "default": "step3"
 *     }
 * }
 *
 * the case property names are the values to check against.
 * The values can be any type, but they must match the type of the check value.
 * The default property is the step to run if none of the cases match, but is not required.
 */
export class SwitchActions {
    static async perform(step, context, process, item) {
        const value = await crs.process.getValue(step.args.check, context, process, item);
        const cases = await crs.process.getValue(step.args.cases, context, process, item);
        const defaultStep = await crs.process.getValue(step.args.default, context, process, item);

        // there is no default defined and the provided value is not in the cases
        // then just stop processing
        const nextStepKey = cases[value] || defaultStep;
        if (nextStepKey == null) return;

        // we have a next step key, find the step in the process and run it
        const nextStep = await crs.getNextStep(process, nextStepKey);
        if (nextStep != null) {
            await crs.process.runStep(nextStep, context, process, item);
        }
    }
}

crs.intent.switch = SwitchActions;