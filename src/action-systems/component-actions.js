/**
 * Helper functions for working with custom components
 */

export class ComponentActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * Used in components, observe properties and when all the properties have values, perform the callback.
     * @returns {Promise<*|number>}
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
     * Disable previously created observation of properties on a component
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
     * Notify that the component is ready for interacting with
     */
    static async notify_ready(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.dataset.ready = "true";
        element.dispatchEvent(new CustomEvent("ready", {bubbles:false}));
    }

    /**
     * Get notified when the component is ready
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
}

function getNextId(element) {
    const id = element._processObserver.nextId;
    element._processObserver.nextId = id + 1;
    return id;
}

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