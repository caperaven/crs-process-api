const BASE_REQUEST = {
    cache: "default",
    mode: "cors",
    credentials: 'same-origin',
    referrerPolicy: 'no-referrer',
    redirect: 'follow',
    headers: {
        'Content-Type': 'application/json'
    }
}

export class RestServicesActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async get(step, context, process, item) {
        let request = await crs.process.getValue(step.args.request, context, process, item);
        const url = await crs.process.getValue(step.args.url, context, process, item);

        request = request || Object.assign({
            method: "GET"
        }, BASE_REQUEST)

        const result = await fetch(url, request).then(result => result.json());
        return setTarget(step, result, context, process, item);
    }

    static async post(step, context, process, item) {
        const url = await crs.process.getValue(step.args.url, context, process, item);
        const body = await crs.process.getValue(step.args.body);
        let request = await crs.process.getValue(step.args.request, context, process, item);

        request = request || Object.assign({
            body: body,
            method: "POST"
        }, BASE_REQUEST);

        const result = await fetch(url, request).then(result => result.json())
        return setTarget(step, result, context, process, item);
    }

    static async put(step, context, process, item) {
        const url = await crs.process.getValue(step.args.url, context, process, item);
        const body = await crs.process.getValue(step.args.body);
        let request = await crs.process.getValue(step.args.request, context, process, item);

        request = request || Object.assign({
            body: body,
            method: "PUT"
        }, BASE_REQUEST);

        const result = await fetch(url, request).then(result => result.json())
        return setTarget(step, result, context, process, item);
    }

    static async patch(step, context, process, item) {
        const body = await crs.process.getValue(step.args.body);
        let request = await crs.process.getValue(step.args.request);

        request = request || Object.assign({
            body: body,
            method: "PATCH"
        }, BASE_REQUEST);

        const result = await fetch(step.args.url, request).then(result => result.json());
        return setTarget(step, result, context, process, item);
    }

    static async delete(step, context, process, item) {
        let request = await crs.process.getValue(step.args.request);

        request = request || Object.assign({
            method: "DELETE"
        }, BASE_REQUEST);

        const result = await fetch(step.args.url, request).then(result => result.json());
        return setTarget(step, result, context, process, item);
    }
}

async function setTarget(step, result, context, process, item) {
    if (step.args.target != null) {
        await crs.process.setValue(step.args.target, result, context, process, item);
    }

    return result;
}

crs.intent.rest_services = RestServicesActions;