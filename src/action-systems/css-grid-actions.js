/**
 *  @class CssGridActions - This class contains functions that perform actions on CSS grids
 *  Features:
 *  init - Enable a element to be a CSS grid
 *  enable_resize - Enable a CSS grid to be resized
 *  disable_resize - Disable a CSS grid from being resized
 *  auto_fill - Automatically fill a CSS grid with items
 *  set_columns - Set the number of columns in a CSS grid
 *  set_rows - Set the number of rows in a CSS grid
 *  add_columns - Add columns to a CSS grid
 *  add_rows - Add rows to a CSS grid
 *  remove_columns - Remove columns from a CSS grid
 *  remove_rows - Remove rows from a CSS grid
 *  set_column_width - Set the width of a column in a CSS grid
 *  set_row_height - Set the height of a row in a CSS grid
 *  set_region - Set the region of an element(s) in a CSS grid
 *  clear_region - Clear the region of an element(s) in a CSS grid
 *  column_count - Get the number of columns in a CSS grid
 *  row_count - Get the number of rows in a CSS grid
 *  get_column_sizes - Get the sizes of the columns in a CSS grid.
 */
export class CssGridActions {
    /**
     * @method - The `perform` function is a static function that is called by the `process` function. It takes the `step` object,
     * the `context` object, the `process` function, and the `item` object as arguments. It then calls the `step.action`
     * function, passing the `step`, `context`, `process`, and `item` objects as arguments
     * @param step - The step object from the process definition
     * @param context - The context object that is passed to the process.
     * @param process - The process object that is being executed.
     * @param item - The item that is being processed.
     *
     * @param {string} step.action - The action to perform
     */
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    /**
     * Enable a element to be a CSS grid
     */


    /**
     * @method - The function sets the display style of the element to "grid"
     * @param step - The step object from the JSON file.
     * @param context - The context object that is passed to the step.
     * @param process - The process object that is currently running.
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to set to "grid"
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "init", {
     *   element: "#my-grid"
     *   // or
     *   element: "my-grid"
     *   // or
     *   element: document.getElementById("my-grid")
     *   });
     *
     * @example <caption>json example</caption>
     *   {
     *      "type": "css-grid",
     *      "action": "init",
     *      "args": {
     *       "element": "#my-grid"
     *      }
     *   }
     */
    static async init(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        element.style.display = "grid";
    }

    /**
     * @method - It imports the grid resize manager, creates an instance of it, and initializes it
     * @param step - The step object from the process.
     * @param context - The context of the current process.
     * @param process - The current process.
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to enable resizing on.
     * @param {object} step.args.options - The options to pass to the grid resize manager.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "enable_resize", {
     *  element: "#my-grid"
     *  options: {
     *    min: {
     *         width: 100,
     *         height: 100
     *          },
     *    max: {
     *         width: 500,
     *         height: 500
     *         }
     *    }
     *    });
     */
    static async enable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const options = await crs.process.getValue(step.args.options, context, process, item);

