export const schema = {
    id: "filter",

    filter: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                type: "dom",
                action: "filter_children",
                args: {
                    element: "#lstFilter",
                    filter: "$binding.filter"
                }
            }
        }
    },

    clear: {
        steps: {
            start: {
                type: "dom",
                action: "filter_children",
                args: {
                    element: "#lstFilter",
                    filter: ""
                }
            }
        }
    }

}