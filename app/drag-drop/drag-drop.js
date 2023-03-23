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
                }
            }
        }, context)

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartOpacity",
            options: {
                drag: {
                    placeholderType: "opacity",
                },
                drop: {
                    allowDrop: (dragElement, target, options) => {
                        return {
                            target, position: "append"
                        };
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
                drag: {
                    query: ".red",
                    cpIndex: 1 // what index on the composing path are we moving
                },
                drop: {
                    allowDrop: async (dragElement, target, options) => {
                        // drop check, only drop on container
                        if (options.currentAction == "drop") {
                            if (target.tagName === "LI") {
                                return {
                                    target,
                                    position: "before"
                                }
                            }

                            if (target.parentElement.tagName === "LI") {
                                return {
                                    target: target.parentElement,
                                    position: "before"
                                }
                            }

                            if (target.id !== "mylist") {
                                return null;
                            }

                            return {
                                target: target,
                                position: "append"
                            }
                        }

                        // move operation allow marker to update on list items also
                        if (target.tagName === "LI" || target.id == "mylist") {
                            return { target };
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