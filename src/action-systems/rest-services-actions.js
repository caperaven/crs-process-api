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

    /**
     * > Perform a GET request to the specified URL.
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The current process
     * @param item - The current item being processed.
     *
     * @param step.args.request - The request object to use for the request.
     * @param step.args.url - The URL to perform the GET request on.
     *
     * @returns The result of the fetch call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("rest-services", "get", {
     *     url: "https://jsonplaceholder.typicode.com/todos/1"
     *     request: {requests}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "rest-services",
     *      "action": "get",
     *      "args": {
     *           "url": "https://jsonplaceholder.typicode.com/todos/1",
     *           "request": {requests}
     *      }
     * }
     */
    static async get(step, context, process, item) {
        let request = await crs.process.getValue(step.args.request, context, process, item);
        const url = await crs.process.getValue(step.args.url, context, process, item);

        request = request || Object.assign({
            method: "GET"
        }, BASE_REQUEST)

        const result = await fetch(url, request).then(result => result.json());
        return setTarget(step, result, context, process, item);
    }

    /**
     * > Make a POST request to the given URL with the given body
     * and request options, and set the result to the given target
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The current process
     * @param item - the current item being processed
     *
     * @param step.args.url - The URL to perform the POST request on.
     * @param step.args.body - The body to send with the request.
     * @param step.args.request - The request object to use for the request.
     *
     * @returns The result of the fetch call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("rest-services", "post", {
     *    url: "https://jsonplaceholder.typicode.com/todos",
     *    body: {body},
     *    request: {requests}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "rest-services",
     *      "action": "post",
     *      "args": {
     *             "url": "https://jsonplaceholder.typicode.com/todos",
     *             "body": {body},
     *             "request": {requests}
     *       }
     * }
     */
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

    /**
     * > This function takes a step, context, process, and item,
     * and returns a promise that resolves to the result of a PUT
     * request to the url specified in the step's args
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The current process
     * @param item - The current item being processed.
     * @returns The result of the fetch call.
     */
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