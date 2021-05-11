export const schema = {
    get_input: {
        type: "template",
        action: "show",
        args: {
            remote: "server.input.json"
        }
    }
}

/**
 *  Schema HTML Manager -> process UI schema to HTML (actions) ... const html = schemaManager.parse(schema)
 *  Schema Process Manager -> run program ... const output = crs.process.run(schema)
 *
 *  1. execute process ->
 *
 */