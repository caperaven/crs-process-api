// https://caperaven.co.za/process-api/using-process-ai/css-grid-module/
export class CssGridActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async init(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        element.style.display = "grid";
    }

    static async enable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const options = await crs.process.getValue(step.args.options, context, process, item);

        const module = await import("./managers/grid-resize-manager.js");
        const instance = new module.CSSGridResizeManager(element, options);
        await instance.initialize();
    }

    static async disable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__cssGridResizeMananger?.dispose();
    }

    static async auto_fill(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const columns = await crs.process.getValue(step.args.columns, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);

        await this.init(step, context, process, item);
        await this.set_columns(step, context, process, item);
        await this.set_rows(step, context, process, item);

        const columnCount = columns.split(" ").length;
        const rowCount = rows.split(" ").length;
        const cellCount = rowCount * columnCount;

        for(let cell = 0; cell < cellCount; cell ++){
            await crs.call("dom", "create_element",{
                "parent" : element,
                "tag_name" : "div",
                "dataset" : {
                    "id" : cell
                },
                "styles" : {
                    "border" : "1px solid silver",
                },
                "classes" : ["grid-cell"]
            })

            // Attempt
            await crs.call("dom", "set_css_variable", {
                element : element,
                "varRoot" : "--grid-cell",
                "rootStyle" : "cell" + cell,
            })

        }
    }

    static async set_columns(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const columns = await crs.process.getValue(step.args.columns, context, process, item);
        element.style.gridTemplateColumns = columns;
    }

    static async set_rows(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);
        element.style.gridTemplateRows = rows;
    }

    static async add_columns(step, context, process, item) {
        await add(step, context, process, item, "gridTemplateColumns", "width");
    }

    static async remove_columns(step, context, process, item) {
        await remove(step, context, process, item, "gridTemplateColumns");
    }

    static async set_column_width(step, context, process, item) {
        await resize(step, context, process, item, "gridTemplateColumns", "width");
    }

    static async add_rows(step, context, process, item) {
        await add(step, context, process, item, "gridTemplateRows", "height");
    }

    static async remove_rows(step, context, process, item) {
        await remove(step, context, process, item, "gridTemplateRows");
    }

    static async set_row_height(step, context, process, item) {
        await resize(step, context, process, item, "gridTemplateRows", "height");
    }

    static async set_regions(step, context, process, item) {
        const element   = await crs.dom.get_element(step.args.element);
        const areas     = await crs.process.getValue(step.args.areas, context, process, item);
        const auto_fill = (await crs.process.getValue(step.args.auto_fill, context, process, item)) || false;

        const gridAreas = await areasToArray(element);

        let names = [];
        for (let area of areas) {
            populateAreaIntent(gridAreas, area);
            names.push(area.name);
        }

        let result = [];
        for (let row of gridAreas) {
            result.push(`"${row.join(" ")}"`);
        }

        element.style.gridTemplateAreas = result.join(" ");

        if (auto_fill == true) {
            const tag_name = (await crs.process.getValue(step.args.tag_name, context, process, item)) || "div";

            for (const area of names) {
                await crs.call("dom", "create_element", {
                    parent: element,
                    tag_name: tag_name,
                    dataset: {
                        area: area
                    },
                    styles: {
                        gridArea: area
                    }
                })
            }
        }
    }

    static async clear_region(step, context, process, item) {
        const element   = await crs.dom.get_element(step.args.element);
        const area      = await crs.process.getValue(step.args.area, context, process, item);

        const elements = element.querySelectorAll(`[data-area="${area}"]`);
        for (const element of elements) {
            element.parentElement.removeChild(element);
        }
    }

    static async column_count(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const result = getColumnCount(element);

        if (step.args.result != null) {
            await crs.process.setValue(step.args.result, result, context, process, item);
        }

        return result;
    }


    static async row_count(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const result = getRowCount(element);

        if (step.args.result != null) {
            await crs.process.setValue(step.args.result, result, context, process, item);
        }

        return result;
    }

    static async get_column_sizes(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const sizes = getComputedStyle(element).gridTemplateColumns.split("px").join("").split(" ");

        for (let i = 0; i < sizes.length; i++) {
            sizes[i] = Number(sizes[i]);
        }

        if (step.args.result != null) {
            await crs.process.setValue(step.args.result, sizes, context, process, item);
        }

        return sizes;
    }
}

