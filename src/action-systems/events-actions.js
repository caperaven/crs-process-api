/**
 * @class EventsActions - This class is used to perform actions related to events
 *
 * Features:
 * -post-message - post a message to a listening component
 * -emit - emit an event to a listening component
 *
 */
export class EventsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method post_message - Use crs binding to post a message to a listening component
     * @param step {object} - step to perform
     * @param context {object} - context of the action
     * @param process {object} - process that is performing the action
     * @param item {object} - item that is performing the action
     *
     * @param step.args.query {string} - query to use to find the listening component
     * @param step.args.parameters {object} - parameters to send to the listening component
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("events", "post-message", {
     *    query: "my-component",
     *    parameters: {
     *      message: "Hello World"
     *    }
     * });
     *
     * @example <caption>json</caption>
     * {
     *   "type": "events",
     *   "action": "post-message",
     *   "args": {
     *     "query": "my-component",
     *     "parameters": {
     *       "message": "Hello World"
     *      }
     *   }
     * }
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
     * @method emit -perform a crsbinding.events.emitter.emit
     * @param step {object} - step to perform
     * @param context {object} - context of the action
     * @param process {object} - process that is performing the action
     * @param item {object} - item that is performing the action
     *
     * @param step.args.event {string} - event to emit
     * @param [step.args.parameters={}] {object} - parameters to send to the listening component
     * @param [step.args.target] {string} - target to set the result of the emit method.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("events", "emit", {
     *   event: "my-event",
     *   parameters: {
     *     message: "Hello World"
     *   }
     *   target: "my-result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "events",
     *  "action": "emit",
     *  "args": {
     *    "event": "my-event",
     *    "parameters": {
     *      "message": "Hello World"
     *     },
     *    "target": "my-result"
     *   }
     * }
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

        return result;
    }
}

crs.intent.events = EventsActions;