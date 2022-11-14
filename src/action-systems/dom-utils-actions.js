import {callFunctionOnPath} from "./action-actions.js";

/**
 * This contains functions for utility
 */

export class DomUtilsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Call a function on a element
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

        return await this.#findParentOfType(element.parentElement, nodeName, nodeQuery, stopAtNodeName, stopAtNodeQuery);
    }
}

crs.intent.dom_utils = DomUtilsActions;