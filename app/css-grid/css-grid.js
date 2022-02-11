import "./../../src/action-systems/css-grid-actions.js";

export default class CssGrid extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        requestAnimationFrame(() => {
            this.element = document.querySelector("#grid");
            crs.call("cssgrid", "init",         {element: this.element});
            crs.call("cssgrid", "set_columns",  {element: this.element, columns: "1fr 1fr 1fr"});
            crs.call("cssgrid", "set_rows",     {element: this.element, rows: "1fr 1fr 1fr"});
        })
    }

    async disconnectedCallback() {
        this.element = null;
        super.disconnectedCallback();
    }

    async addColumn() {
        await crs.call("cssgrid", "add_column", {element: this.element, position: "end", width: ["10px", "11px", "12px"]});
        await crs.call("cssgrid", "add_column", {element: this.element, position: "front", width: "20px"});
        await crs.call("cssgrid", "add_column", {element: this.element, position: 1, width: "30px"})

        console.log(this.element.style.gridTemplateColumns);
    }

    async removeColumn() {
        await crs.call("cssgrid", "remove_column", {element: this.element, position: 1, count: 1})
        await crs.call("cssgrid", "remove_column", {element: this.element, position: "end", count: 3});
        await crs.call("cssgrid", "remove_column", {element: this.element, position: "front", count: 1});
    }

    async setWidth() {
        await crs.call("cssgrid", "set_column_width", {element: this.element, position: 1, width: "1fr"});
    }

    async addRow() {
        await crs.call("cssgrid", "add_row", {element: this.element, position: "end", height: "1fr"});
        await crs.call("cssgrid", "add_row", {element: this.element, position: "front", height: "1fr"});
        await crs.call("cssgrid", "add_row", {element: this.element, position: 1, height: "1fr"})
    }

    async removeRow() {
        await crs.call("cssgrid", "remove_row", {element: this.element, position: "end"});
        await crs.call("cssgrid", "remove_row", {element: this.element, position: "front"});
        await crs.call("cssgrid", "remove_row", {element: this.element, position: 1})
    }

    async setHeight() {
        await crs.call("cssgrid", "set_row_height", {element: this.element, position: 1, width: "1fr"});
    }

}