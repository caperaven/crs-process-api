// https://caperaven.co.za/process-api/using-process-ai/binding-module/
export class BindingActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async create_context(step, context, process, item) {
        const name = process.id || step?.args?.context_id || "process_context";
        const bId = crsbinding.data.addObject(name);

        if (process != null) {
            process.parameters = process.parameters || {};
            process.parameters.bId = bId;
        }

        crsbinding.data.addContext(bId, {});

        return bId;
    }

    static async free_context(step, context, process, item) {
        if (process.parameters.bId != null) {
            crsbinding.data.removeObject(process.parameters.bId);
            delete process.parameters.bId;
        }
    }

    static async get_property(step, context, process, item) {
        const property = step.args.property;
        const value = await crsbinding.data.getProperty(process.parameters.bId, property);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    static async set_property(step, context, process, item) {
        const property = step.args.property;
        const value = await crs.process.getValue(step.args.value, context, process, item);
        crsbinding.data.setProperty(process.parameters.bId, property, value);
    }

    static async get_data(step, context, process, item) {
        const data = crsbinding.data._data[process.parameters.bId];

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, data, context, process, item);
        }
    }

    /**
     * // JHR: is this still relevant on the new binding engine?
     */
    static async set_errors(step, context, process, item) {
        const store = step.args.error_store || "errors";
        const source = await crs.process.getValue(step.args.errors, context, process, item);
        const errors = [];

        for (let error of source) {
            errors.push({
                message: error
            })
        }

        await crsbinding.data.setProperty(process.parameters.bId, store, errors);
    }

    static async set_global(step, context, process, item) {
        const property = await crs.process.getValue(step.args.property, context, process, item);
        const value = await crs.process.getValue(step.args.value, context, process, item);
        crsbinding.data.setProperty(crsbinding.$globals, property, value);
    }

    static async set_globals(step, context, process, item) {
        const values = await crs.process.getValue(step.args.values, context, process, item);
        const keys = Object.keys(values);

        for (let key of keys) {
            crsbinding.data.setProperty(crsbinding.$globals, key, values[key]);
        }
    }

    static async get_global(step, context, process, item) {
        const property = await crs.process.getValue(step.args.property, context, process, item);
        const value = crsbinding.data.getProperty(crsbinding.$globals, property);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    static async get_globals(step, context, process, item) {
        const values = await crs.process.getValue(step.args.values, context, process, item);
        const keys = Object.keys(values);

        for (let key of keys) {
            const value = crsbinding.data.getProperty(crsbinding.$globals, key);
            values[key] = value;
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return values;
    }
}

crs.intent.binding = BindingActions;