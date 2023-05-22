import {schema} from "./schema.js";

export default class Input extends crs.binding.classes.ViewBase {
    async connectedCallback() {
        crs.processSchemaRegistry.add(schema);
        await super.connectedCallback();
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