export const process = {
    id: "save spares",
    bindable: true,

    data: {
        current_errors: []
    },

    steps: {
        start: { next_step: "set_values" },

        set_values: {
            type: "data",
            action: "save",
            args: {
                errors: {

                }
            },
            pass_step: "next step",
            fail_step: "stop"
        },


        done: {
        }

    }
}