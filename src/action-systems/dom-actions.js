export class DomActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Set a element's attribute value
     * @returns {Promise<void>}
     */
    static async set_attribute(step, context, process, item) {
        const element = step.args.element || document.querySelector(step.args.query);
        element.setAttribute(step.args.attr, await crs.process.getValue(step.args.value, context, process, item));
    }

    /**
     * Get a element's attribute value
     * @returns {Promise<*>}
     */
    static async get_attribute(step, context, process, item) {
        const element = step.args.element || document.querySelector(step.args.query);
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
        const element = step.args.element || document.querySelector(step.args.query);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.add(...collection);
    }

    /**
     * Add a class to the classlist
     * @returns {Promise<void>}
     */
    static async remove_class(step, context, process, item) {
        const element = step.args.element || document.querySelector(step.args.query);
        const cls = await crs.process.getValue(step.args.value, context, process, item);

        let collection = Array.isArray(cls) == true ? cls : [cls];
        element.classList.remove(...collection);
    }

    /**
     * Set a style property value
     * @returns {Promise<void>}
     */
    static async set_style(step, context, process, item) {
        const element = step.args.element || document.querySelector(step.args.query);
        element.style[step.args.style] = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * Set multiple styles on a element
     * @returns {Promise<void>}
     */
    static async set_styles(step, context, process, item) {
        const element = step.args.element || document.querySelector(step.args.query);
        for (let style of Object.keys(step.args.styles)) {
            element.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }
    }

    /**
     * Get a style property value
     * @returns {Promise<*>}
     */
    static async get_style(step, context, process, item) {
        const element = step.args.element || document.querySelector(step.args.query);
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
        const element = step.args.element || document.querySelector(step.args.query);
        element.textContent = await crs.process.getValue(step.args.value, context, process, item);
    }

    /**
     * Get the text content of a element and copy it to a defined target
     * @returns {Promise<*|string|*|string|*|*>}
     */
    static async get_text(step, context, process, item) {
        const element = step.args.element || document.querySelector(step.args.query);
        const value = element.textContent;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * Create a dom element and append it to a defined parent
     * @returns {Promise<HTMLElement>}
     */
    static async create_element(step, context, process, item) {
        const parentElement = step.args.parent || document.querySelector(step.args.parentQuery);
        const element = document.createElement(step.args.tagName);

        const attributes = Object.keys(step.args.attributes || {});
        const styles = Object.keys(step.args.styles || {});
        const classes = step.args.classes || [];

        for (let attr of attributes) {
            element.setAttribute(attr, await crs.process.getValue(step.args.attributes[attr], context, process, item));
        }

        for (let style of styles) {
            element.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }

        for (let cls of classes) {
            element.classList.add(cls);
        }

        if (step.args.textContent != null) {
            element.textContent = await crs.process.getValue(step.args.textContent, context, process, item);
        }

        if (step.args.id != null) {
            element.id = step.args.id;
        }

        parentElement?.appendChild(element);
        return element;
    }

    /**
     * Remove the element from the dom
     * @returns {Promise<void>}
     */
    static async remove_element(step) {
        const element = step.args.element || document.querySelector(step.args.query);
        element?.parentElement?.removeChild(element);

        await crsbinding.providerManager.releaseElement(element);
    }

    /**
     * Clear a element, removing all the children
     * @returns {Promise<void>}
     */
    static async clear_element(step) {
        const element = document.querySelector(step.args.query);
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
        await move_element(step.args.query, step.args.target, step.args.position);
    }

    /**
     * Filter a element's children based on the child's data-tags attribute
     * @returns {Promise<void>}
     */
    static async filter_children(step, context, process, item) {
        const filterString = await crs.process.getValue(step.args.filter, context, process, item);
        await filter(step.args.query, filterString);
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
        const element = step.args.element || document.querySelector(step.args.query);
        const parent = step.args.parent || document.querySelector(step.args.parentQuery);
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
}

async function move_element(query, target, position) {
    const element = document.querySelector(query);
    let parent = document.querySelector(target);

    if (element == null || parent == null) {
        return console.error(`move element: either the element (${query}) or parent (${target}) does not exist`);
    }

    element.parentElement.removeChild(element);

    if (position == null) {
        return parent.appendChild(element);
    }

    if (position == "before") {
        return parent.parentElement.insertBefore(element, parent);
    }

    if (parent.nextSibling == null) {
        return parent.parentElement.appendChild(element);
    }

    parent.parentElement.insertBefore(element, parent.nextSibling);
}

async function filter(query, filter) {
    const element = document.querySelector(query);
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
            errors.push(`${label.children[0].textContent}: ${message}`);
        }
    }
    return errors;
}


async function getHTML(step) {
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