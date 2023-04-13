import {callFunctionOnPath} from "./action-actions.js";

/**
 * @class DomUtilsActions - This contains functions for utility
 *
 * Features:
 * -call_on_element - call a function on a element
 * -get_property - get a element's property value
 * -set_properties - set a element's property value
 * -open_tab - open a new tab
 * -get_element_bounds - get the bounds of an element
 * -find_parent_of_type - find the parent of a given type
 * - #find_parent_of_type - find the parent of a given type
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
     * await crs.call("dom_utils", "call_on_element", {
     *   element: "my-element",
     *   action: "myFunction",
     *   args: ["my", "arguments"]
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_utils",
     *  "action": "call_on_element",
     *  "args": {
     *    "element": "my-element",
     *    "action": "myFunction",
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
     * @method get_property - Get a element's property value
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to call the function on.
     * @param step.args.property {String} - The name of the property to get.
     * @param [step.args.target] {String} - The target to store the result in.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom_utils", "get_property", {
     *   element: "my-element",
     *   property: "myProperty"
     *   target: "my-target"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_utils",
     *  "action": "get_property",
     *  "args": {
     *    "element": "my-element",
     *    "property": "myProperty"
     *    "target": "my-target"
     *   }
     * }
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
     * @method set_properties - Set a element's property value
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to call the function on.
     * @param step.args.properties {Object} - The properties to set.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom_utils", "set_properties", {
     *   element: "my-element",
     *   properties: {
     *    myProperty: "myValue"
     *   }
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_utils",
     *  "action": "set_properties",
     *  "args": {
     *    "element": "my-element",
     *    "properties": {
     *      "myProperty": "myValue"
     *    }
     *  }
     * }
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

    /**
     * @method open_tab - It opens a new tab in the browser
     * @param step {Object} - The step object
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.url {String} - The url to open in the new tab.
     * @param step.args.parameters {Object} - The parameters to inflate the url with.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom_utils", "open_tab", {
     *  url: "https://www.google.com/search?q={query}",
     *  parameters: {
     *    query: "my query"
     *    }
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_utils",
     *  "action": "open_tab",
     *  "args": {
     *    "url": "https://www.google.com/search?q={query}",
     *    "parameters": {
     *      "query": "my query"
     *     }
     *    }
     *  }
     *
     * @returns {Promise<void>}
     */
    static async open_tab(step, context, process, item) {
        let url = await crs.call("string", "inflate", {
            template: step.args.url,
            parameters: step.args.parameters
        }, context, process, item);

        window.open(url, "_blank");
    }

    /**
     * @method get_element_bounds - It gets the bounds of an element and stores them in a variable
     * @param step {Object} - The step object
     * @param context {Object} - The context of the current step.
     * @param process {Object} - The process that is running the step.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to get the bounds of.
     * @param [step.args.target] {String} - The target to store the result in.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom_utils", "get_element_bounds", {
     *   element: "my-element",
     *   target: "my-target"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_utils",
     *  "action": "get_element_bounds",
     *  "args": {
     *    "element": "my-element",
     *    "target": "my-target"
     *   }
     * }
     * @returns The bounds of the element.
     */
    static async get_element_bounds(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const bounds = element.getBoundingClientRect();

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, bounds, context, process, item);
        }

        return bounds;
    }

    /**
     * @method find_parent_of_type - Recursively finds a parent or ancestor that matches a specific tagName,
     * optionally stopping at a specified node for performance.
     *
     * @param step {Object} - The step object
     * @param context {Object} - The context of the current step.
     * @param process {Object} - The process that is running the step.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to get the bounds of.
     * @param step.args.nodeName {String} - The name of the node to find.
     * @param step.args.nodeQuery {String} - The query to find the node.
     * @param step.args.stopAtNodeName {String} - The name of the node to stop at.
     * @param step.args.stopAtNodeQuery {String} - The query to find the node to stop at.
     * @param step.args.target {String} - The target to store the result in.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom_utils", "find_parent_of_type", {
     *  element: "my-element",
     *  nodeName: "DIV",
     *  target: "my-target"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_utils",
     *  "action": "find_parent_of_type",
     *  "args": {
     *    "element": "my-element",
     *    "nodeName": "DIV",
     *    "target": "my-target"
     *   }
     * }
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
     * ToDo: AW - Ask about this method use-case for example.
     */

    /**
     * @method #findParentOfType - Recursively finds a parent or ancestor that matches a specific tagName,
     * optionally stopping at a specified node for performance.
     *
     * @param  element {Element} - The element to start searching from.
     * @param  nodeName {string} - The name of the node to find.
     * @param  stopAtNodeName {string} - The name of the node to stop at.
     * @param  stopAtNodeQuery {string} - The query to find the node to stop at.
     * @param  nodeQuery {string} - The query to find the node.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom_utils", "find_parent_of_type", {
     *   element: "my-element",
     *   nodeName: "DIV"
     * });
     *
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_utils",
     *  "action": "find_parent_of_type",
     *  "args": {
     *    "element": "my-element",
     *    "nodeName": "DIV"
     *   }
     * }
     *
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