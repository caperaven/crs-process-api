export class HtmlActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

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
     * Create a element and inflate it using the provided ctx object.
     * This returns a HTMLElement based on the html string provided
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

    static async #from_file(step, context, process, item) {
        const url = await crs.process.getValue(step.args.url, context, process, item);
        return await fetch(url).then(result => result.text());
    }

    static async #from_template(step, context, process, item) {
        const template = await crs.process.getValue(step.args.template, context, process, item);
        const url = await crs.process.getValue(step.args.url, context, process, item);
        return await crsbinding.templates.get(template, url);
    }

    static async #from_schema(step, context, process, item) {
        let json = await crs.process.getValue(step.args.schema, context, process, item);

        if (typeof json == "string") {
            json = await fetch(json).then(result => result.json());
        }

        return schema?.parser?.parse(json);
    }

    static async #from_function(step, context, process, item) {
        const fn = await crs.process.getValue(step.args.function, context, process, item);
        const parameters = await crs.process.getValue(step.args.parameters || [], context, process, item);
        return await fn(...parameters);
    }
}

crs.intent.html = HtmlActions;