        const module = await import("./managers/grid-resize-manager.js");
        const instance = new module.CSSGridResizeManager(element, options);
        await instance.initialize();
    }

    /**
     * @method - It disables the resize functionality on the element specified in the step's `element` argument
     * @param step - The step object from the process.
     * @param context - The context of the current step.
     * @param process - The process that is running the step.
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to disable resizing on.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "disable_resize", {
     *    element: "#my-grid"
     * });
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "css-grid",
     *   "action": "disable_resize",
     *   "args": {
     *   "element": "#my-grid"
     *   }
     * }
     */
    static async disable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__cssGridResizeMananger?.dispose();
    }

    /**
     * @method - This function creates a grid of cells, each with a unique id
     * a function that will automatically fill/create a grid according to the number of columns and rows.
     * @param step - The step object
     * @param context - The context of the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to create the grid in.
     * @param {string} step.args.columns - The number of columns to create.
     * @param {string} step.args.rows - The number of rows to create.
     *
     * It will create a grid of cells, each with a unique id
     * Each cell will be a div element with the class "grid-cell" and the id "grid-cell-<row>-<column>"
     * Each cell will be a child of the element specified in the step's `element` argument
     * Every cell will have a border of 1px solid black
     * The css-variable `--grid-cell-width` will be set to the width of the element divided by the number of columns
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "auto_fill", {
     *  element: "#my-grid",
     *  columns: "3",
     *  rows: "3"
     *  });
     *
     *  // The following html will be created
     *  <div id="my-grid">
     *      <div id="grid-cell-1-1" class="grid-cell"></div>
     *      <div id="grid-cell-1-2" class="grid-cell"></div>
     *      <div id="grid-cell-1-3" class="grid-cell"></div>
     *      <div id="grid-cell-2-1" class="grid-cell"></div>
     *      <div id="grid-cell-2-2" class="grid-cell"></div>
     *      <div id="grid-cell-2-3" class="grid-cell"></div>
     *      <div id="grid-cell-3-1" class="grid-cell"></div>
     *      <div id="grid-cell-3-2" class="grid-cell"></div>
     *      <div id="grid-cell-3-3" class="grid-cell"></div>
     *      <style>
     *
     *          #my-grid {
     *          display: grid;
     *          grid-template-columns: repeat(3, 1fr);
     *          grid-template-rows: repeat(3, 1fr);
     *          }
     *
     *      </style>
     *
     *  @example <caption>json example</caption>
     *  {
     *    "type": "css-grid",
     *    "action": "auto_fill",
     *    "args": {
     *    "element": "#my-grid",
     *    "columns": "3",
     *    "rows": "3"
     *    }
     *  }
     *
     *  This will create a grid with 3 columns and 3 rows in the element with the id "my-grid".
     *
     *  @returns {Promise<void>}
     */
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


    /**
     * @method - Set the CSS grid template columns property of the element identified by the `element` argument to the value of the
     * `columns` argument
     * @param step - The step object from the process.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to set the columns on.
     * @param {string} step.args.columns - The value to set the columns to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "set_columns", {
     *    element: "#my-grid",
     *    columns: "repeat(3, 1fr)"
     * });
     *
     * // The following html will be created
     * <div id="my-grid">
     *     <style>
     *
     *         #my-grid {
     *         display: grid;
     *         grid-template-columns: repeat(3, 1fr);
     *         }
     *
     *     </style>
     * </div>
     *
     * @example <caption>json example</caption>
     * {
     *  "type": "css-grid",
     *  "action": "set_columns",
     *  "args": {
     *   "element": "#my-grid",
     *   "columns": "repeat(3, 1fr)"
     *   }
     * }
     */
    static async set_columns(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const columns = await crs.process.getValue(step.args.columns, context, process, item);
        element.style.gridTemplateColumns = columns;
    }

    /**
     * Set the rows of a grid
     */


    /**
     * @method - It sets the grid-template-rows property of the element specified in the step's args.element property to the value of
     * the step's args.rows property
     * @param step - The step object from the process.
     * @param context - The context object that is passed to the process.
     * @param process - the process object
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to set the rows on.
     * @param {string} step.args.rows - The value to set the rows to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "set_rows", {
     *   element: "#my-grid",
     *   rows: "repeat(3, 1fr)"
     *   });
     *
     *   // The following html will be created
     *   <div id="my-grid">
     *       <style>
     *
     *           #my-grid {
     *           display: grid;
     *           grid-template-rows: repeat(3, 1fr);
     *           }
     *       </style>
     *   </div>
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "css-grid",
     *   "action": "set_rows",
     *   "args": {
     *    "element": "#my-grid",
     *    "rows": "repeat(3, 1fr)"
     *    }
     * }
     *
     */
    static async set_rows(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element);
        const rows = await crs.process.getValue(step.args.rows, context, process, item);
        element.style.gridTemplateRows = rows;
    }

    /**
     * ToDo: Ask about position.
     */

    /**
     * @method - It adds columns to the specified element in the specified position.
     *  a Count can be added to multiple columns at once.
     *
     * @param step - the current step in the process
     * @param context - The context of the current step.
     * @param process - the process object
     * @param item - the item that is being processed
     *
     * @param {string} step.args.element - The element to add the column to.
     * @param {string} step.args.position - The position to add the column to.
     * @param {string} step.args.width - The width of the column to add.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "add_column", {
     *  element: "#my-grid",
     *  position: "front",
     *  // or
     *  position: "back",
     *  // or
     *  position: 1,
     *  width: "1fr"
     *  });
     *
     *  @example <caption>json example</caption>
     *  {
     *     "type": "css-grid",
     *     "action": "add_column",
     *     "args": {
     *      "element": "#my-grid",
     *      "position": "front",
     *      "width": "1fr"
     *     }
     *  }
     */
    static async add_columns(step, context, process, item) {
        await add(step, context, process, item, "gridTemplateColumns", "width");
    }

    /**
     * ToDo: Ask about Column and Row count ? Multiple or single ?
     */


    /**
     * @method - Removes a column and/or columns from the specified element's grid at the specified position.
     * @param step - the step object
     * @param context - The context of the current step.
     * @param process - the process object
     * @param item - the item that is being processed
     *
     * @param {string} step.args.element - The element to remove the column from.
     * @param {string} step.args.position - The position to remove the column from.
     *
     */
    static async remove_columns(step, context, process, item) {
        await remove(step, context, process, item, "gridTemplateColumns");
    }

    /**
     * set the width of a css column
     */


    /**
     * @method - Sets the width of a column in the specified element's grid at the specified position.
     *
     * @param step - the step object
     * @param context - The context of the current step.
     * @param process - the process object
     * @param item - the item that is being resized
     *
     * @param {string} step.args.element - The element to set the column width on.
     * @param {string} step.args.position - The position to set the column width on.
     * @param {string} step.args.width - The width to set the column to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "set_column_width", {
     * element: "#my-grid",
     * position: 1,
     * width: "1fr"
     * });
     *
     * @example <caption>json example</caption>
     * {
     *    "type": "css-grid",
     *    "action": "set_column_width",
     *    "args": {
     *      "element": "#my-grid",
     *      "position": 1,
     *      "width": "1fr"
     *     }
     * }
     */
    static async set_column_width(step, context, process, item) {
        await resize(step, context, process, item, "gridTemplateColumns", "width");
    }

    /**
     * Add a css row
     */


    /**
     * @method - It adds a row to the grid of the specified element in the specified position.
     * @param step - the step object
     * @param context - The context of the current step.
     * @param process - the process object
     * @param item - the item to add to the grid
     *
     * @param {string} step.args.element - The element to add the row to.
     * @param {string} step.args.position - The position to add the row to.
     * @param {string} step.args.height - The height of the row to add.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "add_row", {
     *    element: "#my-grid",
     *    position: "front",
     *    // or
     *    position: 1,
     *    height: "1fr"
     * });
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "css-grid",
     *   "action": "add_row",
     *   "args": {
     *     "element": "#my-grid",
     *     "position": "front",
     *     "height": "1fr"
     *   }
     * }
     */
    static async add_rows(step, context, process, item) {
        await add(step, context, process, item, "gridTemplateRows", "height");
    }

    /**
     * Remove a css row
     */


    /**
     * @method - Remove the rows from the grid of the specified element in the specified position.
     * @param step - the step object
     * @param context - The context of the current step.
     * @param process - the process object
     * @param item - the item that is being processed
     *
     * @param {string} step.args.element - The element to remove the row from.
     * @param {string} step.args.position - The position to remove the row from.
     * @param {string} step.args.count - The number of rows to remove.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "remove_row", {
     *   element: "#my-grid",
     *   position: "front",
     *   // or
     *   position: 1,
     *   count: 1
     *   });
     *
     * @example <caption>json example</caption>
     * {
     *  "type": "css-grid",
     *  "action": "remove_row",
     *  "args": {
     *    "element": "#my-grid",
     *    "position": "front",
     *    "count": 1
     *    }
     * }
     */
    static async remove_rows(step, context, process, item) {
        await remove(step, context, process, item, "gridTemplateRows");
    }

    /**
     * Set the height of a css row
     */


    /**
     * @method - Resize the row height of the grid of the specified element in the specified position.
     * @param step - the step object
     * @param context - The context of the current step.
     * @param process - the process object
     * @param item - the item that was selected in the grid
     *
     * @param {string} step.args.element - The element to set the row height on.
     * @param {string} step.args.position - The position to set the row height on.
     * @param {string} step.args.height - The height to set the row to.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "set_row_height", {
     *  element: "#my-grid",
     *  position: 1,
     *  height: "1fr"
     *  });
     *
     * @example <caption>json example</caption>
     * {
     *  "type": "css-grid",
     *  "action": "set_row_height",
     *  "args": {
     *    "element": "#my-grid",
     *    "position": 1,
     *    "height": "1fr"
     *   }
     * }
     */
    static async set_row_height(step, context, process, item) {
        await resize(step, context, process, item, "gridTemplateRows", "height");
    }

    /**
     * Set css region
     */


    /**
     * @method - It takes a list of areas, and sets the grid template areas of the element to those areas
     * @param step - The step object
     * @param context - The context object that is passed to the process.
     * @param process - The process that is currently running.
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to set the regions on.
     * @param {array of objects} step.args.areas - The areas to set the regions to.
     * @param {string} step.args.auto_fill - If true, it will fill in the rest of the grid with the default area.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "set_regions", {
     *   element: "#my-grid",
     *   areas: [
     *     { start: {col: 0, row: 0}, end: {col: 1, row: 1}, name: "area1" },
     *     { start: {col: 2, row: 0}, end: {col: 2, row: 1}, name: "area2" },
     *     { start: {col: 0, row: 2}, end: {col: 2, row: 2}, name: "area3" }
     *   ]
     *  });
     *
     * @example <caption>json example</caption>
     * {
     *  "type": "css-grid",
     *  "action": "set_regions",
     *  "args": {
     *  "element": "#my-grid",
     *  "areas": [
     *    { "start": { "col": 0, "row": 0 }, "end": { "col": 1, "row": 1 }, "name": "area1" },
     *    { "start": { "col": 2, "row": 0 }, "end": { "col": 2, "row": 1 }, "name": "area2" },
     *    { "start": { "col": 0, "row": 2 }, "end": { "col": 2, "row": 2 }, "name": "area3" }
     *    ]
     *   }
     * }
     *
     */
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

    /**
     * Remove elements that occupy a defined region
     * @returns {Promise<void>}
     */


    /**
     * @method - It removes all elements with a data-area attribute that matches the area argument
     * @param step - The step object from the process.
     * @param context - The context object that is passed to the process.
     * @param process - The process object
     * @param item - The item that is being processed.
     *
     * @param {string} step.args.element - The element to clear the region on.
     * @param {string} step.args.area - The area to clear.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "clear_region", {
     *   element: "#my-grid",
     *   area: "area1"
     * });
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "css-grid",
     *   "action": "clear_region",
     *   "args": {
     *     "element": "#my-grid",
     *     "area": "area1"
     *    }
     * }
     */
    static async clear_region(step, context, process, item) {
        const element   = await crs.dom.get_element(step.args.element);
        const area      = await crs.process.getValue(step.args.area, context, process, item);

        const elements = element.querySelectorAll(`[data-area="${area}"]`);
        for (const element of elements) {
            element.parentElement.removeChild(element);
        }
    }

    /**
     * for a css grid get the column count
     */


    /**
     * @method - Get the number of columns for a css grid element.
     * @param step - The step object that is passed to the function.
     *
     * @param {string} step.args.element - The element to get the column count for.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "column_count", {
     *    element: "#my-grid"
     *  });
     *
     * @example <caption>json example</caption>
     *  {
     *    "type": "css-grid",
     *    "action": "column_count",
     *    "args": {
     *     "element": "#my-grid"
     *    }
     *  }
     *
     * @returns The number of columns in the table.
     */
    static async column_count(step) {
        const element = await crs.dom.get_element(step.args.element);
        const result = getColumnCount(element);
        return result;
    }

    /**
     * for a css grid element get the row count
     */


    /**
     * @method - Get the number of rows in a for a css grid element
     * @param step - The step object that is passed to the function.
     *
     * @param {string} step.args.element - The element to get the row count for.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "row_count", {
     *   element: "#my-grid"
     *   });
     *
     * @example <caption>json example</caption>
     * {
     *  "type": "css-grid",
     *  "action": "row_count",
     *  "args": {
     *    "element": "#my-grid"
     *   }
     * }
     *
     * @returns The number of rows in the table.
     */
    static async row_count(step) {
        const element = await crs.dom.get_element(step.args.element);
        const result = getRowCount(element);
        return result;
    }

    /**
     * @method - It gets the sizes of the columns of a grid element
     * @param step - The step object that is being executed.
     *
     * @param {string} step.args.element - The element to get the column sizes for.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("css-grid", "get_column_sizes", {
     *  element: "#my-grid"
     *  });
     *
     * @example <caption>json example</caption>
     * {
     *   "type": "css-grid",
     *   "action": "get_column_sizes",
     *   "args": {
     *     "element": "#my-grid"
     *   }
     * }
     *
     * @returns An array of numbers
     */
    static async get_column_sizes(step) {
        const element = await crs.dom.get_element(step.args.element);
        const sizes = getComputedStyle(element).gridTemplateColumns.split("px").join("").split(" ");

        for (let i = 0; i < sizes.length; i++) {
            sizes[i] = Number(sizes[i]);
        }

        return sizes;
    }
}

