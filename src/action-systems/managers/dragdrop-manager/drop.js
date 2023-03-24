import {createPlaceholderElement} from "./placeholder.js";

/**
 * Handle the actions when the mouse is released and the drop action takes place.
 * @param dragElement
 * @param placeholder
 * @param options
 * @returns {Promise<void>}
 */
export async function drop(dragElement, placeholder, options) {
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

    if (intent?.target != null && options.drop.callback != null) {
        await options.drop.callback(startIndex, endIndex, dragElement);
    }
}

/**
 * @function gotoOrigin - move the drag element to the placeholder
 * This is used by other functions also to ensure consistent animation behaviour.
 * When you drag the item and drop it on a non-supported element, this is also called.
 * @param dragElement {HTMLElement} - the element that is being dragged
 * @param placeholder {HTMLElement} - the placeholder element
 * @returns {Promise<void>}
 */
async function gotoOrigin(dragElement, placeholder, options) {
    await gotoBounds(dragElement, placeholder._bounds);

    if (dragElement._dragElement != null) {
        const element = dragElement._dragElement;
        delete dragElement._dragElement;
        dragElement = element;
    }

    if (options.drag.clone === "element" || options.drag.clone === "template") {
        placeholder.parentElement.replaceChild(dragElement, placeholder);
    }
}

/**
 * @function gotoTarget - move the drag element to the target element
 * This is used when you append the element to a target element.
 * @param dragElement {HTMLElement} - the element that is being dragged
 * @param target {HTMLElement} - the target element
 * @param options {Object} - the options object that was passed to the dragdrop manager
 * @param placeholder {HTMLElement} - the placeholder element
 * @returns {Promise<void>}
 */
async function gotoTarget(dragElement, target, options, placeholder) {
    let targetPlaceholder = placeholder;

    if (placeholder.parentElement !== this.element || options.drop.action == "copy") {
        targetPlaceholder = await createPlaceholderElement(placeholder._bounds);
    }

    target.appendChild(targetPlaceholder);
    targetPlaceholder._bounds = targetPlaceholder.getBoundingClientRect();
    await gotoOrigin(dragElement, targetPlaceholder, options);
}

/**
 * @function insertBefore - insert the drag element and add it before the target element
 * This is used on collections such as lists where you drop the item on another list item.
 * List item in this context does not have to be li, but a child in a collection.
 * @param dragElement {HTMLElement} - the element that is being dragged
 * @param target {HTMLElement} - the target element
 * @param options {Object} - the options object that was passed to the dragdrop manager
 * @param placeholder {HTMLElement} - the placeholder element
 * @returns {Promise<void>}
 */
async function insertBefore(dragElement, target, options, placeholder) {
    let targetPlaceholder = placeholder;

    if (placeholder.parentElement !== this.element || options.drop.action == "copy") {
        targetPlaceholder = await createPlaceholderElement(placeholder._bounds);
    }

    target.parentElement.insertBefore(targetPlaceholder, target);
    targetPlaceholder._bounds = targetPlaceholder.getBoundingClientRect();
    await gotoOrigin(dragElement, targetPlaceholder, options);
}

/**
 * @function gotoBounds - move the drag element to the bounds
 * @param element {HTMLElement} - the element to move, generally it is the element being dragged
 * @param bounds {Object} - the bounds object that contains the x and y coordinates, most often a boundingClientRect
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
        // we wait for 350ms to ensure that the animation is done
        const wait = setTimeout(() => {
            clearTimeout(start);
            clearTimeout(wait);
            element.remove();
            resolve();
        }, 350);
    })
}

/**
 * @function cleanElements - Once done with the drag and drop ensure that all properties are cleaned up
 * @param dragElement {HTMLElement} - the element that is being dragged
 * @param placeholder {HTMLElement} - the placeholder element
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
 * @function allowDrop - Check if you are allowed to drop here
 * @param event {Event} - the event that is being fired
 * @param options {Object} - the options object that was passed to the dragdrop manager
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

/**
 * @class AllowDrop - This class contains the different ways to check if you are allowed to drop here
 * The types of operations are:
 * - string - a selector string where we use css matching to check if you may drop here. For simple scenarios this is the easiest way.
 * - function - a function that is called to check if you may drop here. This is useful when you want to check for more complex scenarios.
 */
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