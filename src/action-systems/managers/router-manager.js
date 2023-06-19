// # Router requirements
//
// ## General requirements
// 1. Can handle # of routes
// 2. Validate if a route is valid and if not show 404 page
// 3. Can handle route parameters
// 4. Can handle query parameters
// 5. Can handle route guards
// 6. Can handle route redirects
// 7. Can handle route aliases
// 8. Can handle route children
//
// ## Dealing with views
//     1. Load view model component
// 2. Before changing route check if you can leave the current route
//
// ## Load static html files or views with js
// process api
// decode url -> define
// encode def -> url string
// goto def
// add parameter (def , param, value)
// remove parameter (def, param )
// set (def, parmaeter, value)
// def
//
//
//
// https://onkeydev.pragmaproducts.com/contoso/daily/#dashboard/WorkRequest/?&remote=WorkRequest&action=GetWorkRequestCollection&id=5000000003
//
// {
//     parameters: {
//         0: connection
//         1: environment
//         2: view,
//             3: entity
//         4: id
//     }
// }
//
//
// .../contoso/daily/dashboard/workorder?profile=1001&code="like"
//
//     url_parts: {
//     parameters: {
//         connection: "contoso",
//             environment: "daily"
//     ...
//     }
//     queries: {
//         profile: 1001
//     }
// }
//
// {
//     connection: "contoso"
//     environment: "daily",
//         view: "dahsboard"
// }

export class RouteManager {
    #routes;

    /**
     * @field #definition - this defines how to interpret the url
     */
    #definition;

    /**
     * @field #callback - this is the callback that will be called when the route changes
     */
    #callback;

    /**
     * @field #routeDefinition - this defines the current route
     */
    #routeDefinition;

    #updatingRoute = false;

    #onpopstateChangedHandler = this.#onpopstate.bind(this);
    #defaultView;

    get definition() {
        return this.#definition;
    }

    get routeDefinition() {
        return Object.freeze(this.#routeDefinition);
    }

    constructor(routes, definition, defaultView, callback) {
        this.#routes = routes;
        this.#definition = definition;
        this.#callback = callback;
        this.#defaultView = defaultView;

        this.goto(window.location.href).then(() => {
            addEventListener("popstate", this.#onpopstateChangedHandler);
        })
    }

    dispose() {
        removeEventListener("popstate", this.#onpopstateChangedHandler);

        this.#routes = null;
        this.#definition = null;
        this.#callback = null;
        this.#routeDefinition = null;
        this.#onpopstateChangedHandler = null;
        this.#updatingRoute = null;
        this.#defaultView = null;
    }

    async #onpopstate(event) {
        event.preventDefault();
        this.#routeDefinition = await crs.call("route", "parse", { url: window.location.href })
        await this.#callback?.(this.#routeDefinition);
    }

    async goto(routeDefinition) {
        if (typeof routeDefinition === "string") {
            routeDefinition = await crs.call("route", "parse", { url: routeDefinition })
        }

        this.#routeDefinition = routeDefinition;
        if (this.#routeDefinition.params.view == null || this.#routeDefinition.params.view === "") {
            this.#routeDefinition.params.view = this.#defaultView;
        }

        const route = this.#routes.find(route => route.view === this.#routeDefinition.params.view);

        if (route == null) {
            // todo redirect to 404
            console.error("Route not found");
            return;
        }

        const url = await crs.call("route", "create_url", { definition: this.#routeDefinition });
        history.pushState(null, null, url);

        await this.#callback?.(this.#routeDefinition, route.title);
    }

    async refresh() {
        return new Promise(async resolve => {
            await this.#callback?.(this.#routeDefinition);
            resolve();
        })
    }

    setParameters(parameters) {
        if (this.#routeDefinition == null) return;

        for (const key of Object.keys(parameters)) {
            this.#routeDefinition.params[key] = parameters[key];
        }
    }

    setQueries(queries) {
        if (this.#routeDefinition == null) return;

        for (const key of Object.keys(queries)) {
            this.#routeDefinition.query[key] = queries[key];
        }
    }
}