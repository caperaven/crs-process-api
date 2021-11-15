export default class Dom extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add((await (import("./elements-schema.js"))).elementsSchema);
        crs.processSchemaRegistry.add((await (import("./attributes-schema.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./styles-schema.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./text-content-schema.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./crs-widget-schema.js"))).schema);
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

    async clearChildren() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "clear",
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

    async getText() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "get_text",
                args: { schema: "text-content-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async setText() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "set_text",
                args: { schema: "text-content-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async setWidget() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "set_widget",
                args: { schema: "crs-widget-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async clearWidget() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "clear_widget",
                args: { schema: "crs-widget-example" }
            }
        })
    }
}