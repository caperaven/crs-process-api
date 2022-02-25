import "./../../src/action-systems/css-grid-actions.js";

export default class Virtualization extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        const data = await this._createData(100000);

        this.rowTemplate = document.querySelector("#list-item");
        crsbinding.inflationManager.register("list-item", this.rowTemplate);

        requestAnimationFrame(() => {
            this.table = document.querySelector("#list");
            this.table.data = data;
            crs.call("cssgrid", "init",         {element: this.table});
            crs.call("cssgrid", "set_columns",  {element: this.table, columns: "1fr"});
            crs.call("cssgrid", "set_rows",     {element: this.table, rows: `repeat(${data.length}, 2rem)`});
            crs.call("cssgrid", "render_initial_rows", {element: this.table, data: data, template: "list-item", limit: 300, rowHeight: 32, topRowIndex: 1});
        })
    }

    async disconnectedCallback() {
        crs.call("cssgrid", "disable_scroll", {element: this.table});
        this.table = null;
        super.disconnectedCallback();
    }

    async _createData(records) {
        let data = [];
        for (let i = 0; i < records; i++) {
            data.push({id: i + 1, item: `Record number: ${i + 1}`, expanded: 'false'});
        }
        return data;
    }
}