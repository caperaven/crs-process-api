export default class DragDrop extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("dom_interactive", "enable_dragdrop", {
            element: ".container",
            options: {
                rotate: 10,
                allow_drop: '[role="list"]',
                insert_between: true
            }
        })
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
    }
}