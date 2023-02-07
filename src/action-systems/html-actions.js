/**
 * @class HTMLActions - This class contains the actions for the html action system.
 * @description It provides a set of functions that allow you to interact with the html action system.
 *
 * Features:
 * perform - This method is called by the action system to perform the action.
 * get - performs a conversion and then returns the result.
 * create - Create a element and inflate it using the provided ctx object. This returns a HTMLElement based on the html string provided.
 */
export class HtmlActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method If the step has a URL, then load the template from the URL and return the result. Otherwise, if the step has a
     * schema, then load the schema and return the result. Otherwise, if the step has a function, then call the function
     * and return the result. Otherwise, if the step has a markdown, then convert the markdown to HTML and return the
     * result
     * @param step - the step object
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - the item being processed
     *
     * @param url {string} - The URL to fetch the template from.
     * @param template {string} - The name of the template to fetch.
     * @param schema {string} - The name of the schema to fetch.
     * @param function {string} - The name of the function to call.
     * @param markdown {string} - The markdown to convert to HTML.
     * @param args {object} - The arguments to pass to the function.
     *
     * @returns The result of the function call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("html", "get", {
     *     template: "example",
     *     url: "import.meta.url.replace("example-systems-tests/example-actions.test.js", "example.html")"
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "html",
     *    "action": "get",
     *    "args": {
     *        "template": "example"
     *        "url": "import.meta.url.replace("example-systems-tests/example-actions.test.js", "example.html")"
     *     }
     * }
     */
    static async get(step, context, process, item) {
        if (step.args.url != null) {
            if (step.args.template != null) {
                return await this.#from_template(step, context, process, item);
            }
            return await this.#from_file(step, context, process, item);
        }

        if (step.args.schema != null) {
            return await this.#from_schema(step, context, process, item);
        }

        if (step.args.function != null) {
            return await this.#from_function(step, context, process, item);
        }

        if (step.args.markdown != null) {
            return await crs.call("markdown", "to_html", step.args, context, process, item);
        }
    }

    /**
     * @method Creates an element and inflate it using the provided ctx object. This returns a HTMLElement based on the html string provided
     * @param step - The step object
     * @param context - The context of the current process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param html {string} - The HTML to inflate
     * @param ctx {object} - The context to inflate the HTML with
     * @param target {string} - The target to set the result to.
     *
     * @returns The result of the template.
     *
     * @example <caption>javascript example</caption>
     * const html = await crs.call("html", "create",{
     *      html: "<div>${codeId}</div>",
     *      ctx: {code: "JC"}
     * },context, process, item);
     *
     * @example <caption>json example</caption>
     *{
     *     "type": "html",
     *     "action": "create",
     *     "args": {
     *          "html": "<div>${codeId}</div>",
     *          "ctx": { "code": "JC" },
     *          "target": "$context.result"
     *     }
     * }
     */
    static async create(step, context, process, item) {
        const html = step.args.html.indexOf("<") == -1 ?
            await crs.process.getValue(step.args.html, context, process, item) : step.args.html;
        const ctx = await crs.process.getValue(step.args.ctx, context, process, item);

        const inflated = await crs.call("string", "inflate", {
            parameters: ctx,
            template: html
        }, context, process, item);

        const template = document.createElement("template");
        template.innerHTML = inflated;
        const result = template.content;

        if (step.args.target != null) {
            await crs.process.setValue(args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method It takes a URL, fetches the contents of that URL, and returns the contents as a string
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The current item being processed.
     *
     * @param url {string} - The URL to fetch
     *
     * @returns The text of the file.
     */
    static async #from_file(step, context, process, item) {
        const url = await crs.process.getValue(step.args.url, context, process, item);
        return await fetch(url).then(result => result.text());
    }

    /**
     * @method It takes a template, and returns the result of the template
     * @param step - the step object
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param template {string} - The name of the template
     * @param url {string} - The URL to fetch the template from.
     *
     * @returns The template is being returned.
     */
    static async #from_template(step, context, process, item) {
        const template = await crs.process.getValue(step.args.template, context, process, item);
        const url = await crs.process.getValue(step.args.url, context, process, item);
        return await crsbinding.templates.get(template, url);
    }

    /**
     * @method It takes a schema, and returns a parser
     * @param step - The step object from the process definition.
     * @param context - The context of the current process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param json {string} - The schema to parse
     *
     * @returns A schema object.
     */
    static async #from_schema(step, context, process, item) {
        let json = await crs.process.getValue(step.args.schema, context, process, item);

        if (typeof json == "string") {
            json = await fetch(json).then(result => result.json());
        }

        return schema?.parser?.parse(json);
    }

    /**
     * @method It takes a function and a list of parameters, and calls the function with the parameters
     * @param step - The step object that is being executed.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param fn {function} - The function to call
     * @param parameters {array} - The parameters to pass to the function
     *
     * @returns The result of the function call.
     */
    static async #from_function(step, context, process, item) {
        const fn = await crs.process.getValue(step.args.function, context, process, item);
        const parameters = await crs.process.getValue(step.args.parameters || [], context, process, item);
        return await fn(...parameters);
    }
}

crs.intent.html = HtmlActions;