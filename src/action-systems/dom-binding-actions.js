/**
 * @class DomBindingActions - This contains functions for dom actions using crs-binding.
 * This includes events, inflation, parsing ...
 *
 * Features:
 * -set_widget - Set the defined with context
 * -clear_widget - Clear the defined widget
 * -create_widget - Create a widget
 * -create_inflation_template - Create a inflation template
 * -elements_form_template - Create a form template
 * -update_cells - Update cells
 */

export class DomBindingActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method set_widget - Set the defined with context
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to set the widget on.
     * @param [step.args.context=process.parameters.bID] {String} - The context to set the widget on.
     * @param [process.parameters.bID] {String} - The context to set the widget on.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom-binding", "set_widget", {
     *    element: "my-element",
     *    context: "my-context",
     *  });
     *
     * @example <caption>json</caption>
     * {
     *   "action": "set_widget",
     *   "args": {
     *     "element": "my-element",
     *     "context": "my-context"
     *   }
     * }
     *
     * @returns {Promise<void>}
     */
    static async set_widget(step, context, process, item) {
        const element = step.args.element;
        const html = await getHTML(step, context, process, item);
        const ctx = (await crs.process.getValue(step.args.context, context, process, item)) || process?.parameters?.bId;

        await crs.binding.events.emitter.postMessage(element, {
            context: ctx,
            html: html
        })
    }

    /**
     * @method clear_widget - Clear the defined widget
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element to clear the widget on.
     * @param [process.bindable] {Boolean} - If the process is bindable.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom-binding", "clear_widget", {
     *   element: "my-element",
     *   context: "my-context",
     *   process: {
     *     bindable: true,
     *     parameters: {
     *       bId: "my-context"
     *     }
     *   }
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "clear_widget",
     *  "args": {
     *    "element": "my-element",
     *    "context": "my-context"
     *   },
     *  "process": {
     *    "bindable": true,
     *    "parameters": {
     *    "bId": "my-context"
     *   }
     *  }
     * }
     *
     * @returns {Promise<void>}
     */
    static async clear_widget(step, context, process, item) {
        const element = step.args.element;

        await crs.binding.events.emitter.postMessage(element, {
            context: null,
            html: ""
        });

        if (process?.bindable == true) {
            let bc = crs.binding.data.getContext(process.parameters.bId);
            delete bc.pass;
            delete bc.fail;
        }
    }

    /**
     * @method create_inflation_template - Use an object literal as the source to generate a template for inflation.
     * For complex templates use the element from template.
     * Function is better for scenarios like cell generation.
     * It automatically registers the template on the inflation engine
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The current process object.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.template_id {String} - The id of the template.
     * @param step.args.source {Object} - The object literal to use as the source.
     * @param step.args.tag_name {String} - The tag name to use for the template.
     * @param [step.args.wrapper] {String} - The wrapper tag name to use for the template.
     * @param [step.args.ctx] {String} - The context to use for the template.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom-binding", "create_inflation_template", {
     *  template_id: "my-template",
     *  source: {
     *    "my-element": {
     *      "class": "my-class",
     *      "data-id": "my-id"
     *     }
     *    },
     *  tag_name: "div",
     *  wrapper: "div",
     *  ctx: "my-context"
     * });
     *
     * @example <caption>json</caption>
     * {
     * "action": "create_inflation_template",
     * "args": {
     *    "template_id": "my-template",
     *    "source": {
     *      "my-element": {
     *      "class": "my-class",
     *      "data-id": "my-id"
     *     }
     *    },
     *    "tag_name": "div",
     *    "wrapper": "div",
     *    "ctx": "my-context"
     *  }
     * }
     *
     * @returns {Promise<void>}
     */
    static async create_inflation_template(step, context, process, item) {
        const id = await crs.process.getValue(step.args.template_id, context, process, item);
        const obj = await crs.process.getValue(step.args.source, context, process, item);
        const tag_name = await crs.process.getValue(step.args.tag_name, context, process, item);
        const wrapper = await crs.process.getValue(step.args.wrapper, context, process, item);
        const ctxName = await crs.process.getValue(step.args.ctx, context, process, item);

        const keys = Object.keys(obj);
        const template = document.createElement("template");

        let parent = template;

        if (wrapper != null) {
            const wrapperElement = await crs.call("dom","create_element", wrapper, context, process, item);
            template.content.appendChild(wrapperElement);
            parent = wrapperElement;
        }

        for (let key of keys) {
            let args = obj[key];
            args.tag_name = tag_name;
            let child = await crs.call("dom","create_element", args, context, process, item);
            child.textContent = ["${", key, "}"].join("");

            if (parent.content != null) {
                parent.content.appendChild(child);
            }
            else {
                parent.appendChild(child);
            }
        }

        await crs.binding.inflation.manager.register(id, template, ctxName || "context");
    }

    /**
     * @method elements_from_template - Given an array of objects.
     * 1. Create a fragment containing elements based on a template.
     * 2. Add the fragment to a parent element if defined
     * 3. Return fragment to caller
     * @returns {Promise<void>}
     */


    /**
     * @method elements_from_template - Create a new DOM fragment from a template and add it to the DOM
     * @param step {Object}- The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is currently running.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.template_id {String} - The id of the template to use.
     * @param step.args.template {String} - The template to use.
     * @param step.args.data {Array} - The array of objects to use as the data source.
     * @param [step.args.remove_template] {Boolean} - If true, the template will be removed from the DOM after the fragment is created.
     * @param [step.args.recycle] {Boolean} - If true, the template will be recycled after the fragment is created.
     * @param [step.args.row_index] {Number} - The index of the row to use as the data source.
     * @param step.args.parent {Element} - The parent element to add the fragment to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom-binding", "elements_from_template", {
     *  template_id: "my-template",
     *  data: [
     *    { name: "John", age: 30 },
     *    { name: "Jane", age: 25 }
     *   ],
     *  parent: document.getElementById("my-parent")
     * });
     *
     * @example <caption>json</caption>
     * {
     * "action": "elements_from_template",
     * "args": {
     *   "template_id": "my-template",
     *   "data": [
     *      { "name": "John", "age": 30 },
     *      { "name": "Jane", "age": 25 }
     *    ],
     *   "parent": "#my-parent"
     *   }
     * }
     * @returns The fragment that was created.
     */
    static async elements_from_template(step, context, process, item) {
        const id                = await crs.process.getValue(step.args.template_id, context, process, item);
        const template          = await crs.process.getValue(step.args.template, context, process, item);
        const data              = await crs.process.getValue(step.args.data, context, process, item);
        const remove_template   = await crs.process.getValue(step.args.remove_template, context, process, item);
        const recycle           = await crs.process.getValue(step.args.recycle, context, process, item);
        const row_index         = await crs.process.getValue(step.args.row_index, context, process, item);
        let parent              = await crs.process.getValue(step.args.parent, context, process, item);

        parent = await crs.dom.get_element(parent, context, process, item);

        if (template != null) {
            await load_template(template, id);
        }

        let elements = null;
        if (parent != null) {
            if (recycle != false && parent.childElementCount > 0) {
                elements = parent.children;
            }
            else {
                parent.innerHTML = "";
            }
        }

        const fragment = await crs.binding.inflation.manager.get(id, data, elements, row_index || 0);

        if (fragment != null) {
            parent?.appendChild(fragment);
        }

        if (remove_template == true) {
            await crs.binding.inflation.manager.unregister(id);
        }

        return fragment;
    }

    /**
     * @method update_cells - Update cells with the data sent starting at the provided record
     *
     * @param step {Object}- The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is currently running.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.template_id {String} - The id of the template to use.
     * @param step.args.data {Array} - The array of objects to use as the data source.
     * @param [step.args.row_index] {Number} - The index of the row to use as the data source.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom-binding", "update_cells", {
     *  template_id: "my-template",
     *  data: [
     *    { name: "John", age: 30 },
     *    { name: "Jane", age: 25 }
     *   ],
     *  row_index: 1
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "update_cells",
     *  "args": {
     *    "template_id": "my-template",
     *    "data": [
     *      { "name": "John", "age": 30 },
     *      { "name": "Jane", "age": 25 }
     *   ],
     *  "row_index": 1
     *  }
     * }
     * @returns {Promise<void>}
     */
    static async update_cells(step, context, process, item) {
        return this.elements_from_template(step, context, process, item);
    }
}

