export const schema = {
    id: "user-input",

    main: {
        parameters_def: {
            bId: { type: "number", required: true }
        },

        steps: {
            start: { next_step: "show_ui" },

            show_ui: {
                type: "dom",
                action: "show_form_dialog",
                args: {
                    id: "input-form-ui",
                    html: "$template.process-input-form",
                    url: "/templates/input_form.html",
                    error_store: "input_validation"
                },
            }
        }
    },
}