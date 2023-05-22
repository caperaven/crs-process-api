export default class FixedPositionVM extends crs.binding.classes.ViewBase {
    get middle() {
        const isMiddle = this.getProperty("middle");
        return isMiddle == true ? "middle" : null;
    }

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
            anchor: this.middle || "top",
            margin: 10
        })
    }

    async right(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "right",
            anchor: this.middle || "bottom"
        })
    }

    async top(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "top",
            anchor: this.middle || "left"
        })
    }

    async bottom(event) {
        await crs.call("fixed_layout", "set", {
            target: this.target,
            element: this.move,
            at: "bottom",
            anchor: this.middle || "right"
        })
    }

    async click(event) {
        if (event.target == this.container) {
            await crs.call("fixed_layout", "set", {
                element: this.move,
                point: {x: event.clientX, y: event.clientY},
                at: "bottom",
                anchor: this.middle || "left"
            })
        }
    }
}