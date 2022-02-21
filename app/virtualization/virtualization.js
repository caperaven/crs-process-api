import "./../../src/action-systems/css-grid-actions.js";

export default class Virtualization extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        console.log("view connected");
        await super.connectedCallback();

        const data = await this._createData(10000);
        this.rowTemplate = document.querySelector("#list-item");
        crsbinding.inflationManager.register("list-item", this.rowTemplate);

        requestAnimationFrame(() => {
            this.element = document.querySelector("#list");
            this.element.data = data;
            crs.call("cssgrid", "init",         {element: this.element});
            crs.call("cssgrid", "set_columns",  {element: this.element, columns: "1fr"});
            crs.call("cssgrid", "set_rows",     {element: this.element, rows: `repeat(${data.length}, 2rem)`});
            crs.call("cssgrid", "render_initial_rows", {element: this.element, template: "list-item", limit: 300, rowHeight: 32})
        })
    }

    async disconnectedCallback() {
        this.element = null;
        super.disconnectedCallback();
    }

    async _createData(records) {
        let data = [];
        for (let i = 0; i < records; i++) {
            data.push({id: i, item: `Record number: ${await crs.intent.random.integer({args: {min: 0, max: 10000}})}`
        });
        }
        return data;
    }
}