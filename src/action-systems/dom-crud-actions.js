/**
 * This contains actions that perform dom "get" / "create" / "update" and "remove" functions
 */

export class DomCrudActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }
}

crs.intent.dom_crud = DomCrudActions;