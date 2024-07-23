import { compileExpression } from './condition-actions.js';

/**
 * Contingent actions are actions that are performed when a condition is met.
 *
 * @exmaple <caption>json example</caption>
 * {
 *   "type": "contingent",
 *   "args": {
 *      "contingents": {
 *          "value == 10": "step1",
 *          "value == 20": "step2",
 *          "value == 30": "step3"
 *      }
 *   }
 * }
 */
export class ContingentActions {
    static async perform(step, context, process, item, steps) {
        const contingents = await crs.process.getValue(step.args.contingents, context, process, item);

        for (const condition of Object.keys(contingents)) {
            const fn = compileExpression(condition, process);
            const success = fn(context, process, item);

            if (success) {
                const nextStep = contingents[condition];
                await crs.process.runStep(nextStep, context, process, item, steps);
            }
        }
    }
}

crs.intent.contingent = ContingentActions;