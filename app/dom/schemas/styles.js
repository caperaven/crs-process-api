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
                    element: "#edtStyle",
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
                    element: "#edtStyle",
                    style: "background",
                    value: "$binding.styleValue"
                }
            }
        }
    },

    add_class: {
        steps: {
            start: {
                type: "dom",
                action: "add_class",
                args: {
                    element: "#class-target",
                    value: "bg_red"
                }
            }
        }
    },

    add_classes: {
        steps: {
            start: {
                type: "dom",
                action: "add_class",
                args: {
                    element: "#class-target",
                    value: ["bg_red", "fg_white"]
                }
            }
        }
    },

    remove_class: {
        steps: {
            start: {
                type: "dom",
                action: "remove_class",
                args: {
                    element: "#class-target",
                    value: ["bg_red", "fg_white"]
                }
            }
        }
    }
}