import {callFunctionOnPath} from "./action-actions.js";
import {DomInteractiveActions} from "./dom-interactive-actions.js";

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

}

crs.intent.dom_utils = DomUtilsActions;