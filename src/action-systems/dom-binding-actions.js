/**
 * This contains functions for dom actions using crs-binding.
 * This includes events, inflation, parsing ...
 */

export class DomBindingActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Set the defined with with context
     * @returns {Promise<void>}
     */
    static async set_widget(step, context, process, item) {
        const element = step.args.element;
        const html = await getHTML(step, context, process, item);
        const ctx = (await crs.process.getValue(step.args.context, context, process, item)) || process?.parameters?.bId;

        await crsbinding.events.emitter.postMessage(element, {
            context: ctx,
            html: html
        })
    }

    /**
     * Clear the defined widget
     * @returns {Promise<void>}
     */
    static async clear_widget(step, context, process, item) {
        const element = step.args.element;

        await crsbinding.events.emitter.postMessage(element, {
            context: null,
            html: ""
        });

        if (process.bindable == true) {
            let bc = crsbinding.data.getContext(process.parameters.bId);
            delete bc.pass;
            delete bc.fail;
        }
    }

    /**
     * Use an object literal as the source to generate a template for inflation.
     * For complex templates use the element from template.
     * Function is better for scenarios like cell generation.
     * It automatically registers the template on the inflation engine
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
            const wrapperElement = await this.create_element({ args: wrapper }, context, process, item);
            template.content.appendChild(wrapperElement);
            parent = wrapperElement;
        }

        for (let key of keys) {
            let args = obj[key];
            args.tag_name = tag_name;
            let child = await this.create_element({ args: args}, context, process, item);
            child.textContent = ["${", key, "}"].join("");

            if (parent.content != null) {
                parent.content.appendChild(child);
            }
            else {
                parent.appendChild(child);
            }
        }

        crsbinding.inflationManager.register(id, template, ctxName || "context");
    }

    /**
     * Given an array of objects.
     * 1. Create a fragment containing elements based on a template.
     * 2. Add the fragment to a parent element if defined
     * 3. Return fragment to caller
     * @returns {Promise<void>}
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

        const fragment = crsbinding.inflationManager.get(id, data, elements, row_index || 0);

        if (fragment != null) {
            parent?.appendChild(fragment);
        }

        if (remove_template == true) {
            crsbinding.inflationManager.unregister(id);
        }

        return fragment;
    }

    /**
     * Update cells with the data sent starting at the provided record
     * @returns {Promise<void>}
     */
    static async update_cells(step, context, process, item) {
        return this.elements_from_template(step, context, process, item);
    }
}

async function getHTML(step, context) {
    if (step.args.url.indexOf("$fn") != -1) {
        const fn = step.args.url.replace("$fn.", "");
        const html = await context[fn](step.args);
        const template = document.createElement("template");
        const id = step.args.html.split(".")[1];

        template.innerHTML = html;
        crsbinding.templates.add(id, template);
        return html;
    }

    if (step.args.html.indexOf("$template") == 0) {
        const id = step.args.html.split(".")[1];
        const template = await crsbinding.templates.get(id, step.args.url);
        return template;
    }
}

async function load_template(template, id, context) {
    let templateElement;
    if (template instanceof HTMLTemplateElement) {
        templateElement = template;
    }
    else {
        templateElement = document.querySelector(template);
    }

    crsbinding.inflationManager.register(id, templateElement);
}

crs.intent.dom_binding = DomBindingActions;