export class EventsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Use crs binding to post a message to a listening component
     * @returns {Promise<void>}
     */
    static async post_message(step, context, process, item) {
        const parameters = step.args.parameters == null ? {} : JSON.parse(JSON.stringify(step.args.parameters));
        const keys = Object.keys(parameters);

        for (let key of keys) {
            parameters[key] = await crs.process.getValue(parameters[key], context, process, item);
        }

        await crsbinding.events.emitter.postMessage(step.args.query, parameters);
    }

    /**
     * perform a crsbinding.events.emitter.emit
     * @param step
     * @param context
     * @param process
     * @param item
     * @returns {Promise<void>}
     */
    static async emit(step, context, process, item) {
        const parameters = step.args.parameters == null ? {} : JSON.parse(JSON.stringify(step.args.parameters));
        const keys = Object.keys(parameters);

        for (let key of keys) {
            parameters[key] = await crs.process.getValue(parameters[key], context, process, item);
        }

        const event = await crs.process.getValue(step.args.event, context, process, item);
        const result = await crsbinding.events.emitter.emit(event, parameters);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
    }
}