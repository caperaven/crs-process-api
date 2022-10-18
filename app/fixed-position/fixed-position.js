export default class FixedPositionVM extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        this.clickHandler = this.click.bind(this);
        this._element.addEventListener("click", this.clickHandler);
    }

    async disconnectedCallback() {
        this._element.removeEventListener("click", this.clickHandler);
        this.clickHandler = null;
    }

    async left(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "left",
            anchor: "top",
            margin: 10
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

    async click(event) {
        await crs.call("fixed_layout", "set", {
            element: this.move,
            point: {x: event.clientX, y: event.clientY},
            at: "bottom",
            anchor: "left"
        })
    }
}