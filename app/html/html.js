export default class Html extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        this.html.value = "<div><span>${test}</span>&nbsp;<span>${test2}</span></div>";
        this.context.value = `{"test": "Hello", "test2": "World!"}`;
    }

    async create() {

        const contextObj = JSON.parse(this.context.value);

        const number = this.amount.value ?? 1;
        const fragment = document.createDocumentFragment();
        for (let l=0; l< number;l++) {
            const content = await crs.call("html", "create",
                {
                    html: this.html.value,
                    ctx: contextObj
                });
            fragment.appendChild(content);
        }
        this.container.appendChild(fragment);
    }
}