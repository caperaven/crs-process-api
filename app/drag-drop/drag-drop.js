export default class DragDrop extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: ".container",
            options: {
                rotate: 10
            }
        })
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}