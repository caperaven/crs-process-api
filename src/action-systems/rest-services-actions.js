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

/**
 * @class RestServicesActions - A collection of actions that can be used to perform REST calls.
 * @description This class contains functions that make requests to a REST API
 *
 * Features:
 * perform - The main function that is called to perform the action.
 * get - Performs a GET request to the specified URL.
 * post - Performs a POST request to the specified URL.
 * put - Performs a PUT request to the specified URL.
 * delete - Performs a DELETE request to the specified URL.
 * patch - Performs a PATCH request to the specified URL.
 */
export class RestServicesActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method Perform a GET request to the specified URL.
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The current process
     * @param item - The current item being processed.
     *
     * @param step.args.request {object} - The request object to use for the request.
     * @param step.args.url {string} - The URL to perform the GET request on.
     * @param step.args.target {string} - The target to set the result to.
     *
     * @returns The result of the fetch call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("rest_services", "get", {
     *     url: "https://jsonplaceholder.typicode.com/todos/1"
     *     request: {requests}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "rest_services",
     *      "action": "get",
     *      "args": {
     *           "url": "https://jsonplaceholder.typicode.com/todos/1",
     *           "request": {requests}
     *           "target": "$context.result"
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
     * @method Make a POST request to the given URL with the given body and request options, and set the result to the
     * given target
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The current process
     * @param item - the current item being processed
     *
     * @param step.args.url {string} - The URL to perform the POST request on.
     * @param step.args.body {object} - The body to send with the request.
     * @param step.args.request {object} - The request object to use for the request.
     * @param step.args.target {string} - The target to set the result to.
     *
     * @returns The result of the fetch call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("rest_services", "post", {
     *    url: "https://jsonplaceholder.typicode.com/todos",
     *    body: {body},
     *    request: {requests}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *      "type": "rest_services",
     *      "action": "post",
     *      "args": {
     *             "url": "https://jsonplaceholder.typicode.com/todos",
     *             "body": {body},
     *             "request": {requests}
     *             "target": "$context.result"
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
     * @method This function takes a step, context, process, and item, and returns a promise that resolves to the result
     * of a PUT request to the url specified in the step's args
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The current process
     * @param item - The current item being processed.
     *
     * @param step.args.url {string} - The URL to perform the PUT request on.
     * @param step.args.body {object} - The body to send with the request.
     * @param step.args.request {object} - The request object to use for the request.
     * @param step.args.target {string} - The target to set the result to.
     *
     * @returns The result of the fetch call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("rest_services", "put", {
     *     url: "https://jsonplaceholder.typicode.com/todos/1",
     *     body: {body},
     *     request: {requests}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     *  {
     *        "type": "rest_services",
     *        "action": "put",
     *        "args": {
     *            "url": "https://jsonplaceholder.typicode.com/todos/1",
     *            "body": {body},
     *            "request": {requests}
     *            "target": "$context.result"
     *       }
     * }
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

    /**
     * @method This function takes the body, request, and url from the step,
     * and then makes a PATCH request to the url with the body and request
     * @param step - The step object from the process definition.
     * @param context - The context object that is passed to the process.
     * @param process - The current process object
     * @param item - The current item being processed.
     *
     * @param step.args.url {string} - The URL to perform the PATCH request on.
     * @param step.args.body {object} - The body to send with the request.
     * @param step.args.request {object} - The request object to use for the request.
     *
     * @returns The result of the fetch call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("rest_services", "patch", {
     *     url: "https://jsonplaceholder.typicode.com/todos/1",
     *     body: {
     *          "name": "testing",
     *     },
     *     request: {requests}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "rest_services",
     *     "action": "patch",
     *     "args": {
     *          "url": "https://jsonplaceholder.typicode.com/todos/1",
     *          "body": {
     *              "name": "testing",
     *          },
     *          "request": {requests}
     *     }
     * }
     */
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

    /**
     * @method This function makes a DELETE request to the specified URL, and then sets the result to the specified target
     * @param step - The step object from the process definition.
     * @param context - The context of the current process.
     * @param process - The current process object
     * @param item - The current item being processed.
     *
     * @param step.args.url {string} - The URL to perform the DELETE request on.
     * @param step.args.request {object} - The request object to use for the request.
     *
     * @returns The result of the fetch call.
     *
     * @example <caption>javascript example</caption>
     * const result = await crs.call("rest_services", "delete", {
     *     url: "https://jsonplaceholder.typicode.com/todos/1",
     *     request: {requests}
     * }, context, process, item);
     *
     * @example <caption>json example</caption>
     * {
     *     "type": "rest_services",
     *     "action": "delete",
     *     "args": {
     *         "url": "https://jsonplaceholder.typicode.com/todos/1",
     *         "request": {requests}
     *     }
     * }
     */
    static async delete(step, context, process, item) {
        let request = await crs.process.getValue(step.args.request);

        request = request || Object.assign({
            method: "DELETE"
        }, BASE_REQUEST);

        const result = await fetch(step.args.url, request).then(result => result.json());
        return setTarget(step, result, context, process, item);
    }
}

/**
 * @method Set the value of the target variable to the result of the function
 * @param step - The step object
 * @param result - The result of the previous step.
 * @param context - The context object that is passed to the process.
 * @param process - The process object
 * @param item - The item that is being processed.
 *
 * @param step.args.target - The target to set the result to.
 *
 * @returns The result of the function.
 */
async function setTarget(step, result, context, process, item) {
    if (step.args.target != null) {
        await crs.process.setValue(step.args.target, result, context, process, item);
    }

    return result;
}

crs.intent.rest_services = RestServicesActions;