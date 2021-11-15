import {domExample} from "../schemas/dom-example.js";

export default class Dom extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async performUIProcess() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "dom-example"
                }
            }
        });
    }
}