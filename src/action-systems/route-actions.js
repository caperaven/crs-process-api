import {RouteManager} from "./managers/router-manager.js";

/**
 * @class RouteActions - manage URL and navigation in application
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
        globalThis.routeManager = new RouteManager(definition);
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
        let url = await crs.process.getValue(step.args.url || window.location.href, context, process, item);

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
}

crs.intent.route = RouteActions;