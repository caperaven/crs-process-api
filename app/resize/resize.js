import "./../test-components/test-component.js";
export default class Resize extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("dom_interactive", "enable_resize", {
            element: this.shadowRoot.querySelector(".parent"),
            resize_query: ".resize",
            options: {
                min: {
                    width: 100,
                    height: 100
                },
                max: {
                    width: 500,
                    height: 500
                },
                callback: (event) => console.log(event.detail)
            }
        })

        await crs.call("dom_interactive", "enable_resize", {
            element: this.shadowRoot.querySelector(".columns-bar"),
            resize_query: ".resize",
            options: {
                lock_axis: "x"
            }
        })

        await crs.call("dom_interactive", "enable_resize", {
            element: this.shadowRoot.querySelector(".row-bar"),
            resize_query: ".resize",
            options: {
                lock_axis: "y"
            }
        })

        await crs.call("dom_interactive", "enable_resize", {
            element: this.shadowRoot.querySelector("#shadowComponent"),
            resize_query: ".resize",
            options: {

            }
        });
    }

    async disconnectedCallback() {
        await crs.call("dom_interactive", "disable_resize", {
            element: this.shadowRoot.querySelector(".parent")
        })

        await crs.call("dom_interactive", "disable_resize", {
            element: this.shadowRoot.querySelector(".columns-bar")
        })

        await crs.call("dom_interactive", "disable_resize", {
            element: this.shadowRoot.querySelector(".row-bar")
        })

        super.disconnectedCallback();
    }
}