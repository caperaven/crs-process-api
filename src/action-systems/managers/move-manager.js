export class MoveManager {
    #element;
    #mouseDownHandler;
    #mouseMoveHandler;
    #mouseUpHandler;
    #moveQuery;
    #startPos;
    #bounds;

    constructor(element, moveQuery) {
        this.#element = element;
        this.#moveQuery = moveQuery;
        this.#mouseDownHandler = this.#mouseDown.bind(this);
        this.#mouseMoveHandler = this.#mouseMove.bind(this);
        this.#mouseUpHandler = this.#mouseUp.bind(this);

        this.#element.style.position = "fixed";
        this.#element.style.left = 0;
        this.#element.style.top = 0;

        this.#element.addEventListener("mousedown", this.#mouseDownHandler);
        element.__moveManager = this;
    }

    dispose() {
        this.#element.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;

        delete this.#element.__moveManager;
        this.#element = null;
    }

    /**
     * Checks whether an event matches a specific element or its shadow root.
     * @param {Event} event - The event to check.
     * @returns {boolean} - Returns true if the event matches the element or its shadow root, and false otherwise.
     */
    #matches(event) {
        const path = event.composedPath();
        const target = path[0];
        // If no query is specified, return true if the event target is the element
        if (this.#moveQuery == null) {
            return target === this.#element;
        }

        // If the event target matches the query, return true
        if (target.matches(this.#moveQuery)) {
            return true;
        }

        // If the matching element is further down the event path, return true
        const match = path.find(element => element.matches && element.matches(this.#moveQuery));
        return match != null;
    }


    async #mouseDown(event) {
        if (this.#matches(event) === false)
            return;

        event.preventDefault();
        this.#startPos = {x: event.clientX, y: event.clientY};
        this.#bounds = this.#element.getBoundingClientRect();

        document.addEventListener("mousemove", this.#mouseMoveHandler);
        document.addEventListener("mouseup", this.#mouseUpHandler);
    }

    async #mouseMove(event) {
        let offsetX = event.clientX - this.#startPos.x;
        let offsetY = event.clientY - this.#startPos.y;

        this.#element.style.translate = `${this.#bounds.x + offsetX}px ${this.#bounds.y + offsetY}px`;
    }

    async #mouseUp(event) {
        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);
        this.#startPos = null;
        this.#bounds = null;
    }
}
