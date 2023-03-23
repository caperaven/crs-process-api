import {ensureOptions} from "./dragdrop-manager/options.js";
import {applyPlaceholder} from "./dragdrop-manager/placeholder.js";
import {drop, allowDrop} from "./dragdrop-manager/drop.js";
import {startDrag, updateDrag} from "./dragdrop-manager/drag.js";
import {getDraggable, getScrollAreas} from "./dragdrop-manager/drag-utils.js";
import {updateMarker} from "./dragdrop-manager/marker.js";
import {startMarker} from "./dragdrop-manager/marker.js";

export class DragDropManager {
    #element;
    #options;
    #mouseDownHandler;
    #mouseMoveHandler;
    #mouseUpHandler;
    #mouseOverHandler;
    #scrollAreas;
    #startPoint;
    #movePoint;
    #placeholder;
    #dragElement;
    #isBusy;
    #updateDragHandler;
    #updateMarkerHandler;
    #target;
    #context;
    #marker;
    #moveEvent;

    get updateDragHandler() {
        return this.#updateDragHandler;
    }

    get updateMarkerHandler() {
        return this.#updateMarkerHandler;
    }

    get dragElement() {
        return this.#dragElement;
    }

    get movePoint() {
        return this.#movePoint;
    }

    get startPoint() {
        return this.#startPoint;
    }

    get scrollAreas() {
        return this.#scrollAreas;
    }

    get target() {
        return this.#target;
    }

    get marker() {
        return this.#marker;
    }

    constructor(element, options, context) {
        this.#element = element;
        this.#context = context;
        this.#options = ensureOptions(options);

        this.#mouseDownHandler = this.#mouseDown.bind(this);
        this.#mouseMoveHandler = this.#mouseMove.bind(this);
        this.#mouseUpHandler = this.#mouseUp.bind(this);
        this.#mouseOverHandler = this.#mouseOver.bind(this);

        if (this.#options.autoScroll != null) {
            this.#scrollAreas = getScrollAreas(this.#element, this.#options.autoScroll);
        }

        (this.#element.shadowRoot == null ? this.#element : this.#element.shadowRoot).addEventListener("mousedown", this.#mouseDownHandler);
        this.#element.__dragDropManager = this;
    }

    dispose() {
        (this.#element.shadowRoot == null ? this.#element : this.#element.shadowRoot).removeEventListener("mousedown", this.#mouseDownHandler);

        this.#element = null;
        this.#context = null;
        this.#options = null;
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#mouseOverHandler = null;
        this.#scrollAreas = null;
        this.#startPoint = null;
        this.#movePoint = null;
        this.#placeholder = null;
        this.#dragElement = null;
        this.#isBusy = null;
        this.#updateDragHandler = null;
        this.#updateMarkerHandler = null;
        this.#target = null;
        this.#context = null;
        this.#marker = null;
    }

    async #mouseDown(event) {
        event.preventDefault();

        if (this.#isBusy == true) return;

        this.#moveEvent = event;
        this.#startPoint = {x: event.clientX, y: event.clientY};
        this.#movePoint = {x: event.clientX, y: event.clientY};

        const element = getDraggable(event, this.#options);
        if (element == null) return;

        this.#placeholder = await applyPlaceholder(element, this.#options);
        this.#dragElement = await startDrag(element, this.#options);
        this.#target = this.#placeholder;

        document.addEventListener("mousemove", this.#mouseMoveHandler);
        document.addEventListener("mouseup", this.#mouseUpHandler);

        this.#updateDragHandler = updateDrag.bind(this);
        this.#updateDragHandler();

        if (this.#options.marker === true) {
            this.#marker = await startMarker(this.#dragElement);

            this.#updateMarkerHandler = updateMarker.bind(this);
            this.#updateMarkerHandler();
        }
    }

    async #mouseMove(event) {
        event.preventDefault();
        this.#moveEvent = event;
        this.#movePoint.x = event.clientX;
        this.#movePoint.y = event.clientY;
        this.#target = event.target || event.composedPath()[0];
    }

    async #mouseUp(event) {
        this.#isBusy = true;
        event.preventDefault();
        this.#updateDragHandler = null;
        this.#updateMarkerHandler = null;
        this.#movePoint = null;
        this.#startPoint = null;

        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);

        await drop(event, this.#dragElement, this.#placeholder, this.#options, this.#context);

        this.#dragElement = null;
        this.#placeholder = null;
        this.#target = null;
        this.#isBusy = false;
        this.#moveEvent = null;

        if (this.#marker) {
            this.#marker.remove();
            this.#marker = null;
        }
    }

    async #mouseOver(event) {
        console.log(event);
    }

    async validateDropTarget(element) {
        return allowDrop(this.#moveEvent, element, this.#options);
    }
}
