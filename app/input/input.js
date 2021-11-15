import {schema} from "./schema.js";

export default class Input extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        crs.processSchemaRegistry.add(schema);
        await super.connectedCallback();
    }

    preLoad() {
        this.setProperty("firstName", "John");
        this.setProperty("lastName", "Doe");
        this.setProperty("age", 30);
    }

    async getInput() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "user-input"
                }
            },
            parameters: {
                bId  : this._dataId
            }
        });
    }
}