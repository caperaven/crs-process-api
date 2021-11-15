export const schema = {
    id: "styles-example",

    get_style: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        data: {},

        steps: {
            start: {
                type: "dom",
                action: "get_style",

                args: {
                    query: "#edtStyle",
                    style: "background",
                    target: "$binding.styleValue"
                }
            }
        },
    },

    set_style: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                type: "dom",
                action: "set_style",
                args: {
                    query: "#edtStyle",
                    style: "background",
                    value: "$binding.styleValue"
                }
            }
        }
    }
}