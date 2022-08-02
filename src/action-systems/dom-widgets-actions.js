import {DomActions} from "./dom-actions.js";
import {DomInteractiveActions} from "./dom-interactive-actions.js";

export class DomWidgetsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
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
            element : `#${id}`,
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

crs.intent.dom_widget = DomWidgetsActions;