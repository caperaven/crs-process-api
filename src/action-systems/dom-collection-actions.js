/**
 * @class DomCollectionActions - This contains actions for working with lists. Filtering, sorting ...
 *
 * Features:
 * -filter_children - filter children of an element based on a filter string
 * -toggle_selection - toggle selection of an element
 * -get_selected_state - get the selected state of an element
 *
 */

export class DomCollectionActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method filter_children - Filter the children of the element with the given id using the given filter string
     * @param step {Object}- The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to filter.
     * @param step.args.filter {String} - The filter string to use.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-collection", "filter_children", {
     *  element: "my-list",
     *  filter: "my filter string"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-collection",
     *  "action": "filter_children",
     *  "args": {
     *    "element": "my-list",
     *    "filter": "my filter string"
     *    }
     * }
     *
     * @returns {Promise<void>}
     */
    static async filter_children(step, context, process, item) {
        const filterString = await crs.process.getValue(step.args.filter, context, process, item);
        await filter(step.args.element, filterString);
    }

    /**
     * @method toggle_selection - It toggles the aria-selected attribute on the target element
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.target {String} - The id of the target element.
     * @param step.args.multiple {Boolean} - If true, multiple elements can be selected. If false, only one element can be selected.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-collection", "toggle_selection", {
     *  target: "my-list",
     *  multiple: true
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-collection",
     *  "action": "toggle_selection",
     *  "args": {
     *    "target": "my-list",
     *    "multiple": true
     *   }
     * }
     *
     * @returns The value of the attribute "aria-selected"
     */
    static async toggle_selection(step, context, process, item) {
        const target = await crs.dom.get_element(step.args.target, context, process, item);
        const multiple = await crs.process.getValue(step.args.multiple || false, context, process, item);
        const attr = "aria-selected";

        if (multiple !== true) {
            const selectedElement = target.parentElement.querySelector("[aria-selected='true']");

            if (selectedElement === target) return;

            if (selectedElement != null) {
                selectedElement.removeAttribute(attr);
            }
            target.setAttribute(attr, "true");
        }
        else {
            target.hasAttribute(attr) && target.getAttribute(attr) === "true" ? target.removeAttribute(attr) : target.setAttribute(attr, "true");
        }
    }

    /**
     * @method get_selected_state - It returns a dictionary of the values of the children of the target element, where the value is true if the child is
     * selected, and false otherwise
     * @param step {Object} - the step object
     * @param context {Object} - The context of the current step.
     * @param process {Object} - The process that is running the step.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.target {String} - The id of the target element.
     *
     * @example <caption>javascript</caption>
     * const selectedState = await crs.call("dom-collection", "get_selected_state", {
     *   target: "my-list"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-collection",
     *  "action": "get_selected_state",
     *  "args": {
     *    "target": "my-list"
     *   }
     * }
     *
     * @returns A dictionary of the values of the children of the target element, with the value of the child as the key
     * and the value of the aria-selected attribute as the value.
     */
    static async get_selected_state(step, context, process, item) {
        const target = await crs.dom.get_element(step.args.target, context, process, item);

        const result = {};
        for (const child of target.children) {
            result[child.dataset.value] = child.getAttribute("aria-selected") == "true";
        }

        return result
    }
}

/**
 * @function filter - It takes an element and a filter, and hides all the element's children that don't have the filter in their data-tags
 * attribute
 * @param element - The element to filter.
 * @param filter - The filter to apply to the element.
 *
 * @example <caption>javascript</caption>
 * await filter("my-list", "my filter string");
 *
 * @returns {Promise<void>}
 */
async function filter(element, filter) {
    element = await crs.dom.get_element(element);
    const hasFilter = filter.length > 0;

    for (let child of element.children) {
        child.removeAttribute("aria-hidden");

        if (child.tagName == "HR" && hasFilter) {
            child.setAttribute("aria-hidden", "true");
            continue;
        }

        if (child.dataset.tags && hasFilter && child.dataset.tags.indexOf(filter) == -1) {
            child.setAttribute("aria-hidden", "true");
        }
    }
}

crs.intent.dom_collection = DomCollectionActions;