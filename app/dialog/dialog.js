import {schema} from "./schema.js";

export default class Input extends crsbinding.classes.ViewBase {
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
        crs.intent.onkey_service.getData("field", "query")
    }
}