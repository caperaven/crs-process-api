import {createPlaceholderElement} from "./placeholder.js";

/**
 * Handle the actions when the mouse is released and the drop action takes place.
 * @param dragElement
 * @param placeholder
 * @param options
 * @returns {Promise<void>}
 */
export async function drop(dragElement, placeholder, options, context) {
    options.currentAction = "drop";

    const elementsCollection = Array.from(this.element.children);
    const startIndex = elementsCollection.indexOf(placeholder);

    const intent = await allowDrop.call(this, dragElement, options);
    let endIndex = elementsCollection.indexOf(intent?.target);

    if (endIndex > startIndex) {
        endIndex--;
    }

    if (endIndex == -1) {
        endIndex = elementsCollection.length - 1;
    }

    if (intent == null || intent.target.classList.contains("placeholder")) {
        await gotoOrigin(dragElement, placeholder, options);
    }
    else {
        if (intent.position == "append") {
            await gotoTarget.call(this, dragElement, intent.target, options, placeholder);
        }

        if (intent.position == "before") {
            await insertBefore.call(this, dragElement, intent.target, options, placeholder);
        }
    }

    cleanElements(dragElement, placeholder, options);

    if (intent?.target != null && options.drop.callback) {
        if (typeof options.drop.callback == "object") {
            const step = options.drop.callback;
            await crs.call(step.type, step.action, step.args, context, null, {dragElement: dragElement, targetElement: intent.target});
        }
        else {
            await options.drop.callback(startIndex, endIndex, dragElement);
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

async function gotoTarget(dragElement, target, options, placeholder) {
    let targetPlaceholder = placeholder;

    if (placeholder.parentElement !== this.element || options.drop.action == "copy") {
        targetPlaceholder = await createPlaceholderElement(placeholder._bounds);
    }

    target.appendChild(targetPlaceholder);
    targetPlaceholder._bounds = targetPlaceholder.getBoundingClientRect();
    await gotoOrigin(dragElement, targetPlaceholder, options);
}

async function insertBefore(dragElement, target, options, placeholder) {
    let targetPlaceholder = placeholder;

    if (placeholder.parentElement !== this.element) {
        targetPlaceholder = await createPlaceholderElement(placeholder._bounds);
    }

    target.parentElement.insertBefore(targetPlaceholder, target);
    targetPlaceholder._bounds = targetPlaceholder.getBoundingClientRect();
    await gotoOrigin(dragElement, targetPlaceholder, options);
}

/**
 * Move the drag element to a defined bounds
 * @param bounds
 * @returns {Promise<unknown>}
 */
function gotoBounds(element, bounds) {
    return new Promise(resolve => {
        // animate the drag element on the animation layer to the bounds
        const start = setTimeout(() => {
            element.style.transition = "translate 0.3s ease-out";
            element.style.translate = `${bounds.x}px ${bounds.y}px`;
        });

        // once it is there, remove the element on the animation layer
        const wait = setTimeout(() => {
            clearTimeout(start);
            clearTimeout(wait);
            element.remove();
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
export async function allowDrop(dragElement, options) {
    const target = this.composedPath[0];

    if (target == null) {
        return null;
    }

    if (target.classList.contains("placeholder")) {
        return {
            target,
            position: "before"
        };
    }

    return AllowDrop[typeof options.drop.allowDrop].call(this, options, target);
}

class AllowDrop {
    static async string(options, target) {
        if (target.matches(options.drop.allowDrop)) {
            return {
                target,
                position: "append"
            };
        }

        if (target.parentElement?.matches(options.drop.allowDrop)) {
            return {
                target: target.parentElement,
                position: "append"
            };
        }

        return null;
    }

    static async function(options, target) {
        return await options.drop.allowDrop(target, options)
    }
}