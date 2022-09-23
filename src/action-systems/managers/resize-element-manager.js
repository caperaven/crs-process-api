import {getDraggable} from "./dragdrop-manager/drag-utils.js";

export class ResizeElementManager {
    constructor(element, resizeQuery, options) {
        this._element = element;
        this._resizeQuery = resizeQuery;
        this._options = options;

        this._mouseDownHandler = this.mouseDown.bind(this);
        this._mouseMoveHandler = this.mouseMove.bind(this);
        this._mouseUpHandler = this.mouseUp.bind(this);

        this._element.addEventListener("mousedown", this._mouseDownHandler);
        element.__resizeManager = this;
    }

    dispose() {
        this._element.removeEventListener("mousedown", this._mouseDownHandler);
        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;

        delete this._element.__resizeManager;
        delete this._element;
        delete this._resizeQuery;
        delete this._options;
    }

    mouseDown(event) {
        const draggable = getDraggable(event, {dragQuery: this._resizeQuery});
        if (draggable == null) return;

        this._targetElement = draggable.parentElement;
        this._bounds = this._targetElement.getBoundingClientRect();
        this._startPos = {x: event.clientX, y: event.clientY};

        this._options.min = this._options.min || {};
        this._options.min.width = this._options.min.width || this._bounds.width;
        this._options.min.height = this._options.min.height || this._bounds.height;

        this._options.max = this._options.max || {};
        this._options.max.width = this._options.max.width || Number.MAX_VALUE;
        this._options.max.height = this._options.max.height || Number.MAX_VALUE;

        document.addEventListener("mousemove", this._mouseMoveHandler);
        document.addEventListener("mouseup", this._mouseUpHandler);
    }

    mouseMove(event) {
        let offsetX = event.clientX - this._startPos.x;
        let offsetY = event.clientY - this._startPos.y;

        if (this._options.lock_axis == "x") {
            offsetY = 0;
        }

        if (this._options.lock_axis == "y") {
            offsetX = 0;
        }

        let width = this._bounds.width + offsetX;
        let height = this._bounds.height + offsetY;

        width = width < this._options.min.width ? this._options.min.width : width > this._options.max.width ? this._options.max.width : width;
        height = height < this._options.min.height ? this._options.min.height : height > this._options.max.height ? this._options.max.height : height;

        this._targetElement.style.width = `${width}px`;
        this._targetElement.style.height = `${height}px`;
    }

    mouseUp(event) {
        document.removeEventListener("mousemove", this._mouseMoveHandler);
        document.removeEventListener("mouseup", this._mouseUpHandler);

        delete this._targetElement;
        this._bounds = null;
        this._startPos = null;
    }
}
