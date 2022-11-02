import {schema} from "./schema.js";

export default class Welcome extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(schema);
    }

    preLoad() {
        crsbinding.translations.add({message: "Hello World"}, "myprocess");
    }

    async printProcess() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: {
                    schema: "translations-example"
                }
            },
        });
    }

    async printManual() {
        await crs.call("console", "log", {messages: ["$translation.myprocess.message"]});
    }
}