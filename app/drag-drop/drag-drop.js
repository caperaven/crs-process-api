export default class DragDrop extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartStandard",
            options: {
                drag: {
                    placeholderType: "standard",
                },
                autoScroll: "hv"
            }
        })

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: "#divStartOpacity",
            options: {
                drag: {
                    placeholderType: "opacity",
                },
                drop: {
                    allowCallback: (dragElement, target) => {
                        console.log(dragElement, target);
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
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}