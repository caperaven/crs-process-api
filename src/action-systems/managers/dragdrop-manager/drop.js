/**
 * Handle the actions when the mouse is released and the drop action takes place.
 * @param dragElement
 * @param placeholder
 * @param options
 * @returns {Promise<void>}
 */
export async function drop(event, dragElement, placeholder, options, context) {
    const target = await allowDrop(event, dragElement, options);

    if (target == null || target.classList.contains("placeholder")) {
        await gotoOrigin(dragElement, placeholder, options);
    }
    else {
        await gotoTarget(event, dragElement, target, options, placeholder);
    }

    cleanElements(dragElement, placeholder, options);

    if (target != null && options.drop.callback) {
        if (typeof options.drop.callback == "object") {
            const step = options.drop.callback;
            await crs.call(step.type, step.action, step.args, context, null, {dragElement: dragElement, targetElement: target});
        }
        else {
            await options.drop.callback(dragElement, target);
        }
    }
}

/**
 * Move back to where you started the drag operation from
 * @param dragElement
 * @param placeholder
 * @returns {Promise<void>}
 */
async function gotoOrigin(dragElement, placeholder, options) {
    await gotoBounds(dragElement, placeholder._bounds);

    if (dragElement._dragElement != null) {
        const element = dragElement._dragElement;
        delete dragElement._dragElement;
        dragElement = element;
    }

    if (options.drag.clone == "element") {
        placeholder.parentElement.replaceChild(dragElement, placeholder);
    }
}

async function gotoTarget(event, dragElement, target, options, placeholder) {
    target.appendChild(dragElement);

    switch (options.drop.action) {
        case "move": {
            placeholder.parentElement.removeChild(placeholder);
            break;
        }
    }
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
function cleanElements(dragElement, placeholder, options) {
    delete dragElement._bounds;
    dragElement.style.width = "";
    dragElement.style.height = "";
    dragElement.style.rotate = "";
    dragElement.style.translate = "";
    dragElement.style.transition = "";
    dragElement.style.filter = "";

    if (options.drag?.placeholderType == "opacity" && options.drop?.action == "copy") {
        placeholder.style.opacity = 1;
    }

    delete placeholder._bounds;
}

/**
 * Check if you are allowed to drop here
 * @param event
 * @param options
 * @returns {Promise<*>}
 */
export async function allowDrop(event, dragElement, options) {
    const target = event.target || event.composedPath()[0];

    if (target.classList.contains("placeholder")) {
        return target;
    }

    return AllowDrop[typeof options.drop.allowDrop](event, options);
}

class AllowDrop {
    static async string(event, options) {
        const target = event.composedPath()[0];

        if (target.matches(options.drop.allowDrop)) {
            return target;
        }

        if (target.parentElement?.matches(options.drop.allowDrop)) {
            return target.parentElement;
        }

        return null;
    }

    static async function(event, options) {
        const target = event.target || event.composedPath()[0];
        return await options.drop.allowDrop(event, target, options)
    }
}