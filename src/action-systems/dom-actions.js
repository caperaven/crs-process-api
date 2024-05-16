import {callFunctionOnPath} from "./action-actions.js";

/**
 * @class DomActions - It contains methods that perform actions on the DOM.
 * Features:
 * -set_attribute - Set a element's attribute value
 * -set_attributes - Set multiple attributes on an element
 * -get_attribute - Get a element's attribute value
 * -batch_modify_attributes - Sets and Removes multiple attributes from an element
 * -remove_attribute - Removes a elements attribute
 * -remove_attributes - Removes multiple attributes from an element
 * -add_class - Add a class to an element
 * -remove_class - Remove a class from an element
 * -set_style - Set a style property on an element
 * -set_styles - Set multiple style properties on an element
 * -get_style - Get a style property on an element
 * -set_text - Set the text content of an element
 * -get_text - Get the text content of an element
 * -get_element - Get an element by id
 * -create_element - Create an element
 * -remove_element - Remove an element
 * -clear_element - Clear an element
 * -move_element - Move an element
 * -move_element_up - Move an element up
 * -move_element_down - Move an element down
 * -set_css_variable - Set a css variable
 * -get_css_variable - Get a css variable
 * -set_css_variables - Set multiple css variables
 * -get_css_variables - Get multiple css variables
 *
 */
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
     * @method set_attribute - It sets an attribute on an element
     * @param step {Object}- The step object.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to set the attribute on.
     * @param step.args.attr {String} - The name of the attribute to set.
     * @param step.args.value {String} - The value to set the attribute to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "set_attribute", {
     *    element: "my-element",
     *    attr: "my-attribute",
     *    value: "my-value"
     *    });
     *
     * @example <caption>json</caption>
     * {
     *   "action": "set_attribute",
     *   "args": {
     *     "element": "my-element",
     *     "attr": "my-attribute",
     *     "value": "my-value"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async set_attribute(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.setAttribute(step.args.attr, await crs.process.getValue(step.args.value, context, process, item));
    }

    /**
     * @method set_attributes - It gets an element from the DOM, and then sets the attributes of that element to the values specified in the step
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to set the attributes on.
     * @param step.args.attributes {Object} - An object containing the attributes to set. The keys are the attribute names, and the values are the values to set the attributes to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "set_attributes", {
     *   element: "my-element",
     *   attributes: {
     *   "my-attribute": "my-value",
     *   "my-other-attribute": "my-other-value"
     *   }
     *   });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "set_attributes",
     *  "args": {
     *    "element": "my-element",
     *    "attributes": {
     *      "my-attribute": "my-value",
     *     "my-other-attribute": "my-other-value"
     *    }
     * }
     *
     * @returns {Promise<void>}
     */
    static async set_attributes(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        for (let attr of Object.keys(step.args.attributes)) {
            element.setAttribute(attr, await crs.process.getValue(step.args.attributes[attr], context, process, item));
        }
    }

    /**
     * @method get_attribute - It gets the value of an attribute of an element
     * @param step {Object} - The step object that is being executed.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to get the attribute from.
     * @param step.args.attr {String} - The name of the attribute to get.
     * @param step.args.target {String} - The name of the variable to store the value in.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "get_attribute", {
     *  element: "my-element",
     *  attr: "my-attribute",
     *  target: "my-variable"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *   "action": "get_attribute",
     *   "args": {
     *     "element": "my-element",
     *     "attr": "my-attribute",
     *     "target": "my-variable"
     *    }
     * }
     *
     * @returns The value of the attribute.
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
     * @method batch_modify_attributes - Takes in an add and remove array ,and adds or removes attributes from an element(s).
     * @param step {object} - The step object from the process.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.add {Array} - An array of objects that contain the element id, attribute dictionary to be added to an element(s).
     * @param step.args.remove {Array} - An array of objects that contain the element id, and attribute names array to be removed from an element(s).
     *
     * @example <caption>javascript example</caption>
     *  await crs.call("dom", "batch_modify_attributes", {
     *      "add": [
     *             {
     *                 "element": "div",
     *                 "attributes": {
     *                     "id": "div_id",
     *                     "hidden": "hidden"
     *                 }
     *            }
     *       ],
     *      "remove": [
     *             {
     *                 "element": "div",
     *                 "attributes": ["id", "class", "style"]
     *             }
     *       ]
     *  });
     *
     *  @example <caption>json example</caption>
     * {
     *     "type": "dom",
     *     "action": "batch_modify_attributes",
     *     "args": {
     *         "add": [
     *             {
     *                 "element": "div",
     *                 "attributes": {
     *                     "id": "div_id",
     *                     "hidden": "hidden"
     *                 }
     *             }
     *         ],
     *         "remove": [
     *             {
     *                 "element": "div",
     *                 "attributes": ["id", "class", "style"]
     *             }
     *         ]
     *     }
     * }
     * @return {Promise<void>}
     */
    static async batch_modify_attributes(step, context, process, item) {
        const add = await crs.process.getValue(step.args?.add, context, process, item) || [];
        const remove = await crs.process.getValue(step.args?.remove, context, process, item) || [];

        if (add.length === 0 && remove.length === 0) return;

        if (add.length > 0) {
            await modifyAttributes(add, "set_attributes");
        }

        if (remove.length > 0) {
            await modifyAttributes(remove, "remove_attributes");
        }
    }

    /**
     * @method remove_attribute -  Removes the given attribute from the element.
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param element {String} - the id of the element to remove the attribute from.
     * @param attr {String} - The name of the attribute to remove.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("dom", "remove_attribute", {
     *     element: "#my-element",
     *     attr: "my-attribute"
     * });
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "dom"
     *    "action": "remove_attribute",
     *    "args": {
     *        "element": "#my-element",
     *        "attr": "my-attribute"
     *    }
     * }
     * @returns {Promise<void>}
     */
    static async remove_attribute(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.removeAttribute(step.args.attr);
    }

    /**
     * @method remove_attributes - Removes the given attributes from the element.
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param element {String} - The id of the element to remove the attributes from.
     * @param attributes {Array} - An array of attribute names to remove.
     *
     * @example <caption>javascript example</caption>
     * await crs.call("dom", "remove_attributes", {
     *    element: "#my-element",
     *    attributes: ["data-value", "hidden"]
     * });
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "dom",
     *      "action": "remove_attributes",
     *      "args": {
     *          "element": "#my-element",
     *          "attributes": ["data-value", "hidden"]
     *       }
     * }
     *
     * @return {Promise<void>}
     */
    static async remove_attributes(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        for (let attr of step.args.attributes) {
            element.removeAttribute(attr);
        }
    }

    /**
     * @method add_class - It adds a class to the classList
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to add the class to.
     * @param step.args.value {String|Array} - The class to add. If it is an array, it will add all the classes in the array.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "add_class", {
     *   element: "my-element",
     *   value: "my-class"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "add_class",
     *  "args": {
     *    "element": "my-element",
     *    "value": "my-class"
     *   }
     * }
     *
     * @returns {Promise<void>}
     *
     */
    static async add_class(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.add(...collection);
    }

    /**
     * @method remove_class - Remove a class from the classList
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to remove the class from.
     * @param step.args.value {String|Array} - The class to remove. If it is an array, it will remove all the classes in the array.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "remove_class", {
     *  element: "my-element",
     *  value: "my-class"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "remove_class",
     *  "args": {
     *    "element": "my-element",
     *    "value": "my-class"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async remove_class(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.remove(...collection);
    }

    /**
     * @method set_style - Set a style property value.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to set the style on.
     * @param step.args.style {String} - The style property to set.
     * @param step.args.value {String} - The value to set the style property to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "set_style", {
     * element: "my-element",
     * style: "color",
     * value: "red"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "set_style",
     *  "args": {
     *    "element": "my-element",
     *    "style": "color",
     *    "value": "red"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async set_style(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.style[step.args.style] = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * @method set_styles - Set multiple styles on a element.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to set the style on.
     * @param step.args.styles {Object} - An object containing the style properties to set.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "set_styles", {
     *   element: "my-element",
     *   styles: {
     *     color: "red",
     *     background: "blue"
     *    }
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "set_styles",
     *  "args": {
     *    "element": "my-element",
     *    "styles": {
     *      "color": "red",
     *      "background": "blue"
     *     }
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async set_styles(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        for (let style of Object.keys(step.args.styles)) {
            element.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }
    }

    /**
     * @method get_style - Get a style property value.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to get the style from.
     * @param step.args.style {String} - The style property to get.
     * @param step.args.target {String} - The target to set the value to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "get_style", {
     *  element: "my-element",
     *  style: "color"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "get_style",
     *  "args": {
     *    "element": "my-element",
     *    "style": "color"
     *   }
     * }
     *
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
     * @method set_text - Set the text content of a defined element.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to set the text on.
     * @param step.args.value {String} - The value to set the text to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "set_text", {
     *   element: "my-element",
     *   value: "Hello World"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "set_text",
     *  "args": {
     *    "element": "my-element",
     *    "value": "Hello World"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async set_text(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.textContent = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * @method get_text - Get the text content of a element and copy it to a defined target.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to get the text from.
     * @param step.args.target {String} - The target to set the value to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "get_text", {
     *  element: "my-element"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "get_text",
     *  "args": {
     *    "element": "my-element"
     *   }
     * }
     *
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
     * @method get_element - Get element
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The id of the element to get.
     * @param [step.args.target] {String} - The target to set the value to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "get_element", {
     *   element: "my-element"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "get_element",
     *  "args": {
     *    "element": "my-element"
     *   }
     * }
     *
     * @returns {Promise<HTMLElement|DocumentFragment|*>}
     */
    static async get_element(step, context, process, item) {
        if (step == null) return null;

        if (step instanceof Element) {
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

        const scope = await crs.process.getValue(step.args.scope || document, context, process, item);

        if (typeof result == "string") {
            result = scope.querySelector(result);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    //ToDo: AW - Find out about use-case.

    /**
     * @method create_element - Create a dom element and optionally append it to a defined parent or set it on a target
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.parent {String} - The id of the parent element to append the new element to.
     * @param [step.args.tag_name="div"] {String} - The tag name of the element to create.
     * @param [step.args.attributes={}] {Object} - The attributes to set on the element.
     * @param [step.args.styles={}] {Object} - The styles to set on the element.
     * @param [step.args.classes=[]] {Array} - The classes to set on the element.
     * @param [step.args.dataset={}] {Object} - The dataset to set on the element.
     * @param [step.args.variables={}] {Object} - The variables to set on the element.
     * @param [step.args.id] {String} - The id to set on the element.
     * @param [step.args.text_content] {String} - The text content to set on the element.
     * @param [step.args.children] {[Object]} - The children to append to the element.
     * @param [step.args.target] {String} - The target to set the value to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "create_element", {
     *  parent: "my-parent",
     *  tag_name: "div",
     *  attributes: {
     *    "data-test": "test"
     *  },
     *  styles: {
     *   "background-color": "red"
     *  },
     *  classes: ["test"],
     *  dataset: {
     *   "test": "test"
     *  },
     *  variables: {
     *   "test": "test"
     *  },
     *  id: "my-id",
     *  text_content: "test",
     *  children: [
     *   {
     *    "tag_name": "div",
     *    "text_content": "test"
     *   }
     *  ]
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "create_element",
     *  "args": {
     *   "parent": "my-parent",
     *   "tag_name": "div",
     *   "attributes": {
     *     "data-test": "test"
     *   },
     *   "styles": {
     *     "background-color": "red"
     *   },
     *   "classes": ["test"],
     *   "dataset": {
     *     "test": "test"
     *   },
     *   "variables": {
     *     "test": "test"
     *   },
     *   "id": "my-id",
     *   "text_content": "test",
     *   "children": [
     *   {
     *     "tag_name": "div",
     *     "text_content": "test"
     *    }
     *   ]
     *  }
     * }
     *
     *
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

        const id = await crs.process.getValue(step.args.id, context, process, item);

        if (id != null) {
            this.id = id;
        }

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
        } else {
            parentElement?.appendChild(element);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, element, context, process, item);
        }

        return element;
    }

    /**
     * @method remove_element - Remove the element from the dom
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to remove.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "remove_element", {
     *  element: "my-element"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "remove_element",
     *  "args": {
     *    "element": "my-element"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async remove_element(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element?.parentElement?.removeChild(element);

        await crsbinding.providerManager.releaseElement(element);
    }

    /**
     * @method clear_element - Clear a element, removing all the children.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to clear.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "clear_element", {
     *   element: "my-element"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "clear_element",
     *  "args": {
     *    "element": "my-element"
     *   }
     * }
     *
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
     * @method move_element - Move a element from one parent to another.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to move.
     * @param step.args.target {String} - The target element.
     * @param step.args.position {String} - The position to move the element to. (before, after, first, last)
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "move_element", {
     *  element: "my-element",
     *  target: "my-target",
     *  position: "before"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "move_element",
     *  "args": {
     *    "element": "my-element",
     *    "target": "my-target",
     *    "position": "before"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async move_element(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parent = await crs.dom.get_element(step.args.target, context, process, item);

        await moveElement(element, parent, step.args.position);
    }

    /**
     * @method move_element_down - It moves the element down one position in the DOM
     * @param step {Object} - The step object
     * @param context {Object} - The context of the current step.
     * @param process {Object} - The current process
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The element to move.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "move_element_down", {
     * element: "my-element"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "move_element_down",
     *  "args": {
     *    "element": "my-element"
     *  }
     * }
     *
     * @returns {Promise<void>}
     */
    static async move_element_down(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const target = element.nextElementSibling;

        if (target != null) {
            await moveElement(element, target, "after");
        }
    }

    /**
     * @method move_element_up - It moves the element up one position in the DOM
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the current step.
     * @param process {Object} - The current process
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The element to move.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "move_element_up", {
     *  element: "my-element"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "move_element_up",
     *  "args": {
     *    "element": "my-element"
     *  }
     * }
     *
     * @returns {Promise<void>}
     */
    static async move_element_up(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const target = element.previousElementSibling;

        if (target != null) {
            await moveElement(element, target, "before");
        }
    }

    /**
     *@method set_css_variable - Sets a single CSS variable to an element
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to set the CSS variable to.
     * @param step.args.variable {String} - The name of the CSS variable.
     * @param step.args.value {String} - The value of the CSS variable.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "set_css_variable", {
     *  element: "my-element",
     *  variable: "--my-variable",
     *  value: "red"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "set_css_variable",
     *  "args": {
     *    "element": "my-element",
     *    "variable": "--my-variable",
     *    "value": "red"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */

    static async set_css_variable(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variable = await crs.process.getValue(step.args.variable, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);

        element.style.setProperty(variable, value);
    }

    /**
     * @method get_css_variable - Returns a single CSS variable value of an element
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to get the CSS variable from.
     * @param step.args.variable {String} - The name of the CSS variable.
     * @param [step.args.target] {String} - The name of the variable to store the result in.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "get_css_variable", {
     *   element: "my-element",
     *   variable: "--my-variable"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "get_css_variable",
     *  "args": {
     *    "element": "my-element",
     *    "variable": "--my-variable"
     *   }
     * }
     *
     * @returns {Promise<String>} - The value of the CSS variable.
     *
     */

    static async get_css_variable(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variable = await crs.process.getValue(step.args.variable, context, process, item);
        const result = getComputedStyle(element).getPropertyValue(variable);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item)
        }
        return result;
    }

    /**
     *@method set_css_variables - Sets a multiple CSS variables to an element
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to set the CSS variable to.
     * @param step.args.variables {Object} - An object containing the CSS variables to set.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "set_css_variables", {
     *   element: "my-element",
     *   variables: {
     *     "--my-variable": "red",
     *     "--my-variable-2": "blue"
     *   }
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "set_css_variables",
     *  "args": {
     *    "element": "my-element",
     *    "variables": {
     *      "--my-variable": "red",
     *      "--my-variable-2": "blue"
     *     }
     *   }
     * }
     *
     * @returns {Promise<void>}
     */

    static async set_css_variables(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variables = await crs.process.getValue(step.args.variables, context, process, item);
        for (let key of Object.keys(variables)) {
            const value = variables[key];
            element.style.setProperty(key, value);
        }
    }

    /**
     * @method get_css_variables - Returns an array of multiple CSS variable values of an element
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to get the CSS variable from.
     * @param step.args.variables {[String]} - An array of the names of the CSS variables.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_actions", "get_css_variables", {
     *  element: "my-element",
     *  variables: ["--my-variable", "--my-variable-2"]
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "get_css_variables",
     *  "args": {
     *    "element": "my-element",
     *    "variables": ["--my-variable", "--my-variable-2"]
     *   }
     * }
     *
     * @returns {Promise<[String]>} - An array of the values of the CSS variables.
     */

    static async get_css_variables(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const variables = await crs.process.getValue(step.args.variables, context, process, item);
        const variableList = [];
        for (let item = 0; item < variables.length; item++) {
            const result = getComputedStyle(element).getPropertyValue(variables[item]);
            variableList.push(result)
        }
        return variableList;
    }
}

/**
 * @function move_element - It moves an element to a target element, and if a position is specified, it will move the element before or after the
 * target element
 * @param element - the element you want to move
 * @param target {*} - the element you want to move
 * @param position {String} - "before" or "after"
 * @returns the result of the function call.
 */
async function moveElement(element, target, position) {
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

/**
 * @function modifyAttributes - It sets and removes attributes from an element
 * @param intentCollection {Array} - An array of elements to set or remove
 * @param action {String} - "add" or "remove"
 * @return {Promise<void>}
 */
async function modifyAttributes(intentCollection, action) {
    for (const intent of intentCollection) {
        const element = intent.element;
        const attributes = intent.attributes;
        await crs.call("dom", action, {element, attributes});
    }
}
crs.intent.dom = DomActions;