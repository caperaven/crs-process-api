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

        if (step.args.process != null) {
            return await this.#from_process(step, context, process, item);
        }

        if (step.args.function != null) {
            return await this.#from_function(step, context, process, item);
        }

        if (step.args.markdown != null) {
            return await crs.call("markdown", "to_html", step.args, context, process, item);
        }
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

    static async #from_process(step, context, process, item) {

    }

    static async #from_function(step, context, process, item) {
        const fn = await crs.process.getValue(step.args.function, context, process, item);
        const parameters = await crs.process.getValue(step.args.parameters || [], context, process, item);
        return await fn(...parameters);
    }
}

crs.intent.html = HtmlActions;