/**
 * @function getHTML - If the url contains a `$fn` prefix, then the function is called and the result is used as the html. Otherwise, the
 * html is loaded from the url
 * @param step {Object} - The step object from the test.
 * @param context {Object} - The context object that is passed to the test function.
 *
 * @param step.args.url {String} - The url to load the html from.
 * @param step.args.html {String} - The id of the html to use.
 *
 * @example <caption>javascript</caption>
 * const html = await getHTML({
 *   url: "$fn.getHTML",
 *   html: "$template.my-template"
 * }, context);
 *
 *
 * @returns The HTML for the template.
 */
async function getHTML(step, context) {
    if (step.args.url.indexOf("$fn") != -1) {
        const fn = step.args.url.replace("$fn.", "");
        const html = await context[fn](step.args);
        const template = document.createElement("template");
        const id = step.args.html.split(".")[1];

        template.innerHTML = html;
        crs.binding.templates.add(id, template);
        return html;
    }

    if (step.args.html.indexOf("$template") == 0) {
        const id = step.args.html.split(".")[1];
        const template = await crs.binding.templates.get(id, step.args.url);
        return template;
    }
}

/**
 * @function load_template - Loads a template into the inflation manager
 * @param template {String|HTMLTemplateElement}- The template to load. This can be a string (the selector for the template) or an HTMLTemplateElement.
 * @param id {String}- The id of the template to load.
 * @param context {Object} - The context object that will be used to resolve the template.
 *
 * @example <caption>javascript</caption>
 * await load_template("#my-template", "my-template", context);
 *
 */
async function load_template(template, id, context) {
    let templateElement;
    if (template instanceof HTMLTemplateElement) {
        templateElement = template;
    }
    else {
        templateElement = document.querySelector(template);
    }

    await crs.binding.inflation.manager.register(id, templateElement);
}

crs.intent.dom_binding = DomBindingActions;