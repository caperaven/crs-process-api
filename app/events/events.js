import {schema} from "./schema.js";
import "./my-component.js";

export default class Events extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(schema);
    }

    preLoad() {
        this.setProperty("value", "value 1");
    }

    async emit(event) {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "emit_message",
                args: { schema: "events-example" }
            }
        });
    }

    async post(event) {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "post_message",
                args: { schema: "events-example" }
            }
        });
    }

    async on(event) {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "on_message",
                args: { schema: "events-example" }
            }
        });
    }

    async raise(event) {

    }
}