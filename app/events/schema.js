export const schema = {
    id: "events-example",

    emit_message: {
        steps: {
            start: {
                type: "events",
                action: "emit",
                args: {
                    event: "my-event",
                    parameters: {
                        message: "Hello from event"
                    }
                }
            }
        }
    },

    post_message: {
        steps: {
            start: {
                type: "events",
                action: "post_message",
                args: {
                    query: "my-component",
                    parameters: {
                        message: "Hello from post message"
                    }
                }
            }
        }
    },

    on_message: {
        steps: {
            start: {
                type: "events",
                action: "on",
                args: {
                    query: "my-event",
                    event_step: "set_value"
                },
                next_step: "pause"
            },

            pause: {
                type: "system",
                action: "pause"
            },

            set_value: {
                next_step: "resume"
            },

            resume: {
                type: "system",
                action: "resume"
            }
        }
    }
}