/**
 * @function - "For each row in the area, for each column in the area, set the collection at that row and column to the area name."
 *
 * The function is called with the collection and the area. The collection is a two dimensional array of strings. The area
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
 * @function - It takes an element and returns the number of columns in its grid
 * @param element - The element whose grid you want to get the column count of.
 *
 * @returns The number of columns in the grid.
 */
function getColumnCount(element) {
    return element.style.gridTemplateColumns.split(" ").length;
}

/**
 * @function - It takes an element and returns the number of rows in its grid
 * @param element - The element you want to get the row count of.
 * @returns The number of rows in the grid.
 */
function getRowCount(element) {
    return element.style.gridTemplateRows.split(" ").length;
}

/**
 * @function - It creates a 2D array of dots
 * @param element - The element that the grid is applied to.
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
 * @function -  It takes a step, a context, a process, an item, a property, and a value property, and then it gets the element, gets the
 * value, gets the position, and then sets the element's style property to the value at the position
 * @param step - The step object
 * @param context - The context of the current process.
 * @param process - the current process
 * @param item - the current item in the loop
 * @param property - The CSS property to set.
 * @param valueProperty - The name of the property that contains the value to set.
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
 * @function - It adds a value to a CSS property
 * @param step - The step object
 * @param context - The context of the current process.
 * @param process - The process that is running the step.
 * @param item - The item that is being processed.
 * @param property - The name of the property to add to.
 * @param valueProperty - The name of the property that contains the value to add.
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
 * @function - It removes a number of items from the end of a space-separated list of items in a CSS property
 * @param step - The step object.
 * @param context - The context of the process.
 * @param process - The process that is currently running.
 * @param item - The item that is being processed.
 * @param property - The name of the property to modify.
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