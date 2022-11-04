export const schema = {
    id: "drag-drop",

    main: {
        steps: {
            start: {
                type: "object",
                action: "set",
                args: {
                    properties: {
                        "$context.id": "$item.dragElement.dataset.id"
                    }
                },
                next_step: "print"
            },

            print:  {
                type: "console",
                action: "log",
                args: {
                    messages: ["$context"]
                }
            }
        }
    }
}