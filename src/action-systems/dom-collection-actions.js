/**
 * This contains actions for working with lists.
 * Filtering, sorting ...
 */

export class DomCollectionActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }
}

crs.intent.dom_collection = DomCollectionActions;