/**
 * @class NoContent - A component that displays a message when there is no content to display.
 * This is only used through the process api.
 * See no-content-actions.js for more information.
 */

class NoContent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.style.display = "none";
        const title = globalThis.translations.noContent.title;
        const message = globalThis.translations.noContent.message;

        const linkHTML = `<link rel="stylesheet" href="${import.meta.url.replace(".js", ".css")}">`;
        const html = await fetch(import.meta.url.replace(".js", ".html")).then(response => response.text());
        this.shadowRoot.innerHTML = `${linkHTML}${html.replace("__title__", title).replace("__message__", message)}`;

        await this.load();
    }

    async load() {
        requestAnimationFrame(() => {
            this.style.display = "block";
            crs.call("component", "notify_ready", {element: this})
        })
    }
}

customElements.define("no-content", NoContent);