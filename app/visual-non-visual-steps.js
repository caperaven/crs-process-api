export const schema = {
    id: "visual-and-non",

    main: {
        id: "visual-and-non-main",
        bindable: true,

        steps: {
            start: { next_step: "get_input" },

            get_input: {
                type: "process",
                action: "get_user_input",
                args: {
                    schema: "visual-and-non",
                    parameters: {
                        bId: "$bId"
                    }
                }
            }
        }
    },

    get_user_input: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: { next_step: "show_dialog" },

            show_dialog: {
                type: "dom",
                action: "show_widget_dialog",
                args: {
                    id: "input-form-ui",
                    html: "$template.process-input-form",
                    url: "/templates/input_form.html"
                },
                pass_step: "validate_input",
                fail_step: "close_dialog"
            },

            validate_input  : {
                type: "dom",
                action: "validate_form",
                args: {
                    query: "#input-form-ui form"
                },
                pass_step: "close_dialog"
            },
            close_dialog    : {
                type: "dom",
                action: "remove_element",
                args: {
                    query: "#input-form-ui"
                }
            }
        }
    },

    display_results: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: { next_step: "show_dialog" },

            show_dialog: {
                type: "dom",
                action: "form",
                args: {
                }
            }
        },

        create_form: {
            type: "dom",
            action: "form",
            args: {
                items: [
                    {
                        field: "do_tasks",
                        title: "Migrate Tasks",
                        type: "boolean",
                        default: true
                    },
                    {
                        field: "do_spares",
                        title: "Migrate Spares",
                        type: "boolean",
                        default: true
                    },
                    {
                        field: "do_attributes",
                        title: "Migrate Attributes",
                        type: "boolean",
                        default: true
                    },
                    {
                        field: "typeErrors",
                        type: "string-list",
                        styles: ["errors"]
                    }
                ]
            }
        }
    }
}