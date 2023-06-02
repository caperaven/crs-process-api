import {getDraggable} from "./dragdrop-manager/drag-utils.js";
import {getMouseInputMap, clientX, clientY} from "./input-mapping.js";

export class ResizeElementManager {
    #element;
    #region;
    #resizeQuery;
    #options;
    #mouseDownHandler;
    #mouseMoveHandler;
    #mouseUpHandler;
    #targetElement;
    #bounds;
    #startPos;
    #inputMap;

    constructor(element, resizeQuery, options) {
        this.#element = element;
        this.#region = element.getBoundingClientRect();
        this.#resizeQuery = resizeQuery;
        this.#options = options;

        this.#mouseDownHandler = this.#mouseDown.bind(this);
        this.#mouseMoveHandler = this.#mouseMove.bind(this);
        this.#mouseUpHandler = this.#mouseUp.bind(this);

        this.#inputMap = getMouseInputMap();

        this.#element.addEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler);
        element.__resizeManager = this;
    }

    dispose() {
        this.#element.removeEventListener(this.#inputMap["mousedown"], this.#mouseDownHandler);
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#targetElement = null;
        this.#bounds = null;
        this.#startPos = null;
        this.#resizeQuery = null;
        this.#options = null;
        this.#region = null;
        this.#inputMap = null;

        delete this.#element.__resizeManager;
        this.#element = null;
    }

    #mouseDown(event) {
        const draggable = getDraggable(event, {drag : { query: this.#resizeQuery }});
        if (draggable == null) return;
        event.preventDefault();

        // Parent element will be null if the parent is a shadowRoot
        // In that case, composedPath()[2] is the parent element and composedPath()[1] is the shadowRoot
        this.#targetElement = draggable.parentElement || event.composedPath()[2];

        if (this.#options.zIndex != null) {
            this.#targetElement.style.zIndex = this.#options.zIndex;
        }

        if (this.#options.dropShadow == true) {
            this.#targetElement.style.filter = "var(--drop-shadow)";
        }

        this.#bounds = this.#targetElement.getBoundingClientRect();
        this.#startPos = {x: clientX(event), y: clientY(event)};

        this.#options.min = this.#options.min || {};
        this.#options.min.width = this.#options.min.width || this.#bounds.width;
        this.#options.min.height = this.#options.min.height || this.#bounds.height;

        this.#options.max = this.#options.max || {};
        this.#options.max.width = this.#options.max.width || Number.MAX_VALUE;
        this.#options.max.height = this.#options.max.height || Number.MAX_VALUE;

        document.addEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler);
        document.addEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler);
    }

    #mouseMove(event) {
        let offsetX = clientX(event) - this.#startPos.x;
        let offsetY = clientY(event) - this.#startPos.y;

        if (this.#options.lock_axis == "x") {
            offsetY = 0;
        }

        if (this.#options.lock_axis == "y") {
            offsetX = 0;
        }

        let width = this.#bounds.width + offsetX - 4;
        let height = this.#bounds.height + offsetY - 4;

        width = width < this.#options.min.width ? this.#options.min.width : width > this.#options.max.width ? this.#options.max.width : width;
        height = height < this.#options.min.height ? this.#options.min.height : height > this.#options.max.height ? this.#options.max.height : height;

        this.#targetElement.style.width = `${width}px`;
        this.#targetElement.style.height = `${height}px`;
    }

    #mouseUp(event) {
        if (this.#options.zIndex != null) {
            this.#targetElement.style.zIndex = "";
        }

        if (this.#options.dropShadow == true) {
            this.#targetElement.style.filter = "";
        }

        let targetElement = this.#targetElement;

        document.removeEventListener(this.#inputMap["mousemove"], this.#mouseMoveHandler);
        document.removeEventListener(this.#inputMap["mouseup"], this.#mouseUpHandler);

        this.#targetElement = null;
        this.#bounds = null;
        this.#startPos = null;

        if (this.#options.callback) {
            this.#options.callback(targetElement);
        }
    }
}
