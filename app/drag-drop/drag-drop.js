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

                    allowCallback: (dragElement, target) => {
                        return true;
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

        //NOTE KR: testing configs for drag and drop horizontal vs vertical & drag decoration
        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#parentDragContainer",
            options: {
                drag: {
                    placeholderType: "standard",
                    indicator: "#verticalIndicator"
                },
                drop: {
                    action: "reorder"
                },
                autoScroll: "hv"
            }
        }, context)

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#parentDragContainer2",
            options: {
                drag: {
                    placeholderType: "standard",
                    indicator: "#verticalIndicator"
                },
                drop: {
                    action: "reorder"
                },
                autoScroll: "hv"
            }
        }, context)
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}