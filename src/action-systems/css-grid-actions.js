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
     * for a css grid get the column count
     */
    static async column_count(step) {
        const element = await getElement(step.args.element);
        const result = getColumnCount(element);
        return result;
    }

    /**
     * for a css grid element get the row count
     */
    static async row_count(step) {
        const element = await getElement(step.args.element);
        const result = getRowCount(element);
        return result;
    }

    static async clear(step) {
        const element = await getElement(step.args.element);
        clear(element);
    }

    static async render_initial_rows(step) {
        const element = await getElement(step.args.element);
        const requiresVirtualization = await renderInitialRows(element, step.args.template, step.args.limit, step.args.rowHeight);
        if (requiresVirtualization == true) enableScroll(element)
    }

    static async enable_scroll(step) {

    }

    static async disable_scroll(step) {

    }

    static async move_to_bottom(step) {
        const element = await getElement(step.args.element);
        moveToBottom(element, step.args.data, step.args.topRowIndex, step.args.bottomRowIndex, step.args.count);
    }

    static async move_to_top(step) {
        const element = await getElement(step.args.element);
        moveToTop(element, step.args.data, step.args.topRowIndex, step.args.bottomRowIndex, step.args.count);
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

function clear(element) {
    const children = element.children;
    for (const child of children) {
        element.removeChild(child);
    }
}

async function renderInitialRows(target, template, limit, rowHeight) {
    const bounds = target.getBoundingClientRect();

    target.renderCount = target.data.length > limit ? Math.round(bounds.height / rowHeight) * 2 : this.data.length;

    target.topRowIndex = 2;
    target.bottomRowIndex = target.renderCount + 2;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < target.renderCount; i++) {
        const inflatedTemplate = crsbinding.inflationManager.get(template, target.data[i]);
        fragment.appendChild(inflatedTemplate);
    }

    target.appendChild(fragment);

    return target.data.length > limit;
}

function moveToBottom(element, data, topRowIndex, bottomRowIndex, count) {
    moveRows(element, data, topRowIndex, bottomRowIndex, count);
    topRowIndex += count;
    bottomRowIndex += count;
}

function moveToTop(element, data, topRowIndex, bottomRowIndex, count) {
    const from = bottomRowIndex - count;
    const to = topRowIndex - count;
    moveRows(element, data, from, to, count);

    topRowIndex -= count;
    bottomRowIndex -= count;
}

function moveRows(element, data, from, to, count) {
    for (let i = 0; i < count; i++) {
        const row = data[to + i];

        if (row != null) {
            const cells = element.querySelectorAll(`[data-row="${from + i}"]`);

            for (let cell of cells) {
                cell.style.gridRow = to + i;
                cell.dataset.row = to + i;
                cell.textContent = row[cell.dataset.field];
            }
        }
    }
}

async function performScroll(event) {
    const element = event.target;
    const top = element.scrollTop;

    const scrollIndex = Math.round(element.scrollTop / 32);

    if ((top - element.lastScroll) / 32 > element.batchSize) {
        return renderPage(element, scrollIndex);
    }

    if (top > element.lastScroll) {
        if (scrollIndex >= element.nextDownIndex) {
            virtualizeDown(element, event);
        }
    }
    else {
        if (scrollIndex <= element.nextUpIndex) {
            virtualizeUp(element, event);
        }
    }

    element.lastScroll = top;
}

function enableScroll(element) {
    element.lastScroll = 0;
    element.nextDownIndex = Math.round(element.renderCount / 3);
    element.batchSize = Math.round(element.nextDownIndex /2);
    element.scrollHandler = performScroll.bind(element);
    element.addEventListener("scroll", element.scrollHandler);
}

function disableScroll(element) {
    element.removeEventListener("scroll", element.scrollHandler);
    element.scrollHandler = null;
}

function virtualizeDown(element, event) {
    moveToBottom(element, element.data, element.topRowIndex, element.bottomRowIndex, element.batchSize);
    element.nextDownIndex += element.batchSize;
    element.nextUpIndex = element.nextDownIndex - element.batchSize;
}

function virtualizeUp(element, event) {
    moveToTop(element, element.data, element.topRowIndex, element.bottomRowIndex, element.batchSize);
    element.nextUpIndex -= element.batchSize;
    element.nextDownIndex = element.nextUpIndex + element.batchSize;
}

function renderPage(element, scrollIndex) {
    console.log("render page", element, scrollIndex);
}

async function areasToArray(element) {
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