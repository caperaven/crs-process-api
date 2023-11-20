export const schema = {
    id: "switch-example",

    main: {
        parameters_def: {
            entityName: {
                type: "string",
                required: true
            }
        },

        steps: {
            start: {
                type: "switch",
                args: {
                    check: "$parameters.entityName",
                    cases: {
                        "RegularAssetTypeTaskResource": "printRegularAssetTypeTaskResource",
                        "RegularAssetTypeTaskSubTask": "printRegularAssetTypeTaskSubTask",
                        "RegularAssetTypeTaskSpare": "printRegularAssetTypeTaskSpare",
                        "0": "printZero"
                    },
                    default: "printDefault"
                }
            },
            printRegularAssetTypeTaskResource: {
                type: "console",
                action: "log",
                args: {
                    messages: "Regular Asset Type Task Resources passed on"
                }
            },
            printRegularAssetTypeTaskSubTask: {
                type: "console",
                action: "log",
                args: {
                    messages: "Regular Asset Type Task SubTasks passed on"
                }
            },
            printRegularAssetTypeTaskSpare: {
                type: "console",
                action: "log",
                args: {
                    messages: "Regular Asset Type Task Spares passed on"
                }
            },
            printZero: {
                type: "console",
                action: "log",
                args: {
                    messages: "Zero passed on"
                }
            },
            printDefault: {
                type: "console",
                action: "log",
                args: {
                    messages: "I don't know what to do with this entity"
                }
            }
        }
    }
}