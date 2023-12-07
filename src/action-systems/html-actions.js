/**
 * @class HTMLActions - This class contains the actions for the html action system.
 * @description It provides a set of functions that allow you to interact with the html action system.
 *
 * Features:
 * -perform - This method is called by the action system to perform the action.
 * -get - performs a conversion and then returns the result.
 * -create - Create a element and inflate it using the provided ctx object. This returns a HTMLElement based on the html string provided.
 */
export class HtmlActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method get - If the step has a URL, then load the template from the URL and return the result. Otherwise, if the step has a
     * schema, then load the schema and return the result. Otherwise, if the step has a function, then call the function
     * and return the result. Otherwise, if the step has a markdown, then convert the markdown to HTML and return the
     * result
     * @param step {object} - the step object
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - the process object
     * @param item {object} - the item being processed
     *
     * @param [step.args.url = "url"] {string} - The URL of the template to load.
     * @param [step.args.template = "example"] {string} - The name of the template to load.
     * @param [step.args.schema = {schema}] {object} - The URL of the schema to load.
     * @param [step.args.function] {string} - The function to call.
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
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("html", "get", {
     *     schema: {
     *         body: {
     *             "elements": [ { "element": "div", "content": "Hello World" } ]
     *         }
     *     }
     *}, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "html",
     *     "action": "get",
     *     "args": {
     *          "schema": {
     *              "body": {
     *                "elements": [ { "element": "div", "content": "Hello World" } ]
     *              }
     *           }
     *      }
     * }
     */
    static async get(step, context, process, item) {
        let result;

        if (step.args.url != null) {
            if (step.args.template != null) {
                result = await this.#from_template(step, context, process, item);
            }
            result = await this.#from_file(step, context, process, item);
        }

        else if (step.args.schema != null) {
            result = await this.#from_schema(step, context, process, item);
        }

        else if (step.args.function != null) {
            result = await this.#from_function(step, context, process, item);
        }

        else if (step.args.markdown != null) {
            result = await crs.call("markdown", "to_html", step.args, context, process, item);
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method template_from_file - Loads a template from a file and returns the result as a HTML Template element.
     * @param step {object} - The step object
     * @param context {object} - The context of the current process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     * @returns {Promise<void>}
     */
    static async template_from_file(step, context, process, item) {
        const url = await crs.process.getValue(step.args.url, context, process, item);
        const html = await fetch(url).then(result => result.text());
        const template = document.createElement("template");
        template.innerHTML = html;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, template, context, process, item);
        }

        return template;
    }

    /**
     * @method create - Creates an element and inflate it using the provided ctx object. This returns a HTMLElement based on the html string provided
     * @param step {object} - The step object
     * @param context {object} - The context of the current process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.html {string} - The html string to inflate.
     * @param step.args.ctx {object} - The context object to use when inflating the html.
     * @param [step.args.target = "$context.result"] {string} - The target to set the result to.
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
     * @method #from_file - It takes a URL, fetches the contents of that URL, and returns the contents as a string
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The current item being processed.
     *
     * @param step.args.url {string} - The URL to fetch the file from.
     *
     * @returns The text of the file.
     */
    static async #from_file(step, context, process, item) {
        const url = await crs.process.getValue(step.args.url, context, process, item);
        return await fetch(url).then(result => result.text());
    }

    /**
     * @method #from_template - It takes a template, and returns the result of the template
     * @param step {object} - the step object
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - the process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.template {string} - The template to use.
     * @param step.args.url {string} - The URL to fetch the template from.
     *
     * @returns The template is being returned.
     */
    static async #from_template(step, context, process, item) {
        const template = await crs.process.getValue(step.args.template, context, process, item);
        const url = await crs.process.getValue(step.args.url, context, process, item);
        return await crsbinding.templates.get(template, url);
    }

    /**
     * @method #from_schema -  It takes a schema, and returns a parser
     * @param step {object} - The step object from the process definition.
     * @param context {object} - The context of the current process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.schema {object} - The schema to use.
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
     * @method #from_function - It takes a function and a list of parameters, and calls the function with the parameters
     * @param step {object} - The step object that is being executed.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - The process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.function {string} - The function to call.
     * @param [step.args.parameters = [parameters]] {array} - The parameters to pass to the function.
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