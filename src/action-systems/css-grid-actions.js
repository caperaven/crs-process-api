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