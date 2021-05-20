export const processes = {
    id: "sub_example",

    process1: {
        data: {
            sum: 0
        },
        steps: {
            start: {
                next_step: "get_values"
            },
            get_values: {
                type: "process",
                action: "process2",
                args: {
                    schema: "sub_example",
                    parameters: {
                        value1: 10,
                        value2: 11
                    },
                    result: "@process.result"
                }
            }
        }
    },

    process2: {
        parameters_def: {
            value1: {type: "number", required: true},
            value2: {type: "number", required: true}
        },

        // parameters1: {
        //     value1: null,
        //     value2: null
        // },
        //
        // result: null,

        steps: {
            start: {
                next_step: "add"
            },
            // validate: {
            //     type: "validate",
            //     action: "requires", // isArray, isNumber, isDate, isLocalDate, isString
            //     args: ["@process.parameters.value1", "@process.parameters.value2"],
            //     next_step: "add"
            // },
            add: {
                type: "math",
                action: "add",
                args: {
                    value1: "@process.parameters.value1",
                    value2: "@process.parameters.value2",
                    target: "@process.result"
                },
            }
        }
    }
}