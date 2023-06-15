import "./../../src/action-systems/route-actions.js";

class ViewLoader extends HTMLElement {
    #rootFolder;
    #callbackHandler = this.#callback.bind(this);

    async connectedCallback() {
        const routesPath = this.dataset.routes;
        const json = await fetch(routesPath).then(response => response.json());

        this.#rootFolder = json.root || "app";
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
        console.log(args);
    }
}

customElements.define('view-loader', ViewLoader);