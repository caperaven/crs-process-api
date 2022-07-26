import {DomActions} from "./dom-actions";

/**
 * This contains functions for dom actions using crs-binding.
 * This includes events, inflation, parsing ...
 */

export class DomBindingActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }
}

crs.intent.dom_binding = DomBindingActions;