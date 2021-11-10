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
        const name = process.id || step.args.contextId || "process_context";
        process.bId = crsbinding.data.addObject(name);
        crsbinding.data.addContext(process.bId, {});
    }

    /**
     * Free binding context, once you are done with it in this process
     * @returns {Promise<void>}
     */
    static async free_context(step, context, process, item) {
        if (process.bId != null) {
            crsbinding.data.removeObject(process.bId);
            delete process.bId;
        }
    }

    /**
     * crs-binding.getProperty
     * @returns {Promise<void>}
     */
    static async get_property(step, context, process, item) {
        const property = step.args.property;
        const value = await crsbinding.data.getProperty(process.bId, property);

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
        crsbinding.data.setProperty(process.bId, property, value);
    }

    /**
     * Get the data object of the binding context
     * @returns {Promise<void>}
     */
    static async get_data(step, context, process, item) {
        const data = crsbinding.data._data[process.bId];

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, data, context, process, item);
        }
    }

    /**
     * Add an item to a existing array that is bound to
     * @returns {Promise<void>}
     */
    static async add_array_items(step, context, process, item) {

    }
}