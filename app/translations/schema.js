export const schema = {
    id: "translations-example",

    main: {
        steps: {
            start: {
                type: "console",
                action: "log",
                args: {
                    messages: ["$translation.myprocess.message"]
                }
            }
        }
    }
}