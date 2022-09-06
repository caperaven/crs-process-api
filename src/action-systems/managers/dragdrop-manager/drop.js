/**
 * Handle the actions when the mouse is released and the drop action takes place.
 * @param dragElement
 * @param placeholder
 * @param options
 * @returns {Promise<void>}
 */
export async function drop(dragElement, placeholder, options) {
    await gotoBounds(dragElement, placeholder._bounds);
    placeholder.parentElement.replaceChild(dragElement, placeholder);
    cleanElements(dragElement, placeholder);
}

/**
 * Move the drag element to a defined bounds
 * @param bounds
 * @returns {Promise<unknown>}
 */
function gotoBounds(element, bounds) {
    return new Promise(resolve => {
        const start = setTimeout(() => {
            element.style.transition = "translate 0.3s ease-out";
            element.style.translate = `${bounds.x}px ${bounds.y}px`;
        });

        const wait = setTimeout(() => {
            clearTimeout(start);
            clearTimeout(wait);
            resolve();
        }, 350);
    })
}

/**
 * Once done with the drag and drop ensure that all properties are cleaned up
 * @param dragElement
 * @param placeholder
 */
function cleanElements(dragElement, placeholder) {
    delete dragElement._bounds;
    dragElement.style.width = "";
    dragElement.style.height = "";
    dragElement.style.rotate = "";
    dragElement.style.translate = "";
    dragElement.style.transition = "";
    dragElement.style.filter = "";

    delete placeholder._bounds;
}
