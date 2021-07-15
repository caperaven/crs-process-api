export const process = {
    data: {
        errors: []
    },
    steps: {
        start: { next_step: "process_steps" },
        process_steps: {
            type: "loop",
            args: {
                source: "@context.steps",
                target: "@process.data.currentStep",
                steps: {
                    process_errors: {
                        type: "loop",
                        args: {
                            source: "@process.data.currentStep.errors",
                            target: "@process.data.currentError",
                            steps: {
                                clone_step: {
                                    type: "object",
                                    action: "clone",
                                    args: {
                                        source: "@process.data.currentStep",
                                        target: "@process.data.currentClone",
                                        fields: ["code"]
                                    }
                                },
                                assign_error_fields: {
                                    type: "object",
                                    action: "assign",
                                    args: {
                                        source: "@process.data.currentError",
                                        target: "@process.data.currentClone"
                                    }
                                },
                                copy_to_new_errors: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "@process.data.errors",
                                        value: "@process.data.currentClone"
                                    }
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
                value: "@process.data.errors"
            }
        }
    }
};