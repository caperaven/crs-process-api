export const schema = {
    id: "crs-widget-example",

    set_widget: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                type: "dom",
                action: "set_widget",

                args: {
                    query: "#widget",
                    html: "$template.dom-summary",
                    url: "/app/dom/template.html"
                }
            }
        },

    },

    clear_widget: {
        steps: {
            start: {
                type: "dom",
                action: "clear_widget",
                args: {
                    query: "#widget"
                }
            }
        }
    }
}