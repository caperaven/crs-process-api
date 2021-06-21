export class DomActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async set_attribute(step, context, process, item) {
        const element = document.querySelector(step.args.query);
        element.setAttribute(step.args.attr, await crs.process.getValue(step.args.value, context, process, item));
    }

    static async get_attribute(step, context, process, item) {
        const element = document.querySelector(step.args.query);
        const value = element?.getAttribute(step.args.attr);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    static async set_style(step, context, process, item) {
        const element = document.querySelector(step.args.query);
        element.style[step.args.style] = await crs.process.getValue(step.args.value, context, process, item);
    }

    static async get_style(step, context, process, item) {
        const element = document.querySelector(step.args.query);
        const value = element?.style[step.args.style];

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    static async set_text(step, context, process, item) {
        const element = document.querySelector(step.args.query);
        element.textContent = await crs.process.getValue(step.args.value, context, process, item);
    }

    static async get_text(step, context, process, item) {
        const element = document.querySelector(step.args.query);
        const value = element.textContent;

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    static async create_element(step, context, process, item) {
        const parentElement = document.querySelector(step.args.parentQuery);
        const element = document.createElement(step.args.tagName);

        const attributes = Object.keys(step.args.attributes || {});
        const styles = Object.keys(step.args.styles || {});

        for (let attr of attributes) {
            element.setAttribute(attr, await crs.process.getValue(step.args.attributes[attr], context, process, item));
        }

        for (let style of styles) {
            element.styles[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }

        if (step.args.textContent != null) {
            element.textContent = await crs.process.getValue(step.args.textContent, context, process, item);
        }

        if (step.args.id != null) {
            element.id = step.args.id;
        }

        parentElement?.appendChild(element);
    }

    static async post_message(step, context, process, item) {
        const parameters = step.parameters == null ? {} : JSON.parse(JSON.stringify(step.args.parameters));
        const keys = Object.keys(parameters);

        for (let key of keys) {
            parameters[key] = await crs.process.getValue(key, context, process, item);
        }

        await crsbinding.events.emitter.emit(step.args.event, parameters);
    }
}