/**
 * @function populateAreaIntent - "For each row in the area, for each column in the area, set the collection at that row and column to the area name."
 *
 * The function is called with the collection and the area. The collection is a two-dimensional array of strings. The area
 * is an object with a name, a start row, a start column, an end row, and an end column
 * @param collection - The collection of arrays that we're populating.
 * @param area - The area that we're populating the collection with.
 *
 */
function populateAreaIntent(collection, area) {
    for (let row = area.start.row; row <= area.end.row; row++) {
        for (let col = area.start.col; col <= area.end.col; col++) {
            collection[row][col] = area.name;
        }
    }
}

/**
 * @function getColumnCount - It takes an element and returns the number of columns in its grid
 * @param element - The element whose grid you want to get the column count of.
 *
 * @returns The number of columns in the grid.
 */
function getColumnCount(element) {
    return element.style.gridTemplateColumns.split(" ").length;
}

/**
 * @function getRowCount - It takes an element and returns the number of rows in its grid
 * @param element - The element you want to get the row count of.
 * @returns The number of rows in the grid.
 */
function getRowCount(element) {
    return element.style.gridTemplateRows.split(" ").length;
}

/**
 * @function areasToArray - It creates a 2D array of dots
 * @param element {String} - The element that the grid is applied to.
 * @returns An array of arrays.
 */
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

/**
 * @function resize -  It takes a step, a context, a process, an item, a property, and a value property, and then it gets the element, gets the
 * value, gets the position, and then sets the element's style property to the value at the position
 * @param step {Object} - The step object
 * @param context {Object} - The context of the current process.
 * @param process {Object} - the current process
 * @param item {Object} - the current item in the loop
 * @param property {String}- The CSS property to set.
 * @param valueProperty {String} - The name of the property that contains the value to set.
 *
 * @param step.args.element {String} - The element to set the property on.
 * @param step.args.position {String} - The position to set the value at.
 * @param step.args[valueProperty] {String} - The value to set.
 *
 * @returns the value of the property.
 */
async function resize(step, context, process, item, property, valueProperty) {
    const element = await crs.dom.get_element(step.args.element);
    let items = element.style[property].split(" ");
    if (items.length == 0) return;

    let value = await crs.process.getValue(step.args[valueProperty], context, process, item);
    const position = await crs.process.getValue(step.args.position, context, process, item);

    items[position] = value;

    element.style[property] = items.join(" ");
}

/**
 * @function add - It adds a value to a CSS property
 *
 * @param step {Object} - The step object
 * @param context {Object} - The context of the current process.
 * @param process {Object} - The process that is running the step.
 * @param item {Object} - The item that is being processed.
 * @param property {String}- The name of the property to add to.
 * @param valueProperty {String} - The name of the property that contains the value to add.
 *
 * @param step.args.element {String} - The element to add the value to.
 * @param step.args.position {String}- The position to add the value to. Can be "front" or "end".
 * @param step.args[valueProperty] {String} - The value to add.
 *
 * @returns the value of the property.
 */
async function add(step, context, process, item, property, valueProperty) {
    const element = await crs.dom.get_element(step.args.element);
    let items = element.style[property].split(" ");
    if (items.length == 0) return;

    let value = await crs.process.getValue(step.args[valueProperty], context, process, item);
    let position = await crs.process.getValue(step.args.position, context, process, item);

    if (position == null) {
        position = "end";
    }

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

/**
 * @function remove - It removes a number of items from the end of a space-separated list of items in a CSS property
 *
 * @param step {Object} - The step object.
 * @param context {Object} - The context of the process.
 * @param process {Object} - The process that is currently running.
 * @param item {Object} - The item that is being processed.
 * @param property {String} - The name of the property to modify.
 *
 * @param step.args.element {String} - The element to modify.
 * @param step.args.position {String|Number} - The position to remove from. Can be "front", "end", or a number.
 * @param step.args.count {Number} - The number of items to remove.
 *
 * @returns the element.style[property]
 */
async function remove(step, context, process, item, property) {
    const element = await crs.dom.get_element(step.args.element);
    let items = element.style[property].split(" ");
    if (items.length == 0) return;

    const position = (await crs.process.getValue(step.args.position, context, process, item)) || "end";
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