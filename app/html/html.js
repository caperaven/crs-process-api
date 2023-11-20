export default class Html extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.htmlText.value = "<div><span>${test}</span>&nbsp;<span>${test2}</span></div>";
        this.contextText.value = `{"test": "Hello", "test2": "World!"}`;
    }

    async create() {

        const contextObj = JSON.parse(this.contextText.value);

        const number = this.amount.value ?? 1;
        const fragment = document.createDocumentFragment();
        for (let l=0; l< number;l++) {
            const content = await crs.call("html", "create",
                {
                    html: this.htmlText.value,
                    ctx: contextObj
                });
            fragment.appendChild(content);
        }
        this.container.appendChild(fragment);
    }
}