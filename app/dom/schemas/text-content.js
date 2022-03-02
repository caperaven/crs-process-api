export const schema = {
    id: "text-content-example",

    get_text: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        data: {},

        steps: {
            start: {
                type: "dom",
                action: "get_text",

                args: {
                    element: "#divText",
                    target: "$binding.textValue"
                }
            }
        },
    },

    set_text: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                type: "dom",
                action: "set_text",
                args: {
                    element: "#divText",
                    value: "$binding.textValue"
                }
            }
        }
    }
}