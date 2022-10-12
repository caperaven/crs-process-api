export default class Move extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("dom_interactive", "enable_move", {
            element: this._element.querySelector("#block")
        })

        await crs.call("dom_interactive", "enable_move", {
            element: this._element.querySelector("#toolbar"),
            move_query: '[data-move="true"]',
        })
    }

    async disconnectedCallback() {
        await crs.call("dom_interactive", "disable_move", { element: this._element.querySelector("#block") });
        await crs.call("dom_interactive", "disable_move", { element: this._element.querySelector("#toolbar") });
    }
}