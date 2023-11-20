/**
 * @class ComponentActions - Helper functions for working with custom components
 *
 * Features:
 *  -perform - The entry point for the class.  This is called by the process engine.
 *  -observe - Used in components, observe properties and when all the properties have values, perform the callback.
 *  -unobserve - Used in components, unobserve properties.
 *  -notify_ready - Used in components, notify the process engine that the component is ready.
 *  -on_ready - Used in components, when the component is ready, perform the callback.
 *
 * Note:
 * -meant for javascript use only.
 *
 * -"Observe properties on a component and when all the properties have values, perform the callback."
 *
 * -The first method, `perform`, is a static method that is called by the process engine.  It is the entry point for the
 *  class.  The process engine will pass in the step, context, process, and item.  The step is the step that is being
 *  executed.  The context is the context of the process.  The process is the process that is being executed.  The item is
 *  the item that is being processed
 */
export class ComponentActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method observe -  Used in components, observe properties and when all the properties have values, perform the callback.
     * @returns {Promise<*|number>}
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being run.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The element that is being observed.
     * @param step.args.properties {[String]} - The properties that are being observed.
     * @param step.args.callback {String} - The callback that is being executed when all the properties have values.
     *
     * @returns {Promise<*>} - The id of the observation.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("component", "observe", {
     *     element: "my-element",
     *     properties: ["value1", "value2"],
     *     callback: "myCallback"
     *     };
     * }
     *
     * @example <caption>json</caption>
     *    {
     *     "type": "component",
     *     "action": "observe",
     *     "args": {
     *        "element": "my-element",
     *        "properties": ["value1", "value2"],
     *        "callback": "myCallback"
     *    }
     */
    static async observe(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const properties = await crs.process.getValue(step.args.properties, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);

        if (element._dataId == null) {
            element._dataId = crsbinding.data.addObject(element.id);
        }

        let dataId = element._dataId;

        element._processObserver = element._processObserver || {
            nextId: 0
        };

        const id = getNextId(element);
        element._processObserver[id] = {
            properties: properties,
            eval: createPropertiesEvaluation(element, properties, id),
            callback: callback
        }

        for (let property of properties) {
            crsbinding.data.addCallback(dataId, property, element._processObserver[id].eval);
        }

        return id;
    }


    /**
     * @method unobserve - Disable previously created observation of properties on a component
     * It removes a callback from the element's data object
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process that is running.
     * @param item {Object} - The current item being processed.
     *
     * @param step.args.element {String} - The element that is being observed.
     * @param step.args.ids {String} - The ids of the observations to remove.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("component", "unobserve", {
     *    element: "my-element",
     *    ids: [1, 2]
     *    };
     *
     * @example <caption>json</caption>
     * {
     *     "type": "component",
     *     "action": "unobserve",
     *     "args": {
     *     "element": "my-element",
     *     "ids": [1, 2]
     *     }
     * }
     */
    static async unobserve(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const ids = await crs.process.getValue(step.args.ids, context, process, item);

        for (const id of ids) {
            const def = element._processObserver[id];
            for (const property of def.properties) {
                crsbinding.data.removeCallback(element._dataId, property, def.eval);
            }
            def.properties = null;
            def.eval = null;
            def.callback = null;
            delete element._processObserver[id];
        }
    }


    /**
     * @method notify_ready - It sets the `ready` attribute on the element specified in the `element` argument, and then dispatches a `ready`
     * event on the element
     *
     * Notify that the component is ready for interacting with
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is running the script.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The element that is being observed.
     *
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("component", "notify_ready", {
     *    element: "my-element"
     *    };
     *
     * @example <caption>json</caption>
     *    {
     *       "type": "component",
     *       "action": "notify_ready",
     *       "args": {
     *        "element": "my-element"
     *       }
     *    }
     */
    static async notify_ready(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.dataset.ready = "true";
        delete element.dataset.loading;
        element.dispatchEvent(new CustomEvent("ready", {bubbles: true, composed: true}));
    }

    /**
     * @method notify_loading - Notify that the component is loading
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is running the script.
     * @param item {Object} - The item that is being processed.
     * @returns {Promise<void>}
     *
     * @example <caption>javascript</caption>
     * await crs.call("component", "notify_loading", {
     *    element: "my-element"
     *    };
     *
     * @example <caption>json</caption>
     *    {
     *       "type": "component",
     *       "action": "notify_loading",
     *       "args": {
     *        "element": "my-element"
     *       }
     *    }
     */
    static async notify_loading(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.dataset.loading = "true";
        element.dispatchEvent(new CustomEvent("loading", {bubbles: true, composed: true}));
    }


    /**
     * @method on_ready - Get notified when the component is ready
     * It waits for an element to be ready, then calls a callback function
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the process.
     * @param process {Object} - The process that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The element that is being observed.
     * @param step.args.callback {String} - The callback function to execute when the element is ready.
     * @param step.args.caller {String} - The caller of the callback function.
     *
     * @returns The return value of the callback function.
     *
     * @example <caption>javascript</caption>
     * await crs.call("component", "on_ready", {
     *   element: "my-element",
     *   callback: function,
     *   caller: this
     *   };
     *
     * @example <caption>json</caption>
     * {
     *     "type": "component",
     *     "action": "on_ready",
     *     "args": {
     *      "element": "my-element",
     *      "callback": "$context.callback"
     *      "caller": "$context"
     *     }
     * }
     */
    static async on_ready(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);
        const caller = await crs.process.getValue(step.args.caller, context, process, item);

        if (element.dataset.ready == "true") {
            return await callback.call(caller);
        }

        const fn = async () => {
            element.removeEventListener("ready", fn);
            await callback.call(caller);
        }

        element.addEventListener("ready", fn);
    }

    /**
     * @method on_loading - Get notified when the component is loading
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the process.
     * @param process {Object} - The process that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The element that is being observed.
     * @param step.args.callback {String} - The callback function to execute when the element is ready.
     * @param step.args.caller {String} - The caller of the callback function.
     *
     * @returns The return value of the callback function.
     *
     * @example <caption>javascript</caption>
     * await crs.call("component", "on_loading", {
     *   element: "my-element",
     *   callback: function,
     *   caller: this
     *   };
     *
     * @example <caption>json</caption>
     * {
     *     "type": "component",
     *     "action": "on_loading",
     *     "args": {
     *      "element": "my-element",
     *      "callback": "$context.callback"
     *      "caller": "$context"
     *     }
     * }
     */
    static async on_loading(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);
        const caller = await crs.process.getValue(step.args.caller, context, process, item);

        if (element.dataset.loading == "true") {
            return await callback.call(caller);
        }

        const fn = async () => {
            element.removeEventListener("loading", fn);
            await callback.call(caller);
        }

        element.addEventListener("loading", fn);
    }

    /**
     * @method wait_for_element_render - Wait for an element to be rendered.
     * We wait until the width of the height of the element is greater than 0.
     * @param step {Object} - The step object.
     * @param context {Object} - The context of the process.
     * @param process {Object} - The process that is currently running.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {HTMLElement} - The element that is being observed.
     * @returns {Promise<unknown>}
     */
    static async wait_for_element_render(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
            return true;
        }

        return new Promise(resolve => {
            const observer = new ResizeObserver(() => {
                if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                    observer.disconnect();
                    resolve(true);
                }
            });

            observer.observe(element);
        });
    }
}



/**
 * @function getNextId - It returns a unique ID for each element
 * @param element {*} - The element that the process observer is attached to.
 * @returns The next id in the sequence.
 */
function getNextId(element) {
    const id = element._processObserver.nextId;
    element._processObserver.nextId = id + 1;
    return id;
}

/**
 * @function createPropertiesEvaluation - Create a function that will evaluate the properties of the data object and call the callback function if all the
 * properties are not null
 * @param context {Object} - The context of the function.
 * @param properties {[]} - The list of properties that are being observed.
 * @param id {String|Number} - The id of the observer.
 * @returns A function that will be called when the properties are available.
 */
function createPropertiesEvaluation(context, properties, id) {
    let script = ["if ( "];
    for (const property of properties) {
        script.push(`crsbinding.data.getProperty(this._dataId, "${property}")  != null && `)
    }
    script.push(`) { this._processObserver[${id}].callback.call(this) };`)
    script = script.join("").replace("&& )", ")");

    const fn = new Function(script);
    return fn.bind(context);
}

crs.intent.component = ComponentActions;