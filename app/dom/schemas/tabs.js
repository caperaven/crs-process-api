export const schema = {
    id: "tabs-example",

    google: {
        steps: {
            start: {
                type: "dom",
                action: "open_tab",

                args: {
                    url: "http://www.google.com"
                }
            }
        }
    },

    input: {
        steps: {
            start: {
                type: "dom",
                action: "open_tab",

                args: {
                    url: "#input"
                }
            }
        }
    },

    parameters: {
        steps: {
            start: {
                type: "dom",
                action: "open_tab",

                args: {
                    url: "#input/${id}?type='tasks'&typeId='${typeId}'", // http://localhost/#input/1001?type='tasks'&typeId='2000'
                    parameters: {
                        id: 1000,
                        typeId: "$context.typeId"
                    }
                }
            }
        }
    }
}