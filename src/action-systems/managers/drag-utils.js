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