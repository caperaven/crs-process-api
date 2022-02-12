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
    static async add_columns(step, context, process, item) {
        await add(step, context, process, item, "gridTemplateColumns", "width");
    }

    /**
     * Remove a css column
     */
    static async remove_columns(step, context, process, item) {
        await remove(step, context, process, item, "gridTemplateColumns");
    }

    /**
     * set the width of a css column
     */
    static async set_column_width(step, context, process, item) {
        await resize(step, context, process, item, "gridTemplateColumns", "width");
    }

    /**
     * Add a css row
     */
    static async add_rows(step, context, process, item) {
        await add(step, context, process, item, "gridTemplateRows", "height");
    }

    /**
     * Remove a css row
     */
    static async remove_rows(step, context, process, item) {
        await remove(step, context, process, item, "gridTemplateRows");
    }

    /**
     * Set the height of a css row
     */
    static async set_row_height(step, context, process, item) {
        await resize(step, context, process, item, "gridTemplateRows", "height");
    }

    /**
     * Set css region
     */
    static async set_regions(step, context, process, item) {
        const element   = await getElement(step.args.element);
        const areas     = await crs.process.getValue(step.args.areas, context, process, item);

        const gridAreas = await areasToArray(element);

        for (let area of areas) {
            populateAreaIntent(gridAreas, area);
        }

        let result = [];
        for (let row of gridAreas) {
            result.push(`"${row.join(" ")}"`);
        }

        element.style.gridTemplateAreas = result.join(" ");
    }

    /**
     * clear a css region
     */
    static async clear_region(step, context, process, item) {

    }
}

function populateAreaIntent(collection, area) {
    for (let row = area.start.row; row <= area.end.row; row++) {
        for (let col = area.start.col; col <= area.end.col; col++) {
            collection[row][col] = area.name;
        }
    }
}

function getColumnCount(element) {
    return element.style.gridTemplateColumns.split(" ").length;
}

function getRowCount(element) {
    return element.style.gridTemplateRows.split(" ").length;
}


async function areasToArray(element) {
    const areas = element.style.gridTemplateAreas.trim();
    const colCount = getColumnCount(element);
    const rowCount = getRowCount(element);

    let result = [];
    for (let i = 0; i < rowCount; i++) {
        result[i] = [];
        for (let j = 0; j < colCount; j++) {
            result[i][j] = ".";
        }
    }

    return result;
}

async function resize(step, context, process, item, property, valueProperty) {
    const element = await getElement(step.args.element);
    let items = element.style[property].split(" ");
    if (items.length == 0) return;

    let value = await crs.process.getValue(step.args[valueProperty], context, process, item);
    const position = await crs.process.getValue(step.args.position, context, process, item);

    items[position] = value;

    element.style[property] = items.join(" ");
}

async function add(step, context, process, item, property, valueProperty) {
    const element = await getElement(step.args.element);
    let items = element.style[property].split(" ");
    if (items.length == 0) return;

    let value = await crs.process.getValue(step.args[valueProperty], context, process, item);
    const position = await crs.process.getValue(step.args.position, context, process, item);

    if (Array.isArray(value) == false) {
        value = [value];
    }

    if (position == "front") {
        items = [...value, ...items];
    }
    else if (position == "end") {
        items.push(...value)
    }
    else {
        items.splice(position, 0, ...value);
    }

    element.style[property] = items.join(" ");
}

async function remove(step, context, process, item, property) {
    const element = await getElement(step.args.element);
    let items = element.style[property].split(" ");
    if (items.length == 0) return;

    const position = await crs.process.getValue(step.args.position, context, process, item);
    const count = (await crs.process.getValue(step.args.count, context, process, item)) || 1;

    if (position == "front") {
        items.splice(0, count);
    }
    else if (position == "end") {
        items.splice(items.length - count, count);
    }
    else {
        items.splice(position, count);
    }

    element.style[property] = items.join(" ");
}

crs.intent.cssgrid = CssGridActions;