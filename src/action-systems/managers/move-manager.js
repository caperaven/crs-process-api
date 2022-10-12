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
        if (this.#moveQuery == null && event.target != this.#element) return;
        if (this.#moveQuery != null && event.target.matches(this.#moveQuery) == false) return;

        this.#startPos = {x: event.clientX, y: event.clientY};
        this.#bounds = this.#element.getBoundingClientRect();

        console.log(this.#bounds);

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
