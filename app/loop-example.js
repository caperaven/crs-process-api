export const schema = {
    id: "loop-example",

    main: {
        data: {},
        steps: {
            start: {next_step: "get_data"},

            get_data: {
                type: "process",
                action: "get_data_process",
                args: {
                    schema: "loop-example",
                    target: "@process.data.records"
                },
                next_step: "process_data"
            },

            process_data: {
                type: "process",
                action: "process_data_process",
                args: {
                    schema: "loop-example",
                    parameters: {
                        records: "@process.data.records"
                    },
                    target: "@process.data.result"
                },
                next_step: "save_data"
            },

            save_data: {
                type: "process",
                action: "save_data_process",
                args: {
                    schema: "loop-example",
                    parameters: {
                        result: "@process.data.result"
                    }
                }
            }
        }
    },

    get_data_process: {
        data: {},
        steps: {
            start: { next_step: "get_data" },

            get_data: {
                type: "object",
                action: "get",
                args: {
                    source: "@context.data",
                    target: "@process.data.records"
                },
                next_step: "validate"
            },

            validate: {
                type: "condition",
                args: {
                    condition: "@process.data.records.length > 0",
                    fail_step: {
                        type: "console",
                        action: "error",
                        args: {
                            message: "NO records to process"
                        }
                    },
                    pass_step: "stop"
                }
            },

            stop: {
                type: "object",
                action: "set",
                args: {
                    target: "@process.result",
                    value: "@process.data.records"
                }
            }
        }
    },

    process_data_process: {
        parameters_def: {
            records: {type: "array", required: true}
        },
        data: {
            collection1: [],
            collection2: []
        },
        steps: {
            start: { next_step: "loop" },
            loop: {
                type: "loop",
                args: {
                    source: "@process.parameters.records",
                    steps: {
                        check_lower: {
                            type: "condition",
                            args: {
                                condition: "@item.id < 10",
                                pass_step: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "@process.data.collection1",
                                        value: "@item"
                                    }
                                }
                            }
                        },
                        check_upper: {
                            type: "condition",
                            args: {
                                condition: "@item.id >= 10",
                                pass_step: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "@process.data.collection2",
                                        value: "@item"
                                    }
                                }
                            }
                        }
                    }
                },
                next_step: "stop"
            },
            stop: {
                type: "object",
                action: "set",
                args: {
                    target: "@process.result",
                    value: "@process.data"
                }
            }
        }
    },

    save_data_process: {
        parameters_def: {
            result: {type: "object", required: true}
        },
        steps: {
            start: { next_step: "log_collection1" },
            log_collection1: {
                type: "console",
                action: "table",
                args: {
                    message: "@process.parameters.result.collection1"
                },
                next_step: "log_collection2"
            },
            log_collection2: {
                type: "console",
                action: "table",
                args: {
                    message: "@process.parameters.result.collection2"
                }
            }
        }
    }
}