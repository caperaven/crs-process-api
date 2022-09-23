/**
 * Create the appropriate placeholder and apply it to the screen.
 * The placeholder is also returned for later use.
 * @param element
 * @param options
 * @returns {Promise<*>}
 */
export async function applyPlaceholder(element, options) {
    const bounds = element.getBoundingClientRect();
    element._bounds = bounds;

    const placeholder = await Placeholder[options.drag.placeholderType](element, bounds, options);
    placeholder._bounds = bounds;

    element.style.width = `${bounds.width}px`;
    element.style.height = `${bounds.height}px`;

    element.parentElement.replaceChild(placeholder, element);

    return placeholder;
}

class Placeholder {
    /**
     * Create an element that will replace the existing item being dragged
     * @param element: element being dragged
     * @param bounds: element client bounding rect
     * @returns {Promise<void>}
     */
    static async standard(element, bounds) {
        return await crs.call("dom", "create_element", {
            classes: ["placeholder"],
            styles: {
                width: `${bounds.width}px`,
                height: `${bounds.height}px`
            }
        })
    }

    /**
     * Create a copy of the element and set its opacity
     * @param element
     * @returns {Promise<void>}
     */
    static async opacity(element, bounds, options) {
        const result = element.cloneNode(true);
        result.style.opacity = options.drag.opacity || 0.5;
        return result;
    }

    static async none(element, bounds, options) {
        return element.cloneNode(true);
    }
}