export const schema = {
    id: "attributes-example",

    main: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        data: {},

        steps: {
            start: {
                type: "dom",
                action: "get_attribute",

                args: {
                    element: "#edtAttr",
                    attr: "data-value",
                    target: "$binding.attributeValue"
                }
            }
        },
    },

    set_attribute: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: {
                type: "dom",
                action: "set_attribute",
                args: {
                    element: "#edtAttr",
                    attr: "data-value",
                    value: "$binding.attributeValue",
                    log: "setting attribute"
                }

            }
        }
    }
}