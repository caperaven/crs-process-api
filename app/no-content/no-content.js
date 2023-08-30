export default class NoContentModel extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async load() {
        globalThis.translations ||= {}

        globalThis.translations.noContent = {
            title: "No Records Found",
            message: "Either you do not have sufficient user rights required to display the records or there are no records to be displayed."
        }

        const div = this.shadowRoot.querySelector("div");
        await crs.call("no_content", "show", { parent: div })
    }

    async remove() {
        const div = this.shadowRoot.querySelector("div");
        await crs.call("no_content", "hide", { parent: div })
    }
}