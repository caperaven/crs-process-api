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

    #mouseDown(event) {
        // If the move query is null, check if the event target is the same as the element
        if (this.#moveQuery == null) {
            if (event.target != this.#element) {
                return; // The event target does not match the element, so do nothing
            }
        }
        // If the move query is not null, check if the event target or its shadow root matches the query
        else {
            let matches = event.target.matches(this.#moveQuery);
            if (matches === false && event.target.shadowRoot != null) {
                matches ||= event.target.shadowRoot.querySelector(this.#moveQuery) != null;
            }
            if (matches === false) {
                return; // The event target or its shadow root do not match the query, so do nothing
            }
        }

        this.#startPos = {x: event.clientX, y: event.clientY};
        this.#bounds = this.#element.getBoundingClientRect();

        document.addEventListener("mousemove", this.#mouseMoveHandler);
        document.addEventListener("mouseup", this.#mouseUpHandler);
    }

    #mouseMove(event) {
        let offsetX = event.clientX - this.#startPos.x;
        let offsetY = event.clientY - this.#startPos.y;

        this.#element.style.translate = `${this.#bounds.x + offsetX}px ${this.#bounds.y + offsetY}px`;
    }

    #mouseUp(event) {
        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);
        this.#startPos = null;
        this.#bounds = null;
    }
}
