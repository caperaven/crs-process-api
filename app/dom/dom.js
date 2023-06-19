export default class Dom extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return false;
    }

    get typeId() {
        return "MyTypeIdValue"
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async preLoad() {
        crs.processSchemaRegistry.add((await (import("./schemas/elements.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/attributes.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/styles.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/text-content.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/move-element.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/filter.js"))).schema);
        crs.processSchemaRegistry.add((await (import("./schemas/tabs.js"))).schema);
    }

    async disconnectedCallback() {
        // JHR: todo remove schemas from registry
    }

    async createAnimationLayer() {
        const template = this.shadowRoot.querySelector("#highlight-template");

        crs.call("dom", "get_animation_layer");

        this._clickHandler = async (event) => {
            await crs.call("dom", "clear_animation_layer");
            await crs.call("dom", "highlight", {
                target: event.target,
                classes: ["highlight"],
                duration: 500,
                template: template
            })
        }

        window.addEventListener("click", this._clickHandler);
    }

    async clearAnimationLayer() {
        window.removeEventListener("click", this._clickHandler);
        this._clickHandler = null;

        crs.call("dom", "remove_animation_layer");
    }

    async performUIProcess() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "main",
                args: { schema: "dom-example" }
            }
        });
    }

    async clearChildren() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "clear",
                args: { schema: "dom-example" }
            }
        });
    }

    async createComposite() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "composite",
                args: { schema: "dom-example" }
            }
        });
    }

    async getAttribute() {
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.call("dom_binding", "set_widget", {
            element: "#widget",
            html: "$template.dom-summary",
            url: "/app/dom/template.html",
            context: this
        });
    }

    async clearWidget() {
        await crs.call("dom_binding", "clear_widget", {
            element: "#widget"
        });
    }

    async moveToList() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_to_list",
                args: { schema: "move-element" }
            }
        })
    }

    async moveInDeck() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_in_deck",
                args: { schema: "move-element" }
            }
        })
    }

    async moveToFirst() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_to_first",
                args: { schema: "move-element" }
            }
        })
    }

    async moveToLast() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_to_last",
                args: { schema: "move-element" }
            }
        })
    }

    async moveDown() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_down",
                args: { schema: "move-element" }
            }
        })
    }

    async moveUp() {
        await crs.binding.events.emitter.emit("run-process", {
            context: this,
            step: {
                action: "move_up",
                args: { schema: "move-element" }
            }
        })
    }

    async applyFilter() {
        await crs.call("dom_collection", "filter_children", {
            element: "#lstFilter",
            filter: this.getProperty("filter")
        })
    }

    async clearFilter() {
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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
        await crs.binding.events.emitter.emit("run-process", {
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

        await crs.call("dom", "elements_from_template", {
            template_id     : "tpl_simple",
            template        : "#tpl_simple",
            data            : data,
            parent          : "#tpl_simple-parent",
            remove_template : true,
            recycle         : false
        }, this)
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

        await crs.call("dom", "create_inflation_template", {
            template_id: "tpl_generated",
            wrapper: {
                tag_name: "ul",
                attributes: {
                    "data-id": "wrapper-ul"
                },
                children: [
                    {
                        tag_name: "li",
                        text_content: "first item"
                    }
                ]
            },
            tag_name: "li",
            source: {
                description: {}
            }
        })

        await crs.call("dom", "elements_from_template", {
            template_id     : "tpl_generated",
            data            : data,
            parent          : "#tpl_simple-parent",
            remove_template : true
        }, this);
    }

    async getElementInstance() {
        const target = this.shadowRoot.querySelector("#get-element-target");
        const element = this.shadowRoot.querySelector(target);
        element.textContent = "element instance";
    }

    async getElementQuery() {
        const element = this.shadowRoot.querySelector("#get-element-target");
        element.textContent = "element query";
    }

    async getElementStep() {
        const context = {
            element: this.shadowRoot.querySelector("#get-element-target")
        }

        const element = await crs.call("dom", "get_element", {
            element: "$context.element"
        }, context);

        element.textContent = "element step";
    }

    async setCssVariable() {
        await crs.call("dom", "set_css_variable", {
            element: this.cssH2,
            variable: "--mybackground",
            value: "limegreen"
        })
    }

    async getCssVariable() {
        const result =await crs.call("dom", "get_css_variable", {
            element: this.cssH2,
            variable: "--mycolor",
        })
        return result;
    }

    async setCssVariables() {
        await crs.call("dom", "set_css_variables", {
            element: this.cssH2,
            variables: {
                "--mycolor": "yellow",
                "--mybackground": "crimson"
            }
        })
    }

    async getCssVariables() {
        const result = await crs.call("dom", "get_css_variables", {
            element: this.cssH2,
            variables: ["--mycolor", "--mybackground"]
        })
        return result;
    }

    async findParentByType(event, type) {
        const args = {element: event.target};
        if (type === "matches") {
            args.nodeQuery = "[data-id='findMe']";
        } else {
            args.nodeName = "section";
        }

        const result = await crs.call("dom_utils", "find_parent_of_type", args);

        await crs.call("dom_interactive", "highlight", {
            target: result,
            duration: 500,
            classes: ["highlight"]
        })
    }

    async addResizeObserver() {
        const args = {
            element: this.resizeContainer,
            callback: ()=> {
                this.resizeObserverText.textContent = "resize observer fired";
            }
        }

        await crs.call("dom_observer", "enable_resize", args);
        this.resizeObserverText.textContent = "resize observer added";
    }

    async removeResizeObserver() {
        await crs.call("dom_observer", "disable_resize", {
            element: this.resizeContainer
        });
        this.resizeObserverText.textContent = "resize observer removed";
    }

    async updateResizeContainer() {
        this.resizeContainer.style.width = Math.random() * 100 + "%";
    }
}