export const schema = {
    id: "data-migrate-process-schema",

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
                    taskId: "$process.parameters.taskId",
                    assetId: "$process.parameters.assetId"
                },

                next_step: "step1"
            },

            step1: {
                type: "dom",
                action: "show_widget_dialog",

                args: {
                    id: "current-process-ui",
                    html: "$template.my_dialog",
                    url: "/templates/current_process_ui.html"
                },

                binding: {
                    title: "Starting Process",
                },

                next_step: "sleep" // don't wait just continue with process.

                //pass_step: "copy_spares" // maps to ok button
            },

            sleep: {
                type: "system",
                action: "sleep",
                args: {
                    duration: 3000,
                },
                next_step: "step2"
            },

            step2: {
                binding: {
                    title: "Step 2"
                },

                next_step: "sleep2"
            },

            sleep2: {
                type: "system",
                action: "sleep",
                args: {
                    duration: 1000,
                },
                next_step: "copy"
            },

            copy: {
                type: "system",
                action: "copy_to_clipboard",
                args: {
                    source: "Process Done",
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

            // copy_spares: {
            //     type: "process",
            //     action: "copy_spares",
            //     args: {
            //         schema: "data-migrate-process-schema",
            //         parameters: {
            //             bId: "$process.bId"
            //         }
            //     },
            //     next_step: "copy_attributes"
            // },
            //
            // copy_attributes: {
            //     type: "process",
            //     action: "copy_attributes",
            //     args: {
            //         schema: "data-migrate-process-schema",
            //         parameters: {
            //             bId: "$process.bId"
            //         }
            //     },
            //     next_step: "clipboard_errors"
            // },
            //
            // clipboard_errors: {
            //     type: "system",
            //     action: "clipboard",
            //     args: {
            //         // stuff for clipboard
            //     }
            // }
        }
    }

    // copy_spares: {
    //     parameters_def: {
    //         bId: { type: "number", required: true }
    //     },
    //     steps: {
    //         start: { next_step: "get_data" },
    //
    //         get_data: {
    //             type: "data",
    //             action: "get_records",
    //             args: {
    //                 target: "$process.data.records"
    //             },
    //             next_step: "process_data"
    //         },
    //
    //         process_data: {
    //             // ...
    //         },
    //
    //         save_new: {
    //
    //         }
    //     }
    // },
    //
    // copy_attributes: {
    //     parameters_def: {
    //         bId: { type: "number", required: true }
    //     },
    //
    //     steps: {
    //         start: { next_step: "get_data" }
    //     },
    //
    //     get_data: {
    //         type: "data",
    //         action: "get_records",
    //         args: {
    //             target: "$process.data.records"
    //         },
    //         next_step: "process_data"
    //     },
    //
    //     process_data: {
    //         // ...
    //     }
    // }
}