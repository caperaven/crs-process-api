import "./../../src/action-systems/route-actions.js";

class ViewLoader extends HTMLElement {
    #rootFolder;
    #callbackHandler = this.#callback.bind(this);
    #clickHandler = this.#click.bind(this);
    #currentView = "";
    #defaultView = "";
    #viewModel;

    async connectedCallback() {
        document.querySelector("nav").addEventListener("click", this.#clickHandler);

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
        document.querySelector("nav").removeEventListener("click", this.#clickHandler);
        await crs.call("route", "unregister", {});

        this.#rootFolder = null;
        this.#callbackHandler = null;
        this.#clickHandler = null;
        this.#currentView = null;
        this.#defaultView = null;
        this.#viewModel = null;
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

    async #click(event) {
        const target = event.composedPath()[0].closest('a');
        if (target && target.href.startsWith(globalThis.location.origin)) {
            event.preventDefault();
            await crs.call("route", "goto", { definition: target.href })
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