import {RouteManager} from "./managers/router-manager.js";

/**
 * @class RouteActions - manage URL and navigation in application.
 * Note: you need to set your caddy file to redirect all requests to index.html
 * add this to the caddy file (copy and past as is): try_files {path} /index.html
 */
export class RouteActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * @method register - register routes with the router using a definition.
     * This will create a new instance of route manager and register the routes.
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     *
     * @parma step.args.definition {object} - definition object
     * @returns {Promise<void>}
     *
     * @example <caption>Javascript</caption>
     * await crs.call("route", "register", {
     *     definition: {
     *         routes: []
     *         ... see definition
     *     }
     * }});
     *
     * @example <caption>JSON</caption>
     * {
     *     "type": "route",
     *     "action": "register",
     *     "args": {
     *          "definition": {
     *          "routes": []
     *          ... see definition
     *     }
     * }
     */
    static async register(step, context, process, item) {
        const definition = await crs.process.getValue(step.args.definition, context, process, item);
        const routes = await crs.process.getValue(step.args.routes, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);
        globalThis.routeManager = new RouteManager(routes, definition, callback);
    }

    /**
     * @method dispose - dispose of the routes and remove them from the router.
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     * @returns {Promise<void>}
     *
     * @example <caption>Javascript</caption>
     * await crs.call("route", "dispose", {}});
     *
     * @example <caption>JSON</caption>
     * {
     *    "type": "route",
     *    "action": "dispose"
     *    "args": {}
     * }
     */
    static async dispose(step, context, process, item) {
        globalThis.routeManager?.dispose();
        delete globalThis.routeManager;
    }

    /**
     * @method parse - break down a url into its parts
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     *
     * @param step.args.url {string} - url to parse
     * @returns {Promise<{}>}
     *
     * @example <caption>Javascript</caption>
     * const result = await crs.call("route", "parse", {
     *    url: "https://www.google.com/contoso/en-us/search?q=crs"
     * });
     *
     * returns:
     *
     * {
     *     protocol: "https",
     *     host: "www.google.com",
     *     params: {
     *         0: "contoso",
     *         1: "en-us"
     *         2: "search"
     *     },
     *     query: {
     *         q: "crs"
     *     }
     * }
     *
     * @example <caption>JSON</caption>
     * {
     *   "type": "route",
     *   "action": "parse",
     *   "args": {
     *      "url": "https://www.google.com/connection/en-us/search?q=crs"
     *   }
     * }
     */
    static async parse(step, context, process, item) {
        let url = await crs.process.getValue(step.args.url || globalThis.location.href, context, process, item);

        // 0. ensure a properly define url
        if (url.indexOf("://") === -1) url = `http://${url}`;

        const result = {
            params: {},
            query: {}
        };

        // 1. get query string
        const queries = url.split("?")[1]?.split("&");

        // 2. remove query string from url
        url = url.split("?")[0];

        // 3. process url
        const parts = url.split("/");
        result.protocol = parts[0].replace(":", "");
        result.host = parts[2];

        const parameters = globalThis.routeManager?.definition?.parameters;

        for (let i = 3; i < parts.length; i++) {
            const index = i - 3;
            const key = parameters?.[index] ?? index;
            result.params[key] = parts[i];
        }

        // 4. process query string
        if (queries) {
            for (const query of queries) {
                const key = query.split("=")[0];
                const value = query.split("=")[1];
                result.query[key] = value;
            }
        }

        return result;
    }

    /**
     * @method createUrl - create a url from a route definition
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     *
     * @param step.args.definition {string} - route name
     * @returns {Promise<void>}
     *
     * todo:
     * 1. add url encode on the result string
     */
    static async create_url(step, context, process, item) {
        const definition = await crs.process.getValue(step.args.definition, context, process, item);
        if (definition == null) return;

        const protocol = [definition.protocol || "http", "://"].join("");
        const host = definition.host;

        const parameters = [];
        const query = [];

        if (definition.params) {
            for (const key in definition.params) {
                parameters.push(definition.params[key]);
            }
        }

        if (definition.query) {
            for (const key in definition.query) {
                query.push([`${key}=${definition.query[key]}`]);
            }
        }

        const paramString = parameters.join("/");
        const queryString = query.length === 0 ? "" : `?${query.join("&")}`;

        return `${protocol}${host}/${paramString}${queryString}`;
    }

    /**
     * @method goto - navigate to a route based on a route definition
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     *
     * @param step.args.definition {object} - route definition
     * @returns {Promise<void>}
     *
     * @example <caption>Javascript</caption>
     * await crs.call("route", "goto", {
     *     definition: {
     *         protocol: "https",
     *         host: "www.google.com",
     *         params: {
     *             "connection"  : "connection",
     *             "environment" : "en-us",
     *             "view"        : "search"
     *         },
     *         query: {
     *              "q": "crs",
     *              "id": "1000"
     *         }
     *     }
     * });
     *
     * @example <caption>JSON</caption>
     * {
     *    "type": "route",
     *    "action": "goto",
     *    "args": {
     *        "definition": {
     *        "protocol": "https",
     *        "host": "www.google.com",
     *        "params": {
     *            "connection": "connection",
     *            "environment": "en-us",
     *            "view": "search"
     *        },
     *        "query": {
     *            "q": "crs",
     *            "id": "1000"
     *        },
     *        "tab_id": "edit",
     *        "target": "$context.routeResult"
     *    }
     * }
     *
     * Todo:
     * 1. Add support to provide string instead
     * 2. Add new tab support
     */
    static async goto(step, context, process, item) {
        await globalThis.routeManager?.goto(step.args.definition);
    }

    /**
     * @method refresh - refresh the current route
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     * @returns {Promise<void>}
     *
     * @example <caption>Javascript</caption>
     * await crs.call("route", "refresh");
     *
     * @example <caption>JSON</caption>
     * {
     *   "type": "route",
     *   "action": "refresh"
     *   "args": {}
     * }
     */
    static async refresh(step, context, process, item) {
        await globalThis.routeManager?.refresh();
    }

    /**
     * @method set_parameters - set the parameters for a route definition
     * You must have defined the parameter in the definition you registered
     * Use refresh when you are ready to update the URL again
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     *
     * @param step.args.parameters {object} - route parameters and values to date
     * @returns {Promise<void>}
     *
     * @example <caption>Javascript</caption>
     * await crs.call("route", "set_parameters", {
     *    parameters: {
     *      "connection": "contoso",
     *      "environment": "en-us",
     *      "view": "search"
     *    }
     * });
     *
     * @example <caption>JSON</caption>
     * {
     *     "type": "route",
     *     "action": "set_parameters",
     *     "args": {
     *         "parameters": {
     *             "connection": "contoso",
     *             "environment": "en-us",
     *             "view": "search"
     *         }
     *     }
     * }
     */
    static async set_parameters(step, context, process, item) {
        const parameters = await crs.process.getValue(step.args.parameters, context, process, item);
        if (parameters == null) return;

        const refresh = await crs.process.getValue(step.args.refresh || false, context, process, item);

        globalThis.routeManager.setParameters(parameters);

        if (refresh) {
            await globalThis.routeManager.refresh();
        }
    }

    /**
     * @method set_queries - set the queries for a route definition
     * @param step {object} - step object from the process
     * @param context {object} - context object from the process
     * @param process {object} - process object from the process
     * @param item {object} - item object from the process
     *
     * @param step.args.queries {object} - route queries and values to date
     * @returns {Promise<void>}
     *
     * @example <caption>Javascript</caption>
     * await crs.call("route", "set_queries", {
     *     queries: {
     *          "id": "2000"
     *     },
     *     "tab_id": "edit",
     *     "refresh": true
     * })
     *
     * @example <caption>JSON</caption>
     * {
     *    "type": "route",
     *    "action": "set_queries",
     *    "args": {
     *        "queries": {
     *            "id": "2000"
     *        }
     *    }
     * }
     */
    static async set_queries(step, context, process, item) {
        const queries = await crs.process.getValue(step.args.queries, context, process, item);
        if (queries == null) return;

        const refresh = await crs.process.getValue(step.args.refresh || false, context, process, item);


        globalThis.routeManager?.setQueries(queries);

        if (refresh) {
            await globalThis.routeManager.refresh();
        }

    }
}

crs.intent.route = RouteActions;