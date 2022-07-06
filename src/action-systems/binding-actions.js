export class BindingActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Create a binding context to get and set data on
     * You are responsible to clear the context once done using "free_context"
     * @returns {Promise<void>}
     */
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

    /**
     * Free binding context, once you are done with it in this process
     * @returns {Promise<void>}
     */
    static async free_context(step, context, process, item) {
        if (process.parameters.bId != null) {
            crsbinding.data.removeObject(process.parameters.bId);
            delete process.parameters.bId;
        }
    }

    /**
     * crs-binding.getProperty
     * @returns {Promise<void>}
     */
    static async get_property(step, context, process, item) {
        const property = step.args.property;
        const value = await crsbinding.data.getProperty(process.parameters.bId, property);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, value, context, process, item);
        }

        return value;
    }

    /**
     * crs-binding.setProperty
     * @returns {Promise<void>}
     */
    static async set_property(step, context, process, item) {
        const property = step.args.property;
        const value = await crs.process.getValue(step.args.value, context, process, item);
        crsbinding.data.setProperty(process.parameters.bId, property, value);
    }

    /**
     * Get the data object of the binding context
     * @returns {Promise<void>}
     */
    static async get_data(step, context, process, item) {
        const data = crsbinding.data._data[process.parameters.bId];

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, data, context, process, item);
        }
    }

    /**
     * Set errors on a given error store.
     * Default store is "errors" if you don't provide a store.
     * @returns {Promise<void>}
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
}

crs.intent.binding = BindingActions;