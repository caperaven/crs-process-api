export const schema = {
    id: "show-dialog",

    main: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                type: "dom",
                action: "show_widget_dialog",
                args: {
                    id: "dialog-ui",
                    html: "$template.process-dialog",
                    //url: "/templates/dialog.html"
                    url: "$fn.getTemplate"
                },
                next_step: "pause"
            },

            pause: {
                type: "system",
                action: "pause",
                next_step: "close"
            },

            log: {
                type: "console",
                action: "log",
                args: {
                    message: "resumed"
                },
                next_step: "close"
            },

            close: {
                type: "dom",
                action: "remove_element",
                args: {
                    element: "#dialog-ui"
                }
            }
        }
    },


}