export default class Dom extends crsbinding.classes.ViewBase {
    get typeId() {
        return "MyTypeIdValue"
    }

    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add((await (import("./schemas/elements.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/attributes.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/styles.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/text-content.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/crs-widget.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/move-element.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/filter.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/tabs.js"))).schema);
    }

    async disconnectedCallback() {
        // JHR: todo remove schemas from registry
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
        debugger;

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

    async moveToList() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_to_list",
                args: { schema: "move-element" }
            }
        })
    }

    async moveInDeck() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_in_deck",
                args: { schema: "move-element" }
            }
        })
    }

    async moveToFirst() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_to_first",
                args: { schema: "move-element" }
            }
        })
    }

    async moveToLast() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_to_last",
                args: { schema: "move-element" }
            }
        })
    }

    async moveDown() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_down",
                args: { schema: "move-element" }
            }
        })
    }

    async moveUp() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_up",
                args: { schema: "move-element" }
            }
        })
    }

    async applyFilter() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "filter",
                args: {
                    schema: "filter",
                }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async clearFilter() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "clear",
                args: {
                    schema: "filter"
                }
            }
        })
    }

    async openGoogle() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "google",
                args: {
                    schema: "tabs-example"
                }
            }
        })
    }

    async openInput() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "input",
                args: {
                    schema: "tabs-example"
                }
            }
        })
    }

    async openParameters() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "parameters",
                args: {
                    schema: "tabs-example"
                }
            }
        })
    }

    async addClass() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "add_class",
                args: { schema: "styles-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async addMClass() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "add_classes",
                args: { schema: "styles-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async removeClass() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "remove_class",
                args: { schema: "styles-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async clone() {
        await crsbinding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "clone",
                args: { schema: "dom-example" }
            },
            parameters: {
                bId: this._dataId
            }
        })
    }

    async createFromTemplate() {
        const data = [
            { description: "item 1" },
            { description: "item 2" },
            { description: "item 3" },
            { description: "item 4" },
            { description: "item 5" }
        ]

        await crs.intent.dom.elements_from_template({ args: {
            template_id     : "tpl_simple",
            template        : "#tpl_simple",
            data            : data,
            parent          : "#tpl_simple-parent",
            remove_template : true,
            recycle         : false
        }}, this)
    }

    async createFromObject() {
        const data = [
            { description: "item 1 from object" },
            { description: "item 2 from object" },
            { description: "item 3 from object" },
            { description: "item 4 from object" },
            { description: "item 5 from object" },
            { description: "item 6 from object" },
            { description: "item 7 from object" },
            { description: "item 8 from object" }
        ]

        await crs.intent.dom.create_inflation_template({args: {
            template_id: "tpl_generated",
            tag: "li",
                wrapper: "li",
            source: {
                description: {}
            }
        }})

        await crs.intent.dom.elements_from_template({ args: {
            template_id     : "tpl_generated",
            data            : data,
            parent          : "#tpl_simple-parent",
            remove_template : true
        }}, this)
    }
}