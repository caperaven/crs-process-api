import {schema} from "./schema.js";

export default class Welcome extends crs.binding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(schema);
    }

    preLoad() {
        crsbinding.translations.add({message: "Hello World"}, "myprocess");
    }

    async printProcess() {
        await crs.binding.events.emitter.emit("run-process", {
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