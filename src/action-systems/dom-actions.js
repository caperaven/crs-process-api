import {callFunctionOnPath} from "./action-actions.js";

export class DomActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * notify_ready -> component-actions
     * call_on_element -> dom-utils
     * get_property -> dom-utils
     * set_properties -> dom-utils
     * filter_children -> dom-collection
     * get_animation_layer -> dom-interactive
     * clear_animation_layer -> dom-interactive
     * remove_animation_layer -> dom-interactive
     * highlight -> dom-interactive
     * set_widget -> dom-binding
     * clear_widget -> dom-binding
     * create_inflation_template -> dom-binding
     * open_tab -> dom-utils
     * elements_from_template -> dom-binding
     * update_cells -> dom-binding
     * get_element_bounds -> dom-utils,
     * clone_for_movement -> dom-interactive
     */


    /**
     * Set a element's attribute value
     * @returns {Promise<void>}
     */
    static async set_attribute(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.setAttribute(step.args.attr, await crs.process.getValue(step.args.value, context, process, item));
    }

    /**
     * Get a element's attribute value
     * @returns {Promise<*>}
     */
    static async get_attribute(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const value = element?.getAttribute(step.args.attr);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * Add a class to the classlist
     * @returns {Promise<void>}
     */
    static async add_class(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.add(...collection);
    }

    /**
     * Add a class to the classlist
     * @returns {Promise<void>}
     */
    static async remove_class(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.remove(...collection);
    }

    /**
     * Set a style property value
     * @returns {Promise<void>}
     */
    static async set_style(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.style[step.args.style] = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * Set multiple styles on a element
     * @returns {Promise<void>}
     */
    static async set_styles(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        for (let style of Object.keys(step.args.styles)) {
            element.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }
    }

    /**
     * Get a style property value
     * @returns {Promise<*>}
     */
    static async get_style(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const value = element?.style[step.args.style];

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * Set the text content of a defined element
     * @returns {Promise<void>}
     */
    static async set_text(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.textContent = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * Get the text content of a element and copy it to a defined target
     * @returns {Promise<*|string|*|string|*|*>}
     */
    static async get_text(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const value = element.textContent;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * Get element
     * @returns {Promise<HTMLElement|DocumentFragment|*>}
     */
    static async get_element(step, context, process, item) {
        if (step == null) return null;

        if (step instanceof HTMLElement || step instanceof SVGElement) {
            return step;
        }

        if (step instanceof DocumentFragment) {
            return step;
        }

        if (step._dataId != null) {
            return step;
        }

        if (typeof step == "string") {
            return document.querySelector(step);
        }

        let result = await crs.process.getValue(step.args.element, context, process, item);

        if (typeof result == "string") {
            result = document.querySelector(result);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * Create a dom element and optionally append it to a defined parent or set it on a target
     * @returns {Promise<HTMLElement>}
     */
    static async create_element(step, context, process, item) {
        const parentElement = await crs.dom.get_element(step.args.parent, context, process, item);
        const element = document.createElement(step.args.tag_name || "div");

        const attributes = Object.keys(step.args.attributes || {});
        const styles = Object.keys(step.args.styles || {});
        const classes = step.args.classes || [];
        const dataset = Object.keys(step.args.dataset || {});
        const variables = Object.keys(step.args.variables || {});

        element.id = await crs.process.getValue(step.args.id, context, process, item);

        for (let attr of attributes) {
            element.setAttribute(attr, await crs.process.getValue(step.args.attributes[attr], context, process, item));
        }

        for (let style of styles) {
            element.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }

        for (let cls of classes) {
            element.classList.add(cls);
        }

        for (let key of dataset) {
            element.dataset[key] = await crs.process.getValue(step.args.dataset[key], context, process, item);
        }

        for (let key of variables) {
            const value = await crs.process.getValue(step.args.variables[key], context, process, item);
            element.style.setProperty(key, value);
        }

        if (step.args.text_content != null) {
            element.textContent = await crs.process.getValue(step.args.text_content, context, process, item);
        }

        if (step.args.id != null) {
            element.id = step.args.id;
        }

        if (step.args.children != null) {
            for (let args of step.args.children) {
                args.parent = element;
                await this.create_element({
                    args: args
                }, context, process, item)
            }
        }

        if (parentElement?.content != null) {
            parentElement.content.appendChild(element)
        }
        else {
            parentElement?.appendChild(element);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, element, context, process, item);
        }

        return element;
    }

    /**
     * Remove the element from the dom
     * @returns {Promise<void>}
     */
    static async remove_element(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element?.parentElement?.removeChild(element);

        await crsbinding.providerManager.releaseElement(element);
    }

    /**
     * Clear a element, removing all the children
     * @returns {Promise<void>}
     */
    static async clear_element(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        if (element != null) {
            await crsbinding.observation.releaseChildBinding(element);
            while (element.firstElementChild != null) {
                element.removeChild(element.firstElementChild);
            }
        }
    }

    /**
     * Move a element from one parent to another
     * @returns {Promise<void>}
     */
    static async move_element(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parent = await crs.dom.get_element(step.args.target, context, process, item);

        await move_element(element, parent, step.args.position);
    }

    static async move_element_down(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const target = element.nextElementSibling;

        if (target != null) {
            await move_element(element, target, "after");
        }
    }

    static async move_element_up(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const target = element.previousElementSibling;

        if (target != null) {
            await move_element(element, target, "before");
        }
    }

    /**
     *Sets a single CSS variable to an element
     * @param step
     * @param context
     * @param process
     * @param item
     */

    static async set_css_variable(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variable = await crs.process.getValue(step.args.variable, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        element.style.setProperty(variable, value);
    }

    /**
     *Returns a single CSS variable value of an element
     * @param step
     * @param context
     * @param process
     * @param item
     */

    static async get_css_variable(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variable = await crs.process.getValue(step.args.variable, context, process, item);
        const result = getComputedStyle(element).getPropertyValue(variable);

        if(step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item)
        }
        return result;
    }

    /**
     *Sets a multiple CSS variables to an element
     * @param step
     * @param context
     * @param process
     * @param item
     */

    static async set_css_variables(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variables = await crs.process.getValue(step.args.variables, context, process, item);
        for(let key of Object.keys(variables)) {
            const value = variables[key];
            element.style.setProperty(key, value);
        }
    }

    /**
     *Returns an array of multiple CSS variable values of an element
     * @param step
     * @param context
     * @param process
     * @param item
     */

    static async get_css_variables(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variables = await crs.process.getValue(step.args.variables, context, process, item);
        const variableList = [];
        for (let item = 0; item < variables.length; item++) {
            const result = getComputedStyle(element).getPropertyValue(variables[item]);
            variableList.push(result)
        }
        return variableList ;
    }
}

async function move_element(element, target, position) {
    if (element == null || target == null) {
        return console.error(`both element and parent must exist to move the element`);
    }

    element.parentElement.removeChild(element);

    if (position == null) {
        return target.appendChild(element);
    }

    if (position == "before") {
        return target.parentElement.insertBefore(element, target);
    }

    if (target.nextElementSibling == null) {
        return target.parentElement.appendChild(element);
    }

    target.parentElement.insertBefore(element, target.nextElementSibling);
}

crs.intent.dom = DomActions;