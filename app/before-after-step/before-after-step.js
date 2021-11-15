import {schema} from "./schema.js";

export default class BeforeAfterStep extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        crs.processSchemaRegistry.add(schema);
        await super.connectedCallback();
    }

    async performStep() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "before-and-after"
                }
            },
            parameters: {
                bId  : this._dataId
            }
        });
    }
}