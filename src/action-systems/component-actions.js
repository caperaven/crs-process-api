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
            nextId: 0,
            eval: createPropertiesEvaluation(element, properties),
            callback: callback
        };

        for (let property of properties) {
            crsbinding.data.addCallback(dataId, property, element._processObserver.eval);
        }

    }

    static async unobserve(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
    }
}

function createPropertiesEvaluation(context, properties) {
    let script = ["if ( "];
    for (const property of properties) {
        script.push(`crsbinding.data.getProperty(this._dataId, "${property}")  != null && `)
    }
    script.push(") { this._processObserver.callback.call(this) };")
    script = script.join("").replace("&& )", ")");

    const fn = new Function(script);
    return fn.bind(context);
}