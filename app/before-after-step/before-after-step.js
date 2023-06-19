import {schema} from "./schema.js";

export default class BeforeAfterStep extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        crs.processSchemaRegistry.add(schema);
        await super.connectedCallback();
    }

    async performStep() {
        await crs.binding.events.emitter.emit("run-process", {
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