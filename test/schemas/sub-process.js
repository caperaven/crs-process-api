export const processes = {
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
                    value1: 10,
                    value2: 11,
                    target: "@process.data.sum"
                }
            }
        }
    },

    process2: {
        data: {
            in: {
                value1: null,
                value2: null
            },
            out: null
        },
        steps: {
            start: {
            },
            add: {
                type: "math",
                action: "add",
                args: {
                    value1: "@process.data.in.value1",
                    value2: "@process.data.in.value2",
                    target: "@process.data.result"
                }
            }
        }
    }
}