export const schema = {
    id: "before-and-after",

    main: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                binding_before: {
                    title: "Updating color",
                    progress: "Busy setting color - 1s delay"
                },

                type: "system",
                action: "sleep",
                args: {
                    duration: 1000
                },

                next_step: "set_color"
            },

            set_color: {
                type: "dom",
                action: "set_style",
                args: {
                    query: "#h2-test",
                    style: "color",
                    value: "#ff0090"
                },

                binding_after: {
                    progress: "done..."
                }
            }
        }
    }
}