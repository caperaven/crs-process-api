import {getElement} from "./dom-actions.js"

export class CssGridActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * Enable a element to be a CSS grid
     */
    static async init(step, context, process, item) {
        const element = await getElement(step.args.element);
        element.style.display = "grid";
    }

    /**
     * Set the columns of a grid
     */
    static async set_columns(step, context, process, item) {
        const element = await getElement(step.args.element);
        const columns = await crs.process.getValue(step.args.columns, context, process, item);
        element.style.gridTemplateColumns = columns;
    }

    /**
     * Set the rows of a grid
     */
    static async set_rows(step, context, process, item) {
        const element = await getElement(step.args.element);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);
        element.style.gridTemplateRows = rows;
    }

    /**
     * Add a css column
     */
    static async add_column(step, context, process, item) {
        const element = await getElement(step.args.element);
        let columns = element.style.gridTemplateColumns.split(" ");
        if (columns.length == 0) return;

        let width = await crs.process.getValue(step.args.width, context, process, item);
        const position = await crs.process.getValue(step.args.position, context, process, item);

        if (Array.isArray(width) == false) {
            width = [width];
        }

        addToCollection(columns, position, width);

        element.style.gridTemplateColumns = columns.join(" ");
    }

    /**
     * Remove a css column
     */
    static async remove_column(step, context, process, item) {
        const element = await getElement(step.args.element);
        let columns = element.style.gridTemplateColumns.split(" ");
        if (columns.length == 0) return;

        const position = await crs.process.getValue(step.args.position, context, process, item);
        const count = await crs.process.getValue(step.args.count, context, process, item);

        removeFromCollection(columns, position, count || 1);

        element.style.gridTemplateColumns = columns.join(" ");
    }

    /**
     * set the width of a css column
     */
    static async set_column_width(step, context, process, item) {

    }

    /**
     * Add a css row
     */
    static async add_row(step, context, process, item) {

    }

    /**
     * Remove a css row
     */
    static async remove_row(step, context, process, item) {

    }

    /**
     * Set the height of a css row
     */
    static async set_row_height(step, context, process, item) {

    }

    /**
     * Set css region
     */
    static async set_region(step, context, process, item) {

    }

    /**
     * clear a css region
     */
    static async clear_region(step, context, process, item) {

    }
}

function addToCollection(collection, position, width) {
    if (position == "front") {
        collection = [...width, ...collection];
    }
    else if (position == "end") {
        collection.push(...width)
    }
    else {
        collection.splice(position, 0, ...width);
    }
}

function removeFromCollection(collection, position, count) {
    if (position == "front") {
        collection.splice(0, count);
    }
    else if (position == "end") {
        collection.splice(collection.length - count, count);
    }
    else {
        collection.splice(position, count);
    }
}

crs.intent.cssgrid = CssGridActions;