/**
 * Layout actions that is done via the dom.
 * CSS Grid, Fix Position ...
 */

export class DomLayoutActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }
}

crs.intent.dom_layout = DomLayoutActions;