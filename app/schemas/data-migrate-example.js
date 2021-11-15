export const schema = {
    id: "data-migrate-process-domExample",

    main: {
        parameters_def: {
            taskId : { type: "string", required: true },
            assetId: { type: "string", required: true }
        },

        id: "data-migration-main",      // required for bindable to create a context
        bindable: true,

        steps: {
            start: {
                binding: {
                    taskId: "$parameters.taskId",
                    assetId: "$parameters.assetId"
                },

                next_step: "show_ui"
            },

            show_ui: {
                type: "dom",
                action: "show_widget_dialog",

                args: {
                    id: "current-process-ui",
                    html: "$template.my_dialog",
                    url: "/templates/current_process_ui.html"
                },

                next_step: "copy_spares" // don't wait just continue with process.
            },

            copy_spares: {
                type: "process",
                action: "copy_spares",
                args: {
                    schema: "data-migrate-process-domExample",
                    parameters: {
                        bId: "$bId"
                    }
                },
                next_step: "copy_attributes"
            },

            copy_attributes: {
                type: "process",
                action: "copy_attributes",
                args: {
                    schema: "data-migrate-process-domExample",
                    parameters: {
                        bId: "$bId"
                    }
                },
                next_step: "close"
            },

            close: {
                type: "dom",
                action: "remove_element",
                args: {
                    query: "#current-process-ui"
                }
            }
        }
    },

    copy_spares: {
        parameters_def: {
            bId: { type: "number", required: true }
        },
        steps: {
            start: { next_step: "get_data" },

            get_data: {
                type: "system",
                action: "sleep",
                args: {
                    duration: 1000,
                },
                binding: {
                    title: "copy spares"
                }
            }
        }
    },

    copy_attributes: {
        parameters_def: {
            bId: { type: "number", required: true }
        },
        steps: {
            start: { next_step: "get_data" },

            get_data: {
                type: "system",
                action: "sleep",
                args: {
                    duration: 1000,
                },
                binding: {
                    title: "copy attributes"
                }
            }
        }
    }
}