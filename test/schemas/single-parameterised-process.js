/**
 * The purpose of this example is to ensure the pre process runs that populates the
 * parameters property according to what is defined in the parameters_def
 */
export const process = {
    parameterised: {
        parameters_def: {
            value: {required: true, default: "@context.value"}
        },

        steps: {
            start: {
                next_step: "multiply"
            },

            multiply: {
                type: "math",
                action: "multiply",
                args: {
                    value1: "@process.parameters.value",
                    value2: 10,
                    target: "@process.result"
                }
            }
        }
    }
}