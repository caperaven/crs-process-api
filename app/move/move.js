import "./../test-components/test-component.js";
export default class Move extends crsbinding.classes.BindableElement {
    #toolbarElement;
    #blockElement;
    #componentElement;

    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.#blockElement = this.shadowRoot.querySelector("#block");
        await crs.call("dom_interactive", "enable_move", {
            element: this.#blockElement
        })

        this.#toolbarElement = this.shadowRoot.querySelector("#toolbar");
        await crs.call("dom_interactive", "enable_move", {
            element: this.#toolbarElement,
            move_query: '[data-move="true"]',
        });

        this.#componentElement = this.shadowRoot.querySelector("#shadowComponent");
        await crs.call("dom_interactive", "enable_move", {
            element: this.#componentElement,
            move_query: "header"
        });
    }

    async disconnectedCallback() {
        await crs.call("dom_interactive", "disable_move", { element: this.#blockElement });
        await crs.call("dom_interactive", "disable_move", { element: this.#toolbarElement });
        await crs.call("dom_interactive", "disable_move", { element: this.#componentElement });
    }
}