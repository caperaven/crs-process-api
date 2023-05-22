import {schema} from "./schema.js";

export default class Input extends crs.binding.classes.ViewBase {
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
        await crs.binding.events.emitter.emit("run-process", {
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