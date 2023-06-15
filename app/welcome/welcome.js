export default class Welcome extends HTMLElement {
    async connectedCallback() {
        await super.connectedCallback();
        await this.buildItems();
    }

    async buildItems() {
        for (const module of Object.keys(crs.modules.registry)) {
            await crs.modules.get(module);
        }

        const fragment = document.createDocumentFragment();

        for (const system of Object.keys(crs.intent)) {
            const cls = crs.intent[system];
            for (const action of Object.getOwnPropertyNames(cls)) {
                if (typeof cls[action] == "function") {
                    const li = await crs.call("dom", "create_element", {
                        parent: fragment,
                        tag_name: "li",
                        dataset: {
                            tags: `${system} ${action}`
                        },
                        children: [
                            {
                                tag_name: "div",
                                text_content: system
                            },
                            {
                                tag_name: "div",
                                text_content: action
                            }
                        ]
                    })
                }
            }
        }

        this._element.querySelector("ul").appendChild(fragment);
    }

    async filter(event) {
        await crs.call("dom_collection", "filter_children", {
            element: this.collection,
            filter: event.target.value
        })
    }
}