import init, {markdown_to_html} from  "./../bin/markdown.js"

await init();

export class MarkdownActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async to_html(step, context, process, item) {
        const markdown = crs.process.getValue(step.args.markdown, context, process, item);
        const html = markdown_to_html();

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, html, context, process, item);
        }

        return html;
    }
}

crs.intent.markdown = MarkdownActions;