export class ComponentActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

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