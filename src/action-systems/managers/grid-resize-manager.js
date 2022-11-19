export class CSSGridResizeManager {
    #element;
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

    constructor(element, options) {
        this.#element = element;
        this.#element.__cssGridResizeMananger = this;
        this.#options = options;
    }

    dispose() {
        this.#element.removeEventListener("mousedown", this.#mouseDownHandler);

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
    }

    async initialize() {
        this.#element.style.position = "relative";

        this.#sizes = await crs.call("cssgrid", "get_column_sizes", {element: this.#element});
        this.#rowCount = await crs.call("cssgrid", "row_count", {element: this.#element});
        this.#columnCount = await crs.call("cssgrid", "column_count", {element: this.#element});

        for (let column of this.#options.columns || []) {
            const size = this.#sizes[column];
            this.#columnModifiers.push(await createColumnModifier(column, size, this.#rowCount, this.#element));
        }

        this.#element.addEventListener("mousedown", this.#mouseDownHandler);
    }

    async #mouseDown(event) {
        if (event.target.dataset.type != "resize-column") return;

        this.#startPos = {x: event.clientX, y: event.clientY};
        this.#movePos = {x: event.clientX, y: event.clientY};
        this.#dragElement = event.target;

        event.target.style.background = "silver";

        document.addEventListener("mousemove", this.#mouseMoveHandler);
        document.addEventListener("mouseup", this.#mouseUpHandler);

        event.preventDefault();
        this.#animateHandler();
    }

    async #mouseMove(event) {
        this.#movePos.x = event.clientX;
        this.#movePos.y = event.clientY;
        event.preventDefault();
    }

    async #mouseUp(event) {
        const difference = { x: event.clientX - this.#startPos.x, y: event.clientY - this.#startPos.y };
        const column = Number(this.#dragElement.dataset.column);

        this.#dragElement.style.background = "transparent";

        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);

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
        const newSize = this.#sizes[column] + difference.x + 4;
        this.#sizes[column] = newSize;

        await crs.call("cssgrid", "set_column_width", {
            element: this.#element,
            position: column,
            width: `${newSize}px`
        })
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