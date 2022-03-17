import {callFunctionOnPath} from "./action-actions.js";

export class DomActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async call_on_element(step, context, process, item) {
        const element = await getElement(step.args.element);

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
        const element = await getElement(step.args.element);
        const value = await crsbinding.utils.getValueOnPath(element, step.args.property);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }
    }

    /**
     * Set a element's property value
     * @returns {Promise<void>}
     */
    static async set_properties(step, context, process, item) {
        const element = await getElement(step.args.element);
        const properties = await crs.process.getValue(step.args.properties, context, process, item);

        const keys = Object.keys(properties);
        for (let key of keys) {
            element[key] = await crs.process.getValue(properties[key], context, process, item);
        }
    }

        /**
     * Set a element's attribute value
     * @returns {Promise<void>}
     */
    static async set_attribute(step, context, process, item) {
        const element = await getElement(step.args.element);
        element.setAttribute(step.args.attr, await crs.process.getValue(step.args.value, context, process, item));
    }

    /**
     * Get a element's attribute value
     * @returns {Promise<*>}
     */
    static async get_attribute(step, context, process, item) {
        const element = await getElement(step.args.element);
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
        const element = await getElement(step.args.element);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.add(...collection);
    }

    /**
     * Add a class to the classlist
     * @returns {Promise<void>}
     */
    static async remove_class(step, context, process, item) {
        const element = await getElement(step.args.element);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.remove(...collection);
    }

    /**
     * Set a style property value
     * @returns {Promise<void>}
     */
    static async set_style(step, context, process, item) {
        const element = await getElement(step.args.element);
        element.style[step.args.style] = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * Set multiple styles on a element
     * @returns {Promise<void>}
     */
    static async set_styles(step, context, process, item) {
        const element = await getElement(step.args.element);
        for (let style of Object.keys(step.args.styles)) {
            element.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }
    }

    /**
     * Get a style property value
     * @returns {Promise<*>}
     */
    static async get_style(step, context, process, item) {
        const element = await getElement(step.args.element);
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
        const element = await getElement(step.args.element);
        element.textContent = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * Get the text content of a element and copy it to a defined target
     * @returns {Promise<*|string|*|string|*|*>}
     */
    static async get_text(step, context, process, item) {
        const element = await getElement(step.args.element);
        const value = element.textContent;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * Create a dom element and optionally append it to a defined parent or set it on a target
     * @returns {Promise<HTMLElement>}
     */
    static async create_element(step, context, process, item) {
        const parentElement = await getElement(step.args.parent);
        const element = document.createElement(step.args.tag_name);

        const attributes = Object.keys(step.args.attributes || {});
        const styles = Object.keys(step.args.styles || {});
        const classes = step.args.classes || [];
        const dataset = Object.keys(step.args.dataset || {});

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
    static async remove_element(step) {
        const element = await getElement(step.args.element);
        element?.parentElement?.removeChild(element);

        await crsbinding.providerManager.releaseElement(element);
    }

    /**
     * Clear a element, removing all the children
     * @returns {Promise<void>}
     */
    static async clear_element(step) {
        const element = await getElement(step.args.element);
        if (element != null) {
            await crsbinding.observation.releaseChildBinding(element);
            while (element.firstChild != null) {
                element.removeChild(element.firstChild);
            }
        }
    }

    /**
     * Set a widgets html and context for binding after adding it to the UI
     * @returns {Promise<void>}
     */
    static async show_widget_dialog(step, context, process, item) {
        return new Promise(resolve => {
            const parts = createWidgetLayer(step);
            document.documentElement.appendChild(parts.layer);
            requestAnimationFrame(async () => {
                await setWidgetContent(parts.widget.id, step.args.html, step.args.url, context, process, item);
                resolve();
            })
        })
    }

    static async show_form_dialog (step, context, process, item) {
        return new Promise(resolve => {
            const parts = createWidgetLayer(step);
            document.documentElement.appendChild(parts.layer);
            requestAnimationFrame(async () => {
                await setWidgetContent(parts.widget.id, step.args.html, step.args.url, context, process, item);

                let bc = crsbinding.data.getContext(process.parameters.bId);

                const callback = async (next_step) => {
                    if (next_step === "pass_step") {
                        let errors = await validate_form(`#${parts.layer.id} form`);
                        if (errors.length > 0) {
                            if (process.parameters?.bId !== null) {
                                step.args.errors = errors;
                                await crs.intent.binding.set_errors(step, context, process, item);
                            }

                            return;
                        }
                    }

                    delete bc.pass;
                    delete bc.fail;

                    await this.remove_element({args: {query: `#${parts.layer.id}`}});

                    const stepName = step[next_step];
                    if (stepName != null) {
                        const nextStep = crsbinding.utils.getValueOnPath(process.steps, stepName);

                        if (nextStep != null) {
                            await crs.process.runStep(nextStep, context, process, item);
                        }
                    }

                    if (step.args.callback != null) {
                        step.args.callback();
                    }

                    resolve();
                }

                bc.pass = () => callback("pass_step");
                bc.fail = () => callback("fail_step");
            })
        })
    }

    /**
     * Set the defined with with context
     * @returns {Promise<void>}
     */
    static async set_widget(step, context, process, item) {
        const query = step.args.query;
        const html = await getHTML(step, context, process, item);

        await crsbinding.events.emitter.postMessage(query, {
            context: step.args.context || process?.parameters?.bId,
            html: html
        })
    }

    /**
     * Clear the defined widget
     * @returns {Promise<void>}
     */
    static async clear_widget(step, context, process, item) {
        const query = step.args.query;

        await crsbinding.events.emitter.postMessage(query, {
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
     * Move a element from one parent to another
     * @returns {Promise<void>}
     */
    static async move_element(step) {
        const element = await getElement(step.args.element);
        const parent = await getElement(step.args.target);

        await move_element(element, parent, step.args.position);
    }

    static async move_element_down(step) {
        const element = await getElement(step.args.element);
        const target = element.nextElementSibling;

        if (target != null) {
            await move_element(element, target, "after");
        }
    }

    static async move_element_up(step) {
        const element = await getElement(step.args.element);
        const target = element.previousElementSibling;

        if (target != null) {
            await move_element(element, target, "before");
        }
    }

    /**
     * Filter a element's children based on the child's data-tags attribute
     * @returns {Promise<void>}
     */
    static async filter_children(step, context, process, item) {
        const filterString = await crs.process.getValue(step.args.filter, context, process, item);
        await filter(step.args.element, filterString);
    }

    static async open_tab(step, context, process, item) {
        let url = await crs.intent.string.inflate({
            args: {
                template: step.args.url,
                parameters: step.args.parameters
            }
        }, context, process, item);

        window.open(url, "_blank");
    }

    static async clone_for_movement(step, context, process, item) {
        const element = await getElement(step.args.element);
        const parent = await getElement(step.args.parent);

        const position = await crs.process.getValue(step.args.position || {x: 0, y: 0}, context, process, item);

        const result = element.cloneNode(true);

        const attributes = Object.keys(step.args.attributes || {});
        const styles = Object.keys(step.args.styles || {});
        const classes = step.args.classes || [];

        for (let attr of attributes) {
            result.setAttribute(attr, await crs.process.getValue(step.args.attributes[attr], context, process, item));
        }

        for (let style of styles) {
            result.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }

        for (let cls of classes) {
            result.classList.add(cls);
        }

        if (parent != null) {
            parent.appendChild(result);
            result.style.position = "absolute";
            result.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }

        return result;
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

        parent = await getElement(parent);

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
        /**
            await crs.intent.dom.update_cells({ args: {
                template_id     : "tpl_generated",
                data            : batch,
                row_index       : 5
            }}, this)
         */
        return this.elements_from_template(step, context, process, item);
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
            child.text_content = ["${", key, "}"].join("");

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
     * Get me a instance of a element.
     * if it is a element return that element.
     * if it is a css query, go fetch me that element.
     */
    static async get_element(step, context, process, item) {
        const result = await getElement(step.args.element);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

export async function getElement(element) {
    if (element instanceof HTMLElement) {
        return element;
    }

    if (element instanceof DocumentFragment) {
        return element;
    }

    return document.querySelector(element);
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

    if (target.nextSibling == null) {
        return target.parentElement.appendChild(element);
    }

    target.parentElement.insertBefore(element, target.nextSibling);
}

async function filter(query, filter) {
    const element = await getElement(query);
    const hasFilter = filter.length > 0;

    for (let child of element.children) {
        child.removeAttribute("hidden");
        if (child.dataset.tags && hasFilter && child.dataset.tags.indexOf(filter) == -1) {
            child.setAttribute("hidden", "hidden");
        }
    }
}

async function validate_form(query) {
    const form = document.querySelector(query);
    const labels = form?.querySelectorAll("label");

    const errors = [];
    for (let label of labels) {
        const input = label.querySelector("input");
        const message = input.validationMessage;

        if (message.length > 0) {
            errors.push(`${label.children[0].text_content}: ${message}`);
        }
    }
    return errors;
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

function createWidgetLayer(step) {
    const layer = document.createElement("div");
    layer.style.zIndex          = "99999999";
    layer.style.position        = "fixed";
    layer.style.left            = "0";
    layer.style.top             = "0";
    layer.style.width           = "100%";
    layer.style.height          = "100%";
    layer.id = step.args.id || "widget_layer";

    const background = document.createElement("div");
    background.classList.add("modal-background");

    const widget = document.createElement("crs-widget");
    widget.style.position = "fixed";
    widget.style.left = "50%";
    widget.style.top = "50%";
    widget.style.transform = "translate(-50%, -50%)";
    widget.id = `${layer.id}_widget`;
    layer.appendChild(background);
    layer.appendChild(widget);

    return {
        layer: layer,
        widget: widget
    }
}

async function setWidgetContent(id, html, url, context, process, item) {
    await DomActions.set_widget({
        args: {
            query : `#${id}`,
            html  : html,
            url   : url
        }
    }, context, process, item);

    const element = document.querySelector(`#${id} [autofocus]`);
    if (element != null) {
        element.focus();
    }
    else {
        document.querySelector(`#${id}`).focus();
    }
}