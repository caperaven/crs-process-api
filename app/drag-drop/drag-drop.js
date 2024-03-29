import {schema} from "./schema.js";
import "./list-component/list-component.js";

export default class DragDrop extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
        crs.processSchemaRegistry.add(schema);

        const context = {};

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: this.shadowRoot.querySelector("#divStartStandard"),
            options: {
                drag: {
                    placeholderType: "standard",
                }
            }
        }, context)

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: this.shadowRoot.querySelector("#divStartOpacity"),
            options: {
                drag: {
                    placeholderType: "opacity",
                },
                drop: {
                    allowDrop: (target, options) => {
                        if (options.currentAction == "drop") {
                            if (target.classList.contains("drop-target")) {
                                return {target, position: "append"};
                            }

                            if (target.classList.contains("card")) {
                                return {target, position: "before"};
                            }
                        }
                        else {
                            if (target.classList.contains("drop-target")) {
                                return {target, position: "append"};
                            }

                            if (target.classList.contains("card")) {
                                return {target, position: "before"};
                            }
                        }
                    },
                    action: "copy",
                    callback: (element, target) => { console.log(element, target) }
                }
            }
        })

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: this.shadowRoot.querySelector("#divStartNone"),
            options: {
                drag: {
                    placeholderType: "none"
                }
            }
        })

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: this.shadowRoot.querySelector("#divCloneTemplate"),
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
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}