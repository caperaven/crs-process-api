/** @class - DebugActions - It provides usefull actions to assist in debugging system performance and stability
 * Features:
 * - start_monitor_events - Starts monitoring events on the page.
 * - stop_monitor_events - Stops monitoring events on the page.
 * */

export class DebugActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method start_monitor_events - This function starts monitoring events on the page.
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.log = {Boolean} - If true, the events will be logged to the console when they get added.
     * @param step.args.tag_name = {String} - If provided will only log events for provide element tag name
     * @param step.args.event_name = {String} - If provided will only log events for provide event name
     *
     * @example <caption>javascript</caption>
     * await crs.call("debug", "start_monitor_events", {});
     *
     * @example <caption>json</caption>
     * {
     *   type: "debug",
     *   action: "start_monitor_events",
     *   args: {}
     * }
     *
     * @returns {undefined}
     */
    static async start_monitor_events(step, context, process, item) {
        const log = await crs.process.getValue(step.args.log, context, process, item);
        const tagName = await crs.process.getValue((step.args.tag_name || "").toUpperCase(), context, process, item);
        const eventName = await crs.process.getValue(step.args.event_name, context, process, item);
        globalThis.__monitoredEvents = {
            events: [],
            addedCount: 0,
            removedCount: 0
        };
        EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener) {
            this.addEventListenerBase(type, listener);

            if(tagName && this.tagName !== tagName) return;

            if(eventName && type !== eventName) return;

            const trace = new Error().stack.split("\n");

            if (log === true) {
                console.log("Event added: ", {target: this, type, listener,trace });
            }

            globalThis.__monitoredEvents.addedCount++;
            globalThis.__monitoredEvents.events.push({target: this, type: type, listener: listener, trace: trace, path: build_element_path(this)});
        };

        EventTarget.prototype.removeEventListenerBase = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.removeEventListener = function (type, listener) {
            this.removeEventListenerBase(type, listener);

            if(tagName && this.tagName !== tagName) return;

            if(eventName && type !== eventName) return;

            const trace = new Error().stack.split("\n");

            if (log === true) {
                console.log("Event removed: ", {target: this, type, listener, trace});
            }
            globalThis.__monitoredEvents.removedCount++;
            globalThis.__monitoredEvents.events = globalThis.__monitoredEvents.events.filter(e => e.target !== this || e.type !== type || e.listener !== listener);
        }

        console.log("Started monitoring events.")
    }

    /**
     * @method stop_monitor_events - This function stops monitoring events on the page and restores the default event listeners functions. It will also log the events in a table to the console.
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @example <caption>javascript</caption>
     * await crs.call("debug", "stop_monitor_events", {});
     *
     * @example <caption>json</caption>
     * {
     *    type: "debug",
     *    action: "stop_monitor_events",
     *    args: {}
     * }
     */
    static async stop_monitor_events(step, context, process, item) {
        if(globalThis.__monitoredEvents === undefined) {
            console.warn("No events are being monitored.");
            return;
        }
        EventTarget.prototype.addEventListener = EventTarget.prototype.addEventListenerBase;
        EventTarget.prototype.removeEventListener = EventTarget.prototype.removeEventListenerBase;
        delete EventTarget.prototype.addEventListenerBase;
        delete EventTarget.prototype.removeEventListenerBase;

        if (globalThis.__monitoredEvents.addedCount > globalThis.__monitoredEvents.removedCount) {
            console.warn(`The number of added events does not match the number of removed events. This may indicate a memory leak. Added: ${globalThis.__monitoredEvents.addedCount}, Removed: ${globalThis.__monitoredEvents.removedCount}`);
        }
        else {
            console.log(`No event leaks found`);
        }
        const result = globalThis.__monitoredEvents.events.map(e => {
            return {
                target: [e.target.tagName, e.target.id || ""].join("#"),
                type: e.type,
                path: e.path,
                trace: e.trace
            }
        })
        console.table(globalThis.__monitoredEvents.events);
        globalThis.__monitoredEvents = null;
        delete globalThis.__monitoredEvents;
        return result;

    }
}

/**
 * This function returns the path to an element in the DOM tree.
 * @param element {HTMLElement} - The element to get the path for.
 * @returns {string} - The path to the element.
 */
function build_element_path(element) {
    if(element instanceof HTMLElement === false) return "";
    let path = "";
    while(element) {
        path = element.tagName + (path ? ">" + path : "");
        element = element.parentElement;
    }
    return path;
}

crs.intent.debug = DebugActions;