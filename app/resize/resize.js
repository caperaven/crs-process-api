import "./../test-components/test-component.js";
export default class Resize extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("dom_interactive", "enable_resize", {
            element: this._element.querySelector(".parent"),
            resize_query: ".resize",
            options: {
                min: {
                    width: 100,
                    height: 100
                },
                max: {
                    width: 500,
                    height: 500
                }
            }
        })

        await crs.call("dom_interactive", "enable_resize", {
            element: this._element.querySelector(".columns-bar"),
            resize_query: ".resize",
            options: {
                lock_axis: "x"
            }
        })

        await crs.call("dom_interactive", "enable_resize", {
            element: this._element.querySelector(".row-bar"),
            resize_query: ".resize",
            options: {
                lock_axis: "y"
            }
        })

        await crs.call("dom_interactive", "enable_resize", {
            element: this._element.querySelector("#shadowComponent"),
            resize_query: ".resize",
            options: {

            }
        });
    }

    async disconnectedCallback() {
        await crs.call("dom_interactive", "disable_resize", {
            element: this._element.querySelector(".parent")
        })

        await crs.call("dom_interactive", "disable_resize", {
            element: this._element.querySelector(".columns-bar")
        })

        await crs.call("dom_interactive", "disable_resize", {
            element: this._element.querySelector(".row-bar")
        })

        super.disconnectedCallback();
    }
}