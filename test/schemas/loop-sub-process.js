export const processes = {
    id: "loop_sub",

    process1: {
        data: {
            sum: 0
        },
        steps: {
            start: {
                next_step: "loop"
            },
            loop: {
                type: "loop",
                args: {
                    source: "$context.records",
                    steps: {
                        sum: {
                            type: "process",
                            action: "add",
                            args: {
                                schema: "loop_sub",
                                parameters: {
                                    value1: "$process.data.sum",
                                    value2: "$item.value"
                                },
                                target: "$process.data.sum"
                            }
                        }
                    }
                },
                next_step: "ave"
            },
            ave: {
                type: "math",
                action: "divide",
                args: {
                    value1: "$process.data.sum",
                    value2: "$context.records.length",
                    target: "$process.result"
                }
            }
        }
    },

    add: {
        steps: {
            start: {
                next_step: "sum"
            },
            sum: {
                type: "math",
                action: "add",
                args: {
                    value1: "$process.parameters.value1",
                    value2: "$process.parameters.value2",
                    target: "$process.result"
                }
            }
        }
    }
}