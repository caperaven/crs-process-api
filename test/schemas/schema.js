export const schema = {
    distribute_array: {
        // data object used as a storage of data during the process.
        data: {
            records: null,
            min_collection: [],
            max_collection: []
        },

        // process steps.
        steps: {
            start: {
                next_step: "validate_record_count"
            },

            validate_record_count: {
                type: "condition",
                args: {
                    condition: "@context.records.length > 0",
                    fail_step: {
                        type: "log",
                        action: "error",
                        args: {
                            message: "No records to process"
                        },
                        next_step: "done"
                    },
                    pass_step: "loop"
                },
            },

            loop: {
                type: "loop",
                args: {
                    source: "@context.records",
                    steps: {
                        smaller_condition: {
                            type: "condition",
                            args: {
                                condition: "@item.value <= 10",
                                pass_step: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "@process.data.min_collection",
                                        value: "@item"
                                    }
                                }
                            },
                            next_step: "greater_condition"
                        },

                        greater_condition: {
                            type: "condition",
                            args: {
                                condition: "@item.value > 10",
                                pass_step: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "@process.data.max_collection",
                                        value: "@item"
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
                    messages: ["@process.data.min_collection", "@process.data.max_collection"]
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