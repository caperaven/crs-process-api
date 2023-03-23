class ListComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(res => res.text());

        requestAnimationFrame(async () => {
            await this.load();
        })
    }

    async load() {
        const ul = this.shadowRoot.querySelector("ul");
        await crs.call("dom_interactive", "enable_dragdrop", {
            element: ul,
            options: {
                drag: {
                    query: ".red",
                    cpIndex: 1
                },
                drop: {
                    allowDrop: async (target, options) => {
                        // drop check, only drop on container
                        if (options.currentAction == "drop") {
                            if (target.tagName === "LI") {
                                return {
                                    target,
                                    position: "before"
                                }
                            }

                            if (target.parentElement && target.parentElement.tagName === "LI") {
                                return {
                                    target: target.parentElement,
                                    position: "before"
                                }
                            }

                            if (target.tagName !== "UL") {
                                return null;
                            }

                            return {
                                target: target,
                                position: "append"
                            }
                        }

                        // move operation allow marker to update on list items also
                        if (target.tagName === "LI" || target.tagName === "UL") {
                            return { target };
                        }
                    }
                }
            }
        })
    }

    async disconnectedCallback() {
        const ul = this.shadowRoot.querySelector("ul");
        await crs.call("dom_interactive", "disable_dragdrop", {
            element: ul
        });
    }
}

customElements.define("list-component", ListComponent);