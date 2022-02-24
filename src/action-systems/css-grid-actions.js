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
        const requiresVirtualization = await renderInitialRows(element, step.args.data, step.args.template, step.args.limit, step.args.rowHeight, step.args.topRowIndex);
        if (requiresVirtualization == true) enableScroll(element);
    }

    static async enable_scroll(step) {
        const element = await getElement(step.args.element);
        enableScroll(element);
    }

    static async disable_scroll(step) {
        const element = await getElement(step.args.element);
        disableScroll(element);
    }

    static async move_to_bottom(step) {
        const element = await getElement(step.args.element);
        const result = moveToBottom(element, step.args.data, step.args.topRowIndex, step.args.bottomRowIndex, step.args.count);
        step.args.topRowIndex = result.topRowIndex;
        step.args.bottomRowIndex = result.bottomRowIndex;
    }

    static async move_to_top(step) {
        const element = await getElement(step.args.element);
        const result = moveToTop(element, step.args.data, step.args.topRowIndex, step.args.bottomRowIndex, step.args.count);
        step.args.topRowIndex = result.topRowIndex;
        step.args.bottomRowIndex = result.bottomRowIndex;
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

async function renderInitialRows(target, data, template, limit, rowHeight, topRowIndex) {
    const bounds = target.getBoundingClientRect();

    target.rowHeight = rowHeight;
    target.renderCount = data.length > limit ? Math.round(bounds.height / target.rowHeight) * 2 : data.length;

    target.topRowIndex = topRowIndex;
    target.bottomRowIndex = target.renderCount + topRowIndex;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < target.renderCount; i++) {
        const rowInstance = crsbinding.inflationManager.get(template, data[i]);

        let column = 1;
        let row = topRowIndex + i;
        for (let child of rowInstance.children) {
            child.style.gridRow = row;
            child.style.gridColumn = column;
            child.dataset.row = row;
            child.dataset.col = column;
            column += 1;
        }

        fragment.appendChild(rowInstance);
    }

    target.appendChild(fragment);

    return data.length > limit;
}

function moveToBottom(element, data, topRowIndex, bottomRowIndex, count) {
    moveRows(element, data, topRowIndex, bottomRowIndex, count);
    return {topRowIndex: topRowIndex += count, bottomRowIndex: bottomRowIndex += count}
}

function moveToTop(element, data, topRowIndex, bottomRowIndex, count) {
    const from = bottomRowIndex - count;
    const to = topRowIndex - count;
    moveRows(element, data, from, to, count);

    return {topRowIndex: topRowIndex -= count, bottomRowIndex: bottomRowIndex -= count}
}

function moveRows(element, data, from, to, count) {
    for (let i = 0; i < count; i++) {
        const row = data[to + i];

        if (row != null) {
            const cells = element.querySelectorAll(`[data-row="${from + i}"]`);

            //Couple of options to render cells
            //1. On cell level with data-property defined on cell
            //2. inflation manager (expensive)
            //3. inflation callback function with data-inflationFunction defined on cell
            for (let cell of cells) {
                cell.style.gridRow = to + i;
                cell.dataset.row = to + i;
                if (cell.dataset.inflationFunction != null) {
                    element[cell.dataset.inflationFunction](cell, row);
                } else {
                    cell.textContent = row[cell.dataset.field] == null ? '' : row[cell.dataset.field];
                }
            }
        }
    }
}

function enableScroll(element) {
    element.lastScroll = 0;
    element.nextDownIndex = Math.round(element.renderCount / 3);
    element.batchSize = Math.round(element.nextDownIndex / 2);
    element.scrollHandler = performScroll.bind(element);
    element.addEventListener("scroll", element.scrollHandler);
}

function disableScroll(element) {
    element.removeEventListener("scroll", element.scrollHandler);
    delete element.scrollHandler;
    delete element.lastScroll;
    delete element.nextDownIndex;
    delete element.nextUpIndex;
    delete element.batchSize;
    delete element.renderCount;
    delete element.topRowIndex;
    delete element.bottomRowIndex;
}

async function performScroll(event) {
    const element = event.target;
    const top = element.scrollTop;

    const scrollIndex = Math.round(element.scrollTop / element.rowHeight);

    if ((top - element.lastScroll) / element.rowHeight > element.batchSize) {
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

function virtualizeDown(element, event) {
    const result = moveToBottom(element, element.data, element.topRowIndex, element.bottomRowIndex, element.batchSize);
    element.topRowIndex = result.topRowIndex;
    element.bottomRowIndex = result.bottomRowIndex;
    element.nextDownIndex += element.batchSize;
    element.nextUpIndex = element.nextDownIndex - element.batchSize;
}

function virtualizeUp(element, event) {
    const result = moveToTop(element, element.data, element.topRowIndex, element.bottomRowIndex, element.batchSize);
    element.topRowIndex = result.topRowIndex;
    element.bottomRowIndex = result.bottomRowIndex;
    element.nextUpIndex -= element.batchSize;
    element.nextDownIndex = element.nextUpIndex + element.batchSize;
}

//TODO KR: complete render page logic
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