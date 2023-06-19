import {schema} from "./schema.js";

export default class Welcome extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return false;
    }

    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(schema);
    }

    preLoad() {
        crs.binding.translations.add({message: "Hello World"}, "myprocess");
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