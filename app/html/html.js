export default class Html extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
    }

    async create() {
        const number = this.amount.value ?? 1;
        for (let l=0; l< number;l++) {
            const content = await crs.call("html", "create",
                {
                    html: "<div><span>${test}</span>&nbsp;<span>${test2}</span></div>",
                    ctx: {test: "Hello", test2: "World!"}
                });
            this.element.appendChild(content);
        }
    }
}