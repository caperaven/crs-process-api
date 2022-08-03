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
                    width: 300,
                    height: 300
                }
            },


            options1: {
                min: {
                    width: 100,
                    height: 100
                },
                max: {
                    width: 100,
                    height: 100
                }
            },
            options2: {
                min: "original",
                max: {
                    width: 300,
                    height: 500
                }
            }
        })
    }
}