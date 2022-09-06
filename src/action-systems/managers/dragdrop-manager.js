import {ensureOptions} from "./dragdrop-manager/options.js";
import {applyPlaceholder} from "./dragdrop-manager/placeholder-type.js";
import {drop} from "./dragdrop-manager/drop.js";
import {startDrag, updateDrag} from "./dragdrop-manager/drag.js";

export class DragDropManager {
    constructor(element, options) {
        this._element = element;
        this._options = ensureOptions(options);

        this._mouseDownHandler = this.mouseDown.bind(this);
        this._mouseMoveHandler = this.mouseMove.bind(this);
        this._mouseUpHandler = this.mouseUp.bind(this);
        this._mouseOverHandler = this.mouseOver.bind(this);

        this._element.addEventListener("mousedown", this._mouseDownHandler);
    }

    dispose() {
        this._element.removeEventListener("mousedown", this._mouseDownHandler);

        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;
        this._mouseOverHandler = null;
    }

    async mouseDown(event) {
        event.preventDefault();

        if (this._isBusy == true) return;

        this._startPoint = {x: event.clientX, y: event.clientY};
        this._movePoint = {x: event.clientX, y: event.clientY};

        const element = getDraggable(event, this._options);
        if (element == null) return;

        this._dragElement = element;
        this._placeholder = await applyPlaceholder(element, this._options);
        await startDrag(this._dragElement);

        document.addEventListener("mousemove", this._mouseMoveHandler);
        document.addEventListener("mouseup", this._mouseUpHandler);

        this._updateDragHandler = updateDrag.bind(this);
        this._updateDragHandler();
    }

    async mouseMove(event) {
        event.preventDefault();
        this._movePoint.x = event.clientX;
        this._movePoint.y = event.clientY;
    }

    async mouseUp(event) {
        this._isBusy = true;
        event.preventDefault();
        this._updateDragHandler = null;
        this._movePoint = null;
        this._startPoint = null;

        document.removeEventListener("mousemove", this._mouseMoveHandler);
        document.removeEventListener("mouseup", this._mouseUpHandler);

        await drop(this._dragElement, this._placeholder, this._options);

        delete this._dragElement;
        delete this._placeholder;
        this._isBusy = false;
    }

    async mouseOver(event) {

    }
}

/**
 * From the event get the element that can be dragged.
 * @param event
 * @param options
 * @returns {null|any}
 */
function getDraggable(event, options) {
    if (event.target.matches(options.dragQuery)) {
        return event.target;
    }

    if (event.target.parentElement?.matches(options.dragQuery)) {
        return event.target.parentElement;
    }

    return null;
}
