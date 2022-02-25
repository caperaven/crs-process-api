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

    /**
     * for a css grid element, renders the initial number of rows and will enable virtualization if applicable
     */
    static async render_initial_rows(step) {
        const element = await getElement(step.args.element);
        const requiresVirtualization = await renderInitialRows(element, step.args.data, step.args.template, step.args.limit, step.args.rowHeight, step.args.topRowIndex);
        if (requiresVirtualization == true) enableScroll(element);
    }

    /**
     * for a css grid element, enables a virtualized scroll on the element
     */
    static async enable_scroll(step) {
        const element = await getElement(step.args.element);
        enableScroll(element);
    }

    /**
     * for a css grid element, disables the virtualized scroll on the element
     */
    static async disable_scroll(step) {
        const element = await getElement(step.args.element);
        disableScroll(element);
    }

    /**
     * for a css grid element, move a specified number of items from a higher location to lower location within the grid
     */
    static async move_to_bottom(step) {
        const element = await getElement(step.args.element);
        const result = moveToBottom(element, step.args.data, step.args.topRowIndex, step.args.bottomRowIndex, step.args.count);
        step.args.topRowIndex = result.topRowIndex;
        step.args.bottomRowIndex = result.bottomRowIndex;
    }

    /**
     * for a css grid element, move a specified number of items from a lower location to a higher location
     */
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

/**
 * Renders the initial set of items within a css grid element.
 * NOTE: row template item must be registered on the inflation manager.
 * @param target {HTMLElement} - The css grid element
 * @param data {[]} - Data required to render within the grid
 * @param template {String} - Template key registered within the inflation manager
 * @param limit {Number} - Limit of items to render before virtualization must be enabled
 * @param rowHeight {Number} - Height of row items in px's
 * @param topRowIndex {Number} - Index of the top row within the css grid
 * @returns result {Boolean} - Whether virtualization is required or not
 */
async function renderInitialRows(target, data, template, limit, rowHeight, topRowIndex) {
    const bounds = target.getBoundingClientRect();

    target.rowHeight = rowHeight;
    target.renderCount = data.length > limit ? Math.round(bounds.height / target.rowHeight) * 2 : data.length;

    target.topRowIndex = topRowIndex;
    target.dataOffset = topRowIndex;
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

/**
 * Moves a set number of css grid items to a lower point within the grid
 * @param element {HTMLElement} - The css grid element
 * @param data {[]} - Data used to render the grid items
 * @param topRowIndex {Number} - Index of the top row item
 * @param bottomRowIndex {Number} - Index of the bottom row item
 * @param count {Number} - Batch size to move
 * @returns result {{topRowIndex, bottomRowIndex}} - Updated top and bottom row indices
 */
function moveToBottom(element, data, topRowIndex, bottomRowIndex, count) {
    moveRows(element, data, topRowIndex, bottomRowIndex, count);
    return {topRowIndex: topRowIndex += count, bottomRowIndex: bottomRowIndex += count}
}

/**
 * Moves a set number of css grid items to a higher point within the grid
 * @param element {HTMLElement} - The css grid element
 * @param data {[]} - Data used to render the grid items
 * @param topRowIndex {Number} - Index of the top row item
 * @param bottomRowIndex {Number} - Index of the bottom row item
 * @param count {Number} - Batch size to move
 * @returns {{topRowIndex, bottomRowIndex}} - Updated top and bottom row indices
 */
function moveToTop(element, data, topRowIndex, bottomRowIndex, count) {
    const from = bottomRowIndex - count;
    const to = topRowIndex - count;
    moveRows(element, data, from, to, count);
    return {topRowIndex: topRowIndex -= count, bottomRowIndex: bottomRowIndex -= count}
}

/**
 * Moves a number of css grid row items from a specified position to a specified position
 * @param element {HTMLElement} - The css grid element
 * @param data {[]} - Data used to render the grid items
 * @param from {Number} - Index of the row item to begin moving
 * @param to {Number} - Index of the row item where items should be placed
 * @param count {Number} - Batch size to move
 */
function moveRows(element, data, from, to, count) {
    for (let i = 0; i < count; i++) {
        const row = data[to - element.dataOffset + i];

        if (row != null) {
            const cells = element.querySelectorAll(`[data-row="${from + i}"]`);

            for (let cell of cells) {
                cell.style.gridRow = to + i;
                cell.dataset.row = to + i;
                cell.textContent = row[cell.dataset.field] == null ? '' : row[cell.dataset.field];
            }
        }
    }
}

/**
 * Enabled virtualized scrolling on the css grid element
 * @param element {HTMLElement} - The css grid element to have virtualized scrolling
 */
function enableScroll(element) {
    element.lastScroll = 0;
    element.nextDownIndex = Math.round(element.renderCount / 3);
    element.batchSize = Math.round(element.nextDownIndex / 2);
    element.scrollHandler = performScroll.bind(element);
    element.addEventListener("scroll", element.scrollHandler);
}

/**
 * Disables virtualized scrolling on the css grid element
 * @param element {HTMLElement} - The css grid element to have virtualized scrolling
 */
function disableScroll(element) {
    element.removeEventListener("scroll", element.scrollHandler);
    delete element.scrollHandler;
    delete element.scrollTop;
    delete element.lastScroll;
    delete element.nextDownIndex;
    delete element.nextUpIndex;
    delete element.batchSize;
    delete element.renderCount;
    delete element.topRowIndex;
    delete element.bottomRowIndex;
}

/**
 * Performs a virtualized scroll, paging and moving items where necessary
 * @param event {Object} - Scroll event
 */
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

/**
 * On virtualized scroll down, moves items down the css grid element
 * @param element {HTMLElement} - css grid element
 * @param event {Object} - scroll event
 */
function virtualizeDown(element, event) {
    const result = moveToBottom(element, element.data, element.topRowIndex, element.bottomRowIndex, element.batchSize);
    element.topRowIndex = result.topRowIndex;
    element.bottomRowIndex = result.bottomRowIndex;
    element.nextDownIndex += element.batchSize;
    element.nextUpIndex = element.nextDownIndex - element.batchSize;
}

/**
 * On virtualized scroll up, moves items up the css grid element
 * @param element {HTMLElement} - css grid element
 * @param event {Object} - scroll event
 */
function virtualizeUp(element, event) {
    const result = moveToTop(element, element.data, element.topRowIndex, element.bottomRowIndex, element.batchSize);
    element.topRowIndex = result.topRowIndex;
    element.bottomRowIndex = result.bottomRowIndex;
    element.nextUpIndex -= element.batchSize;
    element.nextDownIndex = element.nextUpIndex + element.batchSize;
}

//TODO KR: complete render page logic
function renderPage(element, scrollIndex) {
    console.log("render page", scrollIndex);
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