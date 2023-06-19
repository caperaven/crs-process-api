export default class Styles extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
    }

    async disconnectedCallback() {
        await crs.call("styles", "unload_file", { id: "my-styles" });
        await super.disconnectedCallback();
    }

    async loadStyle() {
        const file = import.meta.url.replace(".js", ".css");
        await crs.call("styles", "load_file", { id: "my-styles", file });
    }

    async unloadStyle() {
        await crs.call("styles", "unload_file", { id: "my-styles"});
    }
}