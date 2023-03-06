import init, {markdown_to_html} from  "./../bin/markdown.js"

await init();

/**
 * @class MarkdownActions - The markdown action system
 * @description It converts markdown to html
 *
 * Features:
 * -perform - The perform method is called by the action system to perform the action.
 * -to_html - Converts markdown to html
 */
export class MarkdownActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method to_html - Convert markdown to html
     * @param step {object} - The step object from the process.
     * @param context {object} - The context object that is passed to the process.
     * @param process {object} - the process object
     * @param item {object} - The item that is being processed.
     *
     * @param step.args.markdown {string} - The markdown to convert
     * @param step.args.parameters {object} - The parameters to use when inflating the markdown
     * @param [step.args.target = "$context.result"] {string} - The target to store the html
     *
     * @returns {string} - The html
     *
     * @example <caption>javascript example</caption>
     * const html = await crs.call("markdown", "to_html", {
     *     markdown: "# Hello World"
     *     parameters: {"parameter1", "parameter2"}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "markdown",
     *    "action": "to_html",
     *    "args": {
     *       "markdown": "# Hello $name",
     *       "parameters": {"parameter1", "parameter2"}
     *    }
     * }
     */
    static async to_html(step, context, process, item) {
        let markdown = await crs.process.getValue(step.args.markdown, context, process, item);
        const parameters = await crs.process.getValue(step.args.parameters, context, process, item);

        if (parameters != null || markdown.indexOf("&{") != -1) {
            const parts = [];
            const lines = markdown.split("\n");

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].indexOf("$template") != -1) continue;

                parts.push(await crs.call("string", "inflate", {
                    template: lines[i],
                    parameters
                }));
            }

            markdown = parts.join("\n");
        }

        const html = markdown_to_html(markdown);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, html, context, process, item);
        }

        return html;
    }
}

crs.intent.markdown = MarkdownActions;