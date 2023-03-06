/**
 * @class DomObserverActions - Use this class for observing dom changes e.g. ResizeObserver
 * @description Use this class for observing dom changes e.g. ResizeObserver
 *
 * Features:
 * - observe_resize - observer resize for an element
 * - unobserve_resize - unobserve resize for an element
 */
export class DomObserverActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method observe_resize - Observe the element for changes in size.  When the size changes, the callback is called.
     * @param step {Object} - The step to perform
     * @param context {Object} - The context of the process
     * @param process {Object} - The process
     * @param item {Object} - The item being processed
     *
     * @param step.args.element {HTMLElement} - The element to observe
     * @param step.args.callback {Function} - The callback to call when the size changes
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript example</caption>
     * await crs.call("dom_observer", "observe_resize", {
     *    element: element,
     *    callback: callback
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "dom_observer",
     *     "action": "observe_resize",
     *     "args": {
     *         "element": "element",
     *         "callback": "callback"
     *      }
     * }
     */
    static async observe_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);
        element.__resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                callback(entry);
            }
        });
        element.__resizeObserver.observe(element);
    }

    /**
     * @method unobserve_resize - Disable the resize observer for the element
     * @param step {Object} - The step to perform
     * @param context {Object} - The context of the process
     * @param process {Object} - The process
     * @param item {Object} - The item being processed
     *
     * @param step.args.element {HTMLElement} - The element to unobserve
     *
     * @returns {Promise<void>}
     *
     *@example <caption>javascript example</caption>
     *  await crs.call("dom_observer", "unobserve_resize", {
     *      element: element
     *  }, context, process, item);
     *
     *@example <caption>json example</caption>
     *  {
     *      "type": "dom_observer",
     *      "action": "unobserve_resize",
     *      "args": {
     *          "element": "element"
     *      }
     *    }
     */
    static async unobserve_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__resizeObserver.disconnect();
        delete element.__resizeObserver;
    }
}

crs.intent.dom_observer = DomObserverActions;