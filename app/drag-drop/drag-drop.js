export default class DragDrop extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartStandard",
            options: {
                drag: {
                    placeholderType: "standard",
                }
            }
        })

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartOpacity",
            options: {
                drag: {
                    placeholderType: "opacity"
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
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}