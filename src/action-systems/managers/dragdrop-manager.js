import {ensureOptions} from "./dragdrop-manager/options.js";
import {applyPlaceholder} from "./dragdrop-manager/placeholder.js";
import {drop, allowDrop} from "./dragdrop-manager/drop.js";
import {startDrag, updateDrag} from "./dragdrop-manager/drag.js";
import {getDraggable} from "./dragdrop-manager/drag-utils.js";
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
     * @field - The element that the event is attached too
     */
    #eventElement;
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
     * @field - The bounds cache is used to cache the bounds of the elements that are being dragged over.
     * Since we don't want to calculate bounds on every mouse move, we cache them.
     * This however means that once you drop the element, you will need to recalculate the bounds.
     * This cache keeps track of what we have changes so that we can clear it.
     * This happens on the mouse up event.
     * @type {[]}
     */
    #boundsCache = [];

    /**
     * @field - The composed path is used to get the path of the event.
     * There are a number of functions that want to check the composed path.
     * Instead of passing the event on hand doing the work several times, we just do it once and cache it.
     * Since functions are called with the manager as "this" they have access to the composed path.
     */
    #composedPath;

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

    get composedPath() {
        return this.#composedPath;
    }

    /**
     * @constructor
     * @param element {HTMLElement} - The container element that drag and drop has been enabled on
     * @param options {Object} - The options for the drag and drop operation
     */
    constructor(element, options) {
        this.#element = element;
        this.#element.style.userSelect = "none";
        
        this.#options = ensureOptions(options);

        this.#mouseDownHandler = this.#mouseDown.bind(this);
        this.#mouseMoveHandler = this.#mouseMove.bind(this);
        this.#mouseUpHandler = this.#mouseUp.bind(this);

        this.#eventElement = this.#element.shadowRoot == null ? this.#element : this.#element.shadowRoot;
        this.#eventElement.addEventListener("mousedown", this.#mouseDownHandler);
        this.#element.__dragDropManager = this;
    }

    dispose() {
        this.#eventElement.removeEventListener("mousedown", this.#mouseDownHandler);

        this.#eventElement = null;
        this.#element = null;
        this.#lastTarget = null;
        this.#options = null;
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;
        this.#startPoint = null;
        this.#movePoint = null;
        this.#placeholder = null;
        this.#dragElement = null;
        this.#isBusy = null;
        this.#updateDragHandler = null;
        this.#updateMarkerHandler = null;
        this.#target = null;
        this.#marker = null;
        this.#composedPath = null;
        this.#boundsCache = null;
    }

    /**
     * @method - The mouse down handler starts the drag process and initializes resources required to help with the drag and drop operation
     * This would include the dragging of the element, the marker, and the placeholder.
     * @param event
     * @returns {Promise<void>}
     */
    async #mouseDown(event) {
        event.preventDefault();
        this.#composedPath = event.composedPath();

        if (this.#isBusy == true) return;

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

    /**
     * @method - The mouse move handler is used to update the drag and marker operations.
     * Most of the logic is handled by the updateDrag and updateMarker timer functions.
     * This method is used to update the values required for the drag and drop operations.
     * @param event
     * @returns {Promise<void>}
     */
    async #mouseMove(event) {
        event.preventDefault();
        this.#composedPath = event.composedPath();

        this.#movePoint.x = event.clientX;
        this.#movePoint.y = event.clientY;
        this.#target = event.target || event.composedPath()[0];
    }

    /**
     * @method - The mouse up handler is used to end the drag and drop operation.
     * This stops the drag and drop operations and cleans up the resources used.
     * @param event
     * @returns {Promise<void>}
     */
    async #mouseUp(event) {
        this.#isBusy = true;
        event.preventDefault();
        this.#composedPath = event.composedPath();

        this.#updateDragHandler = null;
        this.#updateMarkerHandler = null;
        this.#movePoint = null;
        this.#startPoint = null;

        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);

        if (this.#marker) {
            this.#marker.remove();
            this.#marker = null;
        }

        await drop.call(this, this.#dragElement, this.#placeholder, this.#options);

        this.#dragElement = null;
        this.#placeholder = null;
        this.#target = null;
        this.#isBusy = false;
        this.#lastTarget = null;

        for (const element of this.#boundsCache) {
            element._bounds = null;
        }

        this.#boundsCache.length = 0;
        delete this.#options.currentAction;
        this.#composedPath = null;
    }

    /**
     * @method - This method is used to validate the drop target during the move operation.
     * This is used to determine if the drop target is valid and if the drop operation can be performed.
     * If the drop target is not valid you don't want to update the position of the marker.
     * Most of the logic is deferred to the allowDrop function passed on using the options.
     * @param element {HTMLElement} - The element that is being hovered over
     * @returns {Promise<*>}
     */
    async validateDropTarget(element) {
        this.#options.currentAction = "hover";
        return allowDrop.call(this, element, this.#options);
    }
}
