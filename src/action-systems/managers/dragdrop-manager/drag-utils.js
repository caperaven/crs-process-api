/**
 * Returns the draggable element based on a given event and options.
 *
 * @param {Event} event - The event object that triggers the drag action.
 * @param {Object} [options] - An optional object that can contain the following properties:
 * @param {string} [options.dragQuery="[draggable='true']"] - A CSS selector to identify draggable elements.
 *
 * @returns {Element} The draggable element if found, or null if not found.
 */
export function getDraggable(event, options) {
    const dragQuery = options?.dragQuery || "[draggable='true']";

    if (event.target.matches(dragQuery)) {
        return event.target;
    }

    if (event.target.parentElement?.matches(dragQuery)) {
        return event.target.parentElement;
    }

    const shadowElement = event.target.shadowRoot?.querySelector(dragQuery);
    if (shadowElement != null) {
        return shadowElement
    }

    return null;
}

/**
 * From the element calculate the element bounds and then calculate the auto scroll hotspots
 * @param element
 * @param opts
 * @returns {*[]}
 */
export function getScrollAreas(element, opts) {
    const size = 32;
    const bounds = element.getBoundingClientRect();
    const areas = {};

    const x1 = bounds.left;
    const y1 = bounds.top;
    const x2 = bounds.left + bounds.width - size;
    const y2 = bounds.top + bounds.height - size;

    if (opts.indexOf("h") != -1) {
        areas.left = {x1: x1, y1: y1, x2: x1 + size, y2: y2};
        areas.right = {x1: x2, y1: y1, x2: x2 + size, y2};
    }

    if (opts.indexOf("v") != -1) {
        areas.top = {x1: x1, y1: y1, x2: x2, y2: y1 + size};
        areas.bottom = {x1: x1, y1: y2, x2: x2, y2: y2 + size};
    }

    return areas;
}

/**
 * Is the x and y coordinate in the defined area.
 * @param x
 * @param y
 * @param area
 */
export function inArea(x, y, area) {
    const inX = x >= area.x1 && x <= area.x2;
    const inY = y >= area.y1 && y <= area.y2;
    return inX && inY;
}