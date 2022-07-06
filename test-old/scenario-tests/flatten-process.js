export const process = {
    prefixes: {
        "$currentStep": "$process.data.currentStep",
        "$currentClone": "$process.data.currentClone"
    },
    data: {
        errors: []
    },
    steps: {
        start: { next_step: "process_steps" },
        process_steps: {
            type: "loop",
            args: {
                source: "$context.steps",
                target: "$data.currentStep",
                steps: {
                    process_errors: {
                        type: "loop",
                        args: {
                            source: "$currentStep.errors",
                            target: "$data.currentError",
                            steps: {
                                clone_step: {
                                    type: "object",
                                    action: "clone",
                                    args: {
                                        source: "$currentStep",
                                        target: "$currentClone",
                                        fields: ["code"]
                                    }
                                },
                                assign_error_fields: {
                                    type: "object",
                                    action: "assign",
                                    args: {
                                        source: "$data.currentError",
                                        target: "$currentClone"
                                    }
                                },
                                copy_to_new_errors: {
                                    type: "array",
                                    action: "add",
                                    args: {
                                        target: "$data.errors",
                                        value: "$currentClone"
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
                target: "$process.result",
                value: "$data.errors"
            }
        }
    }
};