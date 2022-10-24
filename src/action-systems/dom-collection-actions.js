/**
 * This contains actions for working with lists.
 * Filtering, sorting ...
 */

export class DomCollectionActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async filter_children(step, context, process, item) {
        const filterString = await crs.process.getValue(step.args.filter, context, process, item);
        await filter(step.args.element, filterString);
    }
}

async function filter(element, filter) {
    element = await crs.dom.get_element(element);
    const hasFilter = filter.length > 0;

    for (let child of element.children) {
        child.removeAttribute("aria-hidden");
        if (child.dataset.tags && hasFilter && child.dataset.tags.indexOf(filter) == -1) {
            child.setAttribute("aria-hidden", "true");
        }
    }
}

crs.intent.dom_collection = DomCollectionActions;