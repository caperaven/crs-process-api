import {getMouseInputMap, clientX, clientY} from "./input-mapping.js";

export class MoveManager {
    #element;
    #mouseDownHandler;
    #mouseMoveHandler;
    #mouseUpHandler;
    #moveQuery;
    #startPos;
    #bounds;
    #animateMovingHandler = this.#animateMoving.bind(this);
    #offsetX;
    #offsetY;
    #inputMap;

    constructor(element, moveQuery) {
        this.#element = element;
        this.#moveQuery = moveQuery;
        this.#mouseDownHandler = this.#mouseDown.bind(this);
        this.#mouseMoveHandler = this.#mouseMove.bind(this);
        this.#mouseUpHandler = this.#mouseUp.bind(this);

        this.#element.style.position = "fixed";
        this.#element.style.left = 0;
        this.#element.style.top = 0;

        this.#inputMap = getMouseInputMap();
        this.#element.addEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler, { passive: false });

        element.__moveManager = this;
    }

    dispose() {
        this.#element.removeEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler);
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#moveQuery = null;
        this.#startPos = null;
        this.#bounds = null;
        this.#inputMap = null;
        this.#animateMovingHandler = null;
        this.#offsetX = null;
        this.#offsetY = null;

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
        if (this.#matches(event) === false || event.target.dataset.ignore === "true")
            return;

        this.#startPos = {x: clientX(event), y: clientY(event)};

        this.#bounds = this.#element.getBoundingClientRect();
        this.#element.style.willChange = "translate";

        document.addEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler, { passive: false });
        document.addEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler, { passive: false });

        this.#animateMovingHandler();
        event.preventDefault();
        event.stopPropagation();
    }

    async #animateMoving() {
        if (this.#startPos == null) return;

        const xCoordinate = Math.round((this.#bounds.x + this.#offsetX));
        const yCoordinate = Math.round((this.#bounds.y + this.#offsetY));

        this.#element.style.translate = `${xCoordinate}px ${yCoordinate}px`;
        requestAnimationFrame(this.#animateMovingHandler);
    }

    async #mouseMove(event) {
        this.#offsetX = clientX(event) - this.#startPos.x;
        this.#offsetY = clientY(event) - this.#startPos.y;
        event.preventDefault();
        event.stopPropagation();
    }

    async #mouseUp(event) {
        document.removeEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler);
        document.removeEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler);
        this.#startPos = null;
        this.#bounds = null;
        this.#offsetX = null;
        this.#offsetY = null;
        event.preventDefault();
        event.stopPropagation();
    }
}