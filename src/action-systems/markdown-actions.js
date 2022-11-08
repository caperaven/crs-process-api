import init, {markdown_to_html} from  "./../bin/markdown.js"

await init();

export class MarkdownActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async to_html(step, context, process, item) {
        let markdown = await crs.process.getValue(step.args.markdown, context, process, item);
        markdown = markdown.split("$template").join("");

        const html = markdown_to_html(markdown);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, html, context, process, item);
        }

        return html;
    }
}

crs.intent.markdown = MarkdownActions;