/**
 * Returns the draggable element based on a given event and options.
 * If the element matches the query, then you move that element.
 * If the element's parent matches the query, then you move the parent.
 * Sometimes the item that you interact with is not the item you are dragging.
 * In that case, you can use the cpIndex option to specify the index of the element to move.
 *
 * @param {Event} event - The event object that triggers the drag action.
 * @param {Object} [options] - An optional object that can contain the following properties:
 * @param {string} [options.drag.query="[draggable='true']"] - A CSS selector to identify draggable elements.
 * @param {number} [options.cpIndex] - The index of the composed path to use as the draggable element.
 * @returns {Element} The draggable element if found, or null if not found.
 */
export function getDraggable(event, options) {
    const dragQuery = options.drag?.query || "[draggable='true']";
    const cp = event.composedPath();
    const target = cp[0];

    if (target.matches(dragQuery)) {
        if (options.drag.cpIndex != null) {
            return cp[options.drag.cpIndex];
        }
        return target;
    }

    if (target.parentElement?.matches(dragQuery)) {
        return target.parentElement;
    }

    return null;
}