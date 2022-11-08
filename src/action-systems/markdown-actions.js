import init, {markdown_to_html} from  "./../bin/markdown.js"

await init();

export class MarkdownActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

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