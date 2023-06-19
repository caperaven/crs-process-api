import "/packages/crs-schema/crs-schema.js"

export default class Schema extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
        const json = await fetch(import.meta.url.replace(".js", ".json")).then(result => result.json());

        this.target.innerHTML = await crs.call("schema", "parse", {
            id: "html",
            schema: json
        });

        this.target2.innerHTML = await crs.call("schema", "parse", {
            id: "html",
            schema: json
        });

        await crsbinding.parsers.parseElements(this.target.children, this._dataId);
        await crsbinding.parsers.parseElements(this.target2.children, this._dataId);
    }

    async greeting() {
        console.log("Hello World");
    }
}