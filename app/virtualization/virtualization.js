import "./../../src/action-systems/css-grid-actions.js";

export default class Virtualization extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        console.log("view connected");
        await super.connectedCallback();
        this._clickHandler = this.click.bind(this);
        this.element.addEventListener("click", this._clickHandler);

        const data = await this._createData(10000);

        //Setting up list 1
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

        //Setting up list 2
        this.dynamicRowTemplate = document.querySelector("#dynamic-list-item");
        crsbinding.inflationManager.register("dynamic-list-item", this.dynamicRowTemplate);

        requestAnimationFrame(() => {
            this.secondTable = document.querySelector("#dynamic-list");
            this.secondTable.inflateRow = (cell, data) => {this.inflateRow(cell, data)};
            this.secondTable.data = data;
            crs.call("cssgrid", "init",         {element: this.secondTable});
            crs.call("cssgrid", "set_columns",  {element: this.secondTable, columns: "1fr"});
            crs.call("cssgrid", "set_rows",     {element: this.secondTable, rows: `repeat(${data.length}, 110px)`});
            crs.call("cssgrid", "render_initial_rows", {element: this.secondTable, data: data, template: "dynamic-list-item", limit: 300, rowHeight: 110, topRowIndex: 1});
        })
    }

    async disconnectedCallback() {
        this.table = null;
        this.element.removeEventListener("click", this._clickHandler);
        this._clickHandler = null;
        super.disconnectedCallback();
    }

    async _createData(records) {
        let data = [];
        for (let i = 0; i < records; i++) {
            data.push({id: i + 1, item: `Record number: ${i + 1}`, expanded: 'true'});
        }
        return data;
    }

    async click(event) {
        const action = event.target.dataset.action;
        if (action == null) return;

        this[action] != null && this[action](event);
    }

    toggle(event) {
        const card = event.target.parentElement.parentElement;
        const expanded = `${!(card.getAttribute('data-expanded') === 'true')}`;
        card.setAttribute("data-expanded", expanded);
        this.secondTable.data[Number.parseInt(card.id) - 1] != null ? this.secondTable.data[Number.parseInt(card.id) - 1].expanded = expanded : null;
    }

    inflateRow(cell, data) {
        cell.id = data.id
        cell.dataset.expanded = data.expanded;
        cell.querySelector("span").textContent = data.id;
    }
}