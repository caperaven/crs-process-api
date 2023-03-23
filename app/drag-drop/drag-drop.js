import {schema} from "./schema.js";

export default class DragDrop extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(schema);

        const context = {};

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartStandard",
            options: {
                drag: {
                    placeholderType: "standard",
                },
                drop: {
                    allowCallback: {
                        type: "process",
                        action: "main",
                        args: {
                            schema: "drag-drop",
                        }
                    },
                },
                autoScroll: "hv"
            }
        }, context)

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartOpacity",
            options: {
                drag: {
                    placeholderType: "opacity",
                },
                drop: {
                    allowProcess2: {
                        type: "console",
                        action: "log",
                        args: {

                        }
                    },

                    allowDrop: (dragElement, target, options) => {
                        return target;
                    },
                    action: "copy",
                    callback: (element, target) => { console.log(element, target) }
                }
            }
        })

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartNone",
            options: {
                drag: {
                    placeholderType: "none"
                }
            }
        })

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divCloneTemplate",
            options: {
                drag: {
                    placeholderType: "none",
                    clone: "template"
                },
                drop: {
                    clone: "template",
                    action: "copy"
                }
            }
        })

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "ul",
            options: {
                marker: true,
                drag: {
                    query: ".red",
                    cpIndex: 1 // what index on the composing path are we moving
                },
                drop: {
                    allowDrop: async (dragElement, target, options) => {
                        if (target.tagName === "LI" || target.id == "mylist") {
                            return target;
                        }
                    }
                }
            }
        })
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}