/**
 * @class DomWidgetsActions - It's a class that contains methods that are called by the CRS engine to perform actions on the DOM
 *
 * Features:
 * -show_widget_dialog - show a widget dialog
 * -show_form_dialog - show a form dialog
 *
 */
export class DomWidgetsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method show_widget_dialog - Set a widgets html and context for binding after adding it to the UI
     *
     * @param step {Object}- step to perform
     * @param context {Object} - context to use
     * @param process {Object} - process to use
     * @param item {Object} - item to use
     *
     * @param step.args.html {String} - html to use
     * @param step.args.url {String} - url to use
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_widgets", "show_widget_dialog", {
     *    html: "<div>hello world</div>",
     *    url: "https://www.google.com"
     * });
     *
     * @example <caption>json</caption>
     * {
     *   "type": "dom_widgets",
     *   "action": "show_widget_dialog",
     *   "args": {
     *     "html": "<div>hello world</div>",
     *     "url": "https://www.google.com"
     *   }
     * }
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

    /**
     * @method show_form_dialog - It creates a layer, loads the HTML into the layer, and then adds a pass and fail function to the binding context
     * @param step {Object}- The step object
     * @param context {Object} - The context object that was passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.html {String} - The HTML to load into the layer
     * @param step.args.url {String} - The URL to load into the layer
     * @param step.args.errors {Array} - An array of errors to display
     * @param step.pass {String} - The name of the next step to perform if the form passes validation
     * @param step.fail {String} - The name of the next step to perform if the form fails validation
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("dom_widgets", "show_form_dialog", {
     *   html: "<div>hello world</div>",
     *   url: "https://www.google.com",
     *   errors: ["error 1", "error 2"],
     *   pass: "pass_step",
     *   fail: "fail_step"
     *   });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom_widgets",
     *  "action": "show_form_dialog",
     *  "args": {
     *    "html": "<div>hello world</div>",
     *    "url": "https://www.google.com",
     *    "errors": ["error 1", "error 2"],
     *    "pass": "pass_step",
     *    "fail": "fail_step"
     *   }
     * }
     *
     * @returns A promise.
     */
    static async show_form_dialog (step, context, process, item) {
        return new Promise(resolve => {
            const parts = createWidgetLayer(step);
            document.documentElement.appendChild(parts.layer);
            requestAnimationFrame(async () => {
                await setWidgetContent(parts.widget.id, step.args.html, step.args.url, context, process, item);

                let bc = crs.binding.data.getContext(process.parameters.bId);

                const callback = async (next_step) => {
                    if (next_step === "pass_step") {
                        let errors = await validate_form(`#${parts.layer.id} form`);
                        if (errors.length > 0) {
                            if (process.parameters?.bId !== null) {
                                step.args.errors = errors;
                                await crs.call("binding", "set_errors", step.args, context, process, item);
                            }

                            return;
                        }
                    }

                    delete bc.pass;
                    delete bc.fail;

                    await this.remove_element({args: {element: `#${parts.layer.id}`}});

                    const stepName = step[next_step];
                    if (stepName != null) {
                        const nextStep = crs.binding.utils.getValueOnPath(process.steps, stepName);

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
}

/**
 * @function validate_form - It takes a query selector, finds all the labels in the form, and then checks the validation message of each input. If
 * the validation message is not empty, it adds the label text and the validation message to an array of errors
 *
 * @param query {String}- The query selector for the form you want to validate.
 *
 * @example <caption>javascript</caption>
 * const errors = await validate_form("#my_form");
 *
 * @returns An array of strings.
 */
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

/**
 * @function createWidgetLayer - It creates a layer and a widget, and returns them
 * @param step - The step object that is passed to the function.
 * @param [step.args.id="widget_layer"] {String} - The id of the layer.
 *
 * @example <caption>javascript</caption>
 * const parts = createWidgetLayer(step);
 * document.documentElement.appendChild(parts.layer);
 * requestAnimationFrame(async () => {
 *  await setWidgetContent(parts.widget.id, step.args.html, step.args.url, context, process, item);
 *  ...
 *  ...
 *  ...
 *  resolve();
 *  })
 *
 * @returns An object with two properties: layer and widget.
 */
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

/**
 * @function setWidgetContent - It takes an HTML string, a URL, and a DOM element ID, and it sets the content of the DOM element with the given ID to
 * the HTML string, and it sets the URL of the browser to the given URL
 * @param id {String}- The id of the widget to set the content of.
 * @param html {String}- The HTML to be inserted into the widget.
 * @param url {String}- The URL of the widget.
 * @param context {Object} - The context object that was passed to the process function.
 * @param process {Object} - The process that is running the widget.
 * @param item {Object} - The item that was clicked on.
 *
 *
 */
async function setWidgetContent(id, html, url, context, process, item) {
    await crs.call("dom_binding", "set_widget",
        {
            element : `#${id}`,
            html  : html,
            url   : url
        }, context, process, item);

    const element = document.querySelector(`#${id} [autofocus]`);
    if (element != null) {
        element.focus();
    }
    else {
        document.querySelector(`#${id}`).focus();
    }
}

crs.intent.dom_widget = DomWidgetsActions;