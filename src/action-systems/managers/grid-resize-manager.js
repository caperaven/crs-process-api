import {getMouseInputMap, clientX, clientY} from "./input-mapping.js";

/**
 * Options
 *      columns, define this array of indexes if you only want to resize certain columns
 */

export class CSSGridResizeManager {
    #element;
    #bounds;
    #sizes;
    #options;
    #rowCount = 1;
    #columnCount = 1;
    #columnModifiers = [];
    #rowModifiers = [];
    #mouseDownHandler = this.#mouseDown.bind(this);
    #mouseMoveHandler = this.#mouseMove.bind(this);
    #mouseUpHandler = this.#mouseUp.bind(this);
    #animateHandler = this.#animate.bind(this);
    #startPos;
    #movePos;
    #dragElement;
    #inputMap;

    constructor(element, options) {
        this.#element = element;
        this.#bounds = element.getBoundingClientRect();
        this.#element.__cssGridResizeMananger = this;
        this.#options = options;
        this.#inputMap = getMouseInputMap();
    }

    dispose() {
        (this.#element.shadowRoot || this.#element).removeEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler);

        this.#element.__cssGridResizeMananger = null;
        this.#element = null;
        this.#sizes = null;
        this.#options = null;
        this.#rowCount = null;
        this.#columnCount = null;
        this.#columnModifiers = null;
        this.#rowModifiers = null;
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#animateHandler = null;
        this.#startPos = null;
        this.#movePos = null;
        this.#dragElement = null;
        this.#bounds = null;
        this.#inputMap = null;
    }

    async initialize() {
        this.#element.style.position = "relative";

        this.#sizes = await crs.call("cssgrid", "get_column_sizes", {element: this.#element});
        this.#rowCount = await crs.call("cssgrid", "row_count", {element: this.#element});
        this.#columnCount = await crs.call("cssgrid", "column_count", {element: this.#element});

        await this.#setColumnsInPx();
        await this.#createModifiers();

        (this.#element.shadowRoot || this.#element).addEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler, { passive: false });
    }

    async #setColumnsInPx() {
        const element = this.#element;

        let columns = this.#sizes.map(item => `${item}px`);
        columns[columns.length - 1] = "1fr";
        columns = columns.join(" ");

        await crs.call("cssgrid", "set_columns", { element, columns });
    }

    async #createModifiers() {
        if (this.#options.columns == null) {
            this.#options.columns = [];
            for (let i = 0; i < this.#rowCount; i++) {
                this.#options.columns.push(i);
            }
        }

        for (let column of this.#options.columns) {
            const size = getColumnX(column, this.#sizes);
            this.#columnModifiers.push(await createColumnModifier(column, size, this.#rowCount, (this.#element.shadowRoot || this.#element)));
        }
    }

    async #mouseDown(event) {
        if (event.target.dataset.type != "resize-column") return;

        const x = clientX(event);
        const y = clientY(event);

        this.#startPos = {x: x - this.#bounds.x, y: y - this.#bounds.y};
        this.#movePos = {x: x - this.#bounds.x, y: y - this.#bounds.y};
        this.#dragElement = event.target;

        event.target.style.background = "silver";

        document.addEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler, { passive: false });
        document.addEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler, { passive: false });

        event.preventDefault();
        this.#animateHandler();
    }

    async #mouseMove(event) {
        this.#movePos.x = clientX(event) - this.#bounds.x - 4;
        this.#movePos.y = clientY(event) - this.#bounds.y - 4;
        event.preventDefault();
    }

    async #mouseUp(event) {
        const x = clientX(event);
        const y = clientY(event);

        const difference = { x: x - this.#startPos.x - this.#bounds.x - 4, y: y - this.#startPos.y - this.#bounds.y - 4 };
        const column = Number(this.#dragElement.dataset.column);

        this.#dragElement.style.background = "transparent";

        document.removeEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler);
        document.removeEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler);

        this.#dragElement = null;
        this.#startPos = null;
        this.#movePos = null;
        event.preventDefault();

        await this.#resize(column, difference);
    }

    async #animate() {
        if (this.#dragElement == null) return;

        const x = this.#movePos.x;
        this.#dragElement.style.translate = `${x}px`;

        requestAnimationFrame(this.#animateHandler);
    }

    async #resize(column, difference) {
        let newSize = this.#sizes[column] + difference.x + 4;
        this.#sizes[column] = newSize;

        await crs.call("cssgrid", "set_column_width", {
            element: this.#element,
            position: column,
            width: `${newSize}px`
        })

        await this.#updateModifiers();
    }

    async #updateModifiers() {
        const elements = this.#element.querySelectorAll('[data-type="resize-column"]');
        for (const element of elements) {
            const index = Number(element.dataset.column);
            const x = getColumnX(index, this.#sizes);
            element.style.translate = `${x}px`;
        }
    }
}

async function createColumnModifier(column, x, rowSpan, parent) {
    const element = await crs.call("dom", "create_element", {
        tag_name: "div",
        styles: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "8px",
            background: "transparent",
            translate: `${x - 4}px 0`,
            cursor: 'col-resize'
        },
        dataset: {
            column: column,
            type: "resize-column"
        }
    })

    parent.appendChild(element);

    return element;
}

function getColumnX(column, sizes) {
    let size = 0;

    for (let i = 0; i <= column; i++) {
        size += sizes[i];
    }

    return size - 4;
}
