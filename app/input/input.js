import {schema} from "./schema.js";

export default class Input extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    preLoad() {
        crs.processSchemaRegistry.add(schema);
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