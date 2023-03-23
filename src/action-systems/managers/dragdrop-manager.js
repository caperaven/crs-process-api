import {ensureOptions} from "./dragdrop-manager/options.js";
import {applyPlaceholder} from "./dragdrop-manager/placeholder.js";
import {drop, allowDrop} from "./dragdrop-manager/drop.js";
import {startDrag, updateDrag} from "./dragdrop-manager/drag.js";
import {getDraggable, getScrollAreas} from "./dragdrop-manager/drag-utils.js";
import {updateMarker} from "./dragdrop-manager/marker.js";
import {startMarker} from "./dragdrop-manager/marker.js";

/**
 * @class DragDropManager - enable drag and drop operations on an element
 * Though you can drag from the source to a different target, we only need to define the source.
 * The target will be defined in the allow drop operation.
 * This can be either a css query or a callback.
 */
export class DragDropManager {
    /**
     * @field - The element that drag and drop has been enabled on
     * This is more often than not the container or source of the drag operation
     * @type {HTMLElement}
     */
    #element;
    /**
     * @field - The target of the drag operation
     * On the mouse move this is the element that the mouse is over
     * @type {HTMLElement}
     */
    #target;
    /**
     * @field - The last target of the drag operation
     * On the mouse move this is the element that the mouse was over
     * This is used for optimization so that actions only fire once the target changes
     */
    #lastTarget;
    /**
     * @field - The placeholder element
     * This is the element that shows where the element you are dragging was origionally
     */
    #placeholder;
    /**
     * @field - The element that is being dragged
     */
    #dragElement;
    /**
     * @field - The marker element that moves around the page as you drag to indicate where the drop will happen.
     */
    #marker;
    /**
     * @field - The options for the drag and drop operation
     * This was passed to us from the enable_dragdrop call
     */
    #options;
    /**
     * @field - The mouse down handler
     */
    #mouseDownHandler;
    /**
     * @field - The mouse move handler
     */
    #mouseMoveHandler;
    /**
     * @field - The mouse up handler
     */
    #mouseUpHandler;
    /**
     * @field - The scroll areas is defined hotspots that are used to scroll the page
     * This is only used if you have set autoScroll to true in the options
     */
    #scrollAreas;
    /**
     * @field - The start point of the drag operation
     * This is the point that the mouse was at when the drag operation started
     */
    #startPoint;
    /**
     * @field - The move point of the drag operation
     * This is the point that the mouse is currently at
     */
    #movePoint;
    /**
     * @field - The busy field is used to prevent timing issues.
     */
    #isBusy;
    /**
     * @field - The update drag handler is used to update the drag operation
     * This is a timer so, we want to call updateDrag on each tick.
     * This is used to update the position of the drag element.
     */
    #updateDragHandler;
    /**
     * @field - The update marker handler is used to update the marker operation
     * This is a timer so, we want to call updateMarker on each tick.
     * The lastTarget and target is used to determine changes and thus updates.
     */
    #updateMarkerHandler;
    /**
     * You can define a process step as the allow drop check.
     * If you want this, you will need to define the context for the process if relevant
     */
    #context;
    /**
     * @field - In some cases we need access to the mouse event.
     * Due to the nature of the event system, we need to cache the event so that utility functions can access it
     * regardless to the call stack.
     */
    #moveEvent;
    /**
     * @field - The bounds cache is used to cache the bounds of the elements that are being dragged over.
     * Since we don't want to calculate bounds on every mouse move, we cache them.
     * This however means that once you drop the element, you will need to recalculate the bounds.
     * This cache keeps track of what we have changes so that we can clear it.
     * This happens on the mouse up event.
     * @type {[]}
     */
    #boundsCache = [];

    get element() {
        return this.#element;
    }

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

    get lastTarget() {
        return this.#lastTarget;
    }

    set lastTarget(value) {
        this.#lastTarget = value;
    }

    get boundsCache() {
        return this.#boundsCache;
    }

    constructor(element, options, context) {
        this.#element = element;
        this.#context = context;
        this.#options = ensureOptions(options);

        this.#mouseDownHandler = this.#mouseDown.bind(this);
        this.#mouseMoveHandler = this.#mouseMove.bind(this);
        this.#mouseUpHandler = this.#mouseUp.bind(this);

        if (this.#options.autoScroll != null) {
            this.#scrollAreas = getScrollAreas(this.#element, this.#options.autoScroll);
        }

        (this.#element.shadowRoot == null ? this.#element : this.#element.shadowRoot).addEventListener("mousedown", this.#mouseDownHandler);
        this.#element.__dragDropManager = this;
    }

    dispose() {
        (this.#element.shadowRoot == null ? this.#element : this.#element.shadowRoot).removeEventListener("mousedown", this.#mouseDownHandler);

        this.#element = null;
        this.#lastTarget = null;

        this.#context = null;
        this.#options = null;
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
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

        this.#marker = await startMarker.call(this, this.#dragElement);
        this.#updateMarkerHandler = updateMarker.bind(this);
        this.#updateMarkerHandler();
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
        this.#lastTarget = null;

        if (this.#marker) {
            this.#marker.remove();
            this.#marker = null;
        }

        for (const element of this.#boundsCache) {
            element.__bounds = null;
        }

        this.#boundsCache.length = 0;
        delete this.#options.currentAction;
    }

    async #mouseOver(event) {
        console.log(event);
    }

    async validateDropTarget(element) {
        this.#options.currentAction = "hover";
        return allowDrop(this.#moveEvent, element, this.#options);
    }
}
