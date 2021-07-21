export const schema = {
    distribute_array: {

        // data object used as a storage of data during the process.
        data: {
            min_collection: [],
            records: null,
            max_collection: []
        },

        // process steps.
        steps: {
            start: {
                next_step: "get_data"
            },

            get_data: {
                type: "data",
                action: "local",
                args: {
                    source: "$context.datasource.data",
                    target: "$process.data.records"
                },
                next_step: "validate_record_count"
            },

            validate_record_count: {
                type: "conditions",
                args: {
                    condition: "$process.data?.records?.length > 0",
                    fail_step: {
                        type: "log",
                        action: "error",
                        args: {
                            message: "No records to process"
                        },
                        next_step: "done"
                    },
                    pass_step: "$process.loop"
                },
            },

            loop: {
                type: "loop",
                args: {
                    source: "$process.data.records",
                    steps: {
                        smaller_condition: {
                            type: "condition",
                            args: {
                                condition: "$item.value <= 10",
                                pass_step: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "$process.data.min_collection",
                                        value: "$item"
                                    }
                                }
                            },
                            next_step: "greater_condition"
                        },

                        greater_condition: {
                            type: "condition",
                            args: {
                                condition: "$item.value > 10",
                                pass_step: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "$process.data.max_collection",
                                        value: "$item"
                                    }
                                }
                            }
                        }
                    }
                },
                next_step: "log",
            },
            log: {
                type: "console",
                action: "log",
                args: {
                    messages: ["$process.data.min_collection", "$process.data.max_collection"]
                },
                next_step: "done"
            },
            done: {
                type: "console",
                action: "log",
                args: {
                    message: "___ distribute process done ___"
                }
            }
        }
    }
}