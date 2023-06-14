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
    /**
     * @field #definition - this defines how to interpret the url
     */
    #definition;

    /**
     * @field #routeDefinition - this defines the current route
     */
    #routeDefinition;

    #updatingRoute = false;

    get definition() {
        return this.#definition;
    }

    get routeDefinition() {
        return Object.freeze(this.#routeDefinition);
    }

    constructor(definition) {
        this.#definition = definition;
    }

    dispose() {
        this.#definition = null;
    }

    goto(routeDefinition) {
        this.#routeDefinition = routeDefinition;
        return this.refresh();
    }

    refresh() {
        return new Promise(async resolve => {
            const url = await crs.call("route", "create_url", { definition: this.#routeDefinition });

            this.#updatingRoute = true;
            window.location.href = url;

            requestAnimationFrame(() => {
                this.#updatingRoute = false;
                resolve();
            })
        })
    }

    setParameters(parameters) {
        if (this.#routeDefinition == null) return;

        for (const key of Object.keys(parameters)) {
            this.#routeDefinition.params[key] = parameters[key];
        }
    }
}