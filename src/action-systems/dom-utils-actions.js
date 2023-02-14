import {callFunctionOnPath} from "./action-actions.js";

/**
 * @class DomUtilsActions - This contains functions for utility
 *
 * Features:
 * call_on_element - call a function on a element
 * get_property - get a element's property value
 * set_properties - set a element's property value
 * open_tab - open a new tab
 * get_element_bounds - get the bounds of an element
 * find_parent_of_type - find the parent of a given type
 * #find_parent_of_type - find the parent of a given type
 */

export class DomUtilsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method call_on_element - Call a function on a element
     *
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to call the function on.
     * @param step.args.function {String} - The name of the function to call.
     * @param step.args.args {Array} - The arguments to pass to the function.
     * @param step.args.target {String} - The target to store the result in.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-utils", "call_on_element", {
     *   element: "my-element",
     *   function: "myFunction",
     *   args: ["my", "arguments"]
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-utils",
     *  "action": "call_on_element",
     *  "args": {
     *    "element": "my-element",
     *    "function": "myFunction",
     *    "args": ["my", "arguments"]
     *   }
     * }
     *
     * @returns {Promise<*>}
     */
    static async call_on_element(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        const result = await callFunctionOnPath(element, step, context, process, item);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * Get a element's property value
     * @returns {Promise<*>}
     */
    static async get_property(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const value = await crsbinding.utils.getValueOnPath(element, step.args.property);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * Set a element's property value
     * @returns {Promise<void>}
     */
    static async set_properties(step, context, process, item) {
        const element = await crs.dom.get_element(step, context, process, item);
        const properties = await crs.process.getValue(step.args.properties, context, process, item);

        const keys = Object.keys(properties);
        for (let key of keys) {
            element[key] = await crs.process.getValue(properties[key], context, process, item);
        }
    }

    static async open_tab(step, context, process, item) {
        let url = await crs.call("string", "inflate", {
            template: step.args.url,
            parameters: step.args.parameters
        }, context, process, item);

        window.open(url, "_blank");
    }

    static async get_element_bounds(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const bounds = element.getBoundingClientRect();

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, bounds, context, process, item);
        }

        return bounds;
    }

    /**
     * Recursively finds a parent or ancestor that matches a specific tagName,
     * optionally stopping at a specified node for performance.
     * @returns {Promise<Element|undefined>}
     */
    static async find_parent_of_type(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const stopAtNodeName = await crs.process.getValue(step.args.stopAtNodeName, context, process, item);
        const stopAtNodeQuery = await crs.process.getValue(step.args.stopAtNodeQuery, context, process, item);
        const nodeName = await crs.process.getValue(step.args.nodeName, context, process, item);
        const nodeQuery = await crs.process.getValue(step.args.nodeQuery, context, process, item);

        if (element == null || (nodeName == null && nodeQuery == null)) return;

        const result = await this.#findParentOfType(element, nodeName, nodeQuery, stopAtNodeName, stopAtNodeQuery);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * Recursively finds a parent or ancestor that matches a specific tagName,
     * optionally stopping at a specified node for performance.
     * @param {Element} element
     * @param {string} nodeName
     * @param {string} stopAtNodeName
     * @returns {Promise<undefined|Element>}
     */
    static async #findParentOfType(element, nodeName, nodeQuery, stopAtNodeName, stopAtNodeQuery) {
        const currentNodeName = nodeName != null || stopAtNodeName != null ? element.nodeName.toLowerCase() : null;
        if (stopAtNodeName != null && currentNodeName === stopAtNodeName) return;
        if (stopAtNodeQuery != null && element.matches(stopAtNodeQuery)) return;

        if (nodeName != null && currentNodeName === nodeName.toLowerCase()) {
            return element;
        }

        if (nodeQuery != null && element.matches(nodeQuery)) {
            return element;
        }

        if (element.parentElement == null) return;

        return await this.#findParentOfType(element.parentElement, nodeName, nodeQuery, stopAtNodeName, stopAtNodeQuery);
    }
}

crs.intent.dom_utils = DomUtilsActions;