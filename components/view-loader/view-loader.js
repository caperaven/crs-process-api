import "./../../src/action-systems/route-actions.js";

class ViewLoader extends HTMLElement {
    #rootFolder;
    #callbackHandler = this.#callback.bind(this);
    #currentView = "";
    #defaultView = "";
    #viewModel;

    async connectedCallback() {
        const routesPath = this.dataset.routes;
        const json = await fetch(routesPath).then(response => response.json());

        this.#rootFolder = json.root || "app";
        this.#defaultView = json.default;

        await crs.call("route", "register", {
            routes: json.routes,
            definition: json.definition,
            callback: this.#callbackHandler
        });
    }

    async disconnectedCallback() {
        await crs.call("route", "unregister", {});

        this.#rootFolder = null;
        this.#callbackHandler = null;
    }

    async #callback(args) {
        let view = args.params.view;
        if (view === "") {
            view = this.#defaultView;
        }

        if (view !== this.#currentView) {
            this.#viewModel?.remove();
            this.#currentView = view;
            this.#viewModel = await loadViewModel(this.#rootFolder, this.#currentView);
            this.appendChild(this.#viewModel);
        }
        else {
            this.#viewModel.routeChanged?.(args);
        }
    }
}

async function loadViewModel(rootFolder, view) {
    const file = `/${rootFolder}/${view}/${view}.js`;
    const module = await import(file);
    const componentName = `${view}-view`;

    if (customElements.get(componentName) == null) {
        customElements.define(componentName, module.default);
    }

    return document.createElement(componentName);
}

customElements.define('view-loader', ViewLoader);