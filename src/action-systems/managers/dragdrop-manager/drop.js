/**
 * Handle the actions when the mouse is released and the drop action takes place.
 * @param dragElement
 * @param placeholder
 * @param options
 * @returns {Promise<void>}
 */
export async function drop(event, dragElement, placeholder, options) {
    const target = await allowDrop(event, dragElement, options);

    if (target == false) {
        await gotoOrigin(dragElement, placeholder);
    }
    else {
        await gotoTarget(event, dragElement, target, options);
    }
    cleanElements(dragElement, placeholder);
}

/**
 * Move back to where you started the drag operation from
 * @param dragElement
 * @param placeholder
 * @returns {Promise<void>}
 */
async function gotoOrigin(dragElement, placeholder) {
    await gotoBounds(dragElement, placeholder._bounds);

    if (dragElement._dragElement != null) {
        const element = dragElement._dragElement;
        delete dragElement._dragElement;
        dragElement = element;
    }

    placeholder.parentElement.replaceChild(dragElement, placeholder);
}

async function gotoTarget(event, dragElement, target, options) {
    dragElement.parentElement.removeChild(dragElement);
    target.appendChild(dragElement);
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
            element.parentElement.removeChild(element);
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

/**
 * Check if you are allowed to drop here
 * @param event
 * @param options
 * @returns {Promise<*>}
 */
async function allowDrop(event, dragElement, options) {
    return AllowDrop[typeof options.drop.allowDrop](event, options);
}

class AllowDrop {
    static async string(event, options) {
        if (event.target.matches(options.drop.allowDrop)) {
            return event.target;
        }

        if (event.target.parentElement?.matches(options.drop.allowDrop)) {
            return event.target.parentElement;
        }

        return false;
    }

    static async function(event, options) {
        return await options.drop.allowDrop(event)
    }

    static async object(event) {

    }
}