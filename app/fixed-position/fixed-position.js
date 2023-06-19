export default class FixedPositionVM extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();

        for (const position of ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]) {
            const element = this.shadowRoot.querySelector(`[data-position="${position}"]`);
            await crs.call("fixed_position", "set", { element: element, position: position, margin: 10});
        }
    }
}