export default class Dom extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add((await (import("./schema.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./attributes.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./styles.js"))).schema);
    }

    async performUIProcess() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: { schema: "dom-example" }
            }
        });
    }

    async getAttribute() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: { schema: "attributes-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async setAttribute() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "set_attribute",
                args: { schema: "attributes-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async getStyle() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "get_style",
                args: { schema: "styles-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async setStyle() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "set_style",
                args: { schema: "styles-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }
}