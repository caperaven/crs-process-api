import {schema} from "./schema.js";

export default class Input extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        crs.processSchemaRegistry.add(schema);
    }

    async showDialog() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "show-dialog"
                }
            },
            parameters: {
                bId  : this._dataId
            }
        });
    }

    async execute() {
    }

    async getTemplate(args) {
        return await fetch("/templates/dialog.html").then(result => result.text());
    }
}