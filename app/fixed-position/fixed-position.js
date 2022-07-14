export default class Welcome extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.centeredElement = this._element.querySelector(".center");
        this.movedElement = this._element.querySelector(".moved");

        this._element.onclick = this.moved.bind(this);
        this.currentAction = "top";
        await crs.call("fixed_layout", "show_element_relative_to", {
            element: this.movedElement,
            target: this.centeredElement,
            location: this.currentAction
        })
    }

    async disconnectedCallback() {
        this._element.onclick = null;
    }

    async moved() {
        switch (this.currentAction) {
            case "top": {
                this.currentAction = "right";
                break;
            }
            case "right": {
                this.currentAction = "bottom";
                break;
            }
            case "bottom": {
                this.currentAction = "left";
                break;
            }
            case "left": {
                this.currentAction = "top";
                break;
            }
        }

        await crs.call("fixed_layout", "show_element_relative_to", {
            element: this.movedElement,
            target: this.centeredElement,
            location: this.currentAction
        })
    }
}