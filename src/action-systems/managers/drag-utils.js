/**
 * From the event get the element that can be dragged.
 * @param event
 * @param options
 * @returns {null|any}
 */
export function getDraggable(event, options) {
    const dragQuery = options?.dragQuery || "[draggable='true']";

    if (event.target.matches(dragQuery)) {
        return event.target;
    }

    if (event.target.parentElement?.matches(dragQuery)) {
        return event.target.parentElement;
    }

    return null;
}

export function getScrollAreas(element, opts) {
    const size = 32;
    const bounds = element.getBoundingClientRect();
    const areas = [];

    const x1 = bounds.left;
    const y1 = bounds.top;
    const x2 = bounds.left + bounds.width - size;
    const y2 = bounds.top + bounds.height - size;

    if (opts.indexOf("h") != -1) {
        areas.push(
            // left
            { x1: x1, y1: y1, x2: x1 + size, y2: y2 },
            // right
            { x1: x2, y1: y1, x2: x2 + size, y2 }
        )
    }

    if (opts.indexOf("v") != -1) {
        areas.push(
            // top
            { x1: x1, y1: y1, x2: x2, y2: y1 + size },
            // bottom
            { x1: x1, y1: y2, x2: x2, y2: y2 + size }
        )
    }

    return areas;
}