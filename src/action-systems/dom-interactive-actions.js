/**
 * This deals with resizing of elements, moving it, interactive functions
 */

export class DomInteractiveActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }
}

crs.intent.dom_interactive = DomInteractiveActions;