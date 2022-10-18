import {ensureOptions} from "./dragdrop-manager/options.js";
import {applyPlaceholder} from "./dragdrop-manager/placeholder.js";
import {drop} from "./dragdrop-manager/drop.js";
import {startDrag, updateDrag} from "./dragdrop-manager/drag.js";
import {getDraggable, getScrollAreas} from "./dragdrop-manager/drag-utils.js";

export class DragDropManager {
    constructor(element, options) {
        this._element = element;
        this._options = ensureOptions(options);

        this._mouseDownHandler = this.mouseDown.bind(this);
        this._mouseMoveHandler = this.mouseMove.bind(this);
        this._mouseUpHandler = this.mouseUp.bind(this);
        this._mouseOverHandler = this.mouseOver.bind(this);

        if (options.autoScroll != null) {
            this._scrollAreas = getScrollAreas(this._element, options.autoScroll);
        }

        this._element.addEventListener("mousedown", this._mouseDownHandler);
        this._element.__dragDropManager = this;
    }

    dispose() {
        this._element.removeEventListener("mousedown", this._mouseDownHandler);

        this._scrollAreas = null;
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

        this._placeholder = await applyPlaceholder(element, this._options);
        this._dragElement = await startDrag(element, this._options);

        document.addEventListener("mousemove", this._mouseMoveHandler);
        document.addEventListener("mouseup", this._mouseUpHandler);

        this._updateDragHandler = updateDrag.bind(this);
        this._updateDragHandler();
    }

    async mouseMove(event) {
        event.preventDefault();
        this._movePoint.x = event.clientX;
        this._movePoint.y = event.clientY;
        this._target = event.target;
    }

    async mouseUp(event) {
        this._isBusy = true;
        event.preventDefault();
        this._updateDragHandler = null;
        this._movePoint = null;
        this._startPoint = null;

        document.removeEventListener("mousemove", this._mouseMoveHandler);
        document.removeEventListener("mouseup", this._mouseUpHandler);

        await drop(event, this._dragElement, this._placeholder, this._options);

        delete this._dragElement;
        delete this._placeholder;
        delete this._target;
        this._isBusy = false;
    }

    async mouseOver(event) {

    }
}
