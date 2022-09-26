export default class FixedPositionVM extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async left(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "left",
            anchor: "top"
        })
    }

    async right(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "right",
            anchor: "bottom"
        })
    }

    async top(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "top",
            anchor: "left"
        })
    }

    async bottom(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "bottom",
            anchor: "right"
        })
    }
}