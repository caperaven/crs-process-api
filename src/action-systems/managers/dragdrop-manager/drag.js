import {scrollY, scrollX} from "./scroll.js";
import {inArea} from "./drag-utils.js";

/**
 * Start the drag operation by creating the animation layer and adding the drag element too it.
 * @param dragElement
 * @returns {Promise<void>}
 */
export async function startDrag(dragElement, options) {
    const layer = await crs.call("dom_interactive", "get_animation_layer");
    const element = await DragClone[options.drag.clone](dragElement, options);
    element.style.translate = `${dragElement._bounds.x}px ${dragElement._bounds.y}px`;
    element.style.filter = "drop-shadow(0 0 5px #00000080)";
    layer.appendChild(element);
    return element;
}

class DragClone {
    static async element(dragElement) {
        return dragElement;
    }

    /**
     * The template can be defined on the options under drag or on the drag element as a data-template attribute
     * @param dragElement
     * @param options
     * @returns {Promise<void>}
     */
    static async template(dragElement, options) {
        let template = options.drag.template;
        if (template == null) {
            template = document.querySelector(`#${dragElement.dataset.template}`);
        }

        const result =  template.content.cloneNode(true).children[0];
        result._bounds = dragElement._bounds;
        result.dragElement = dragElement;
        return result;
        // JHR: todo, enable inflation on templates
    }
}

/**
 * The main update loop for the drag operation.
 * This is called from the drag manager as the drag manager.
 * "this" is the drag manager.
 * @returns {Promise<void>}
 */
export async function updateDrag(frameTime) {
    if (this.updateDragHandler == null) return;

    const x = this.dragElement._bounds.x + (this.movePoint.x - this.startPoint.x);
    const y = this.dragElement._bounds.y + (this.movePoint.y - this.startPoint.y);

    this.dragElement.style.translate = `${x}px ${y}px`;

    if (this.scrollAreas != null) {
        if (inArea(this.movePoint.x, this.movePoint.y, this.scrollAreas.left)) {
            await scrollX.call(this, frameTime, -1);
        }
        else if (inArea(this.movePoint.x, this.movePoint.y, this.scrollAreas.right)) {
            await scrollX.call(this, frameTime, 1);
        }
        else if (inArea(this.movePoint.x, this.movePoint.y, this.scrollAreas.top)) {
            await scrollX.call(this, frameTime, -1);
        }
        else if (inArea(this.movePoint.x, this.movePoint.y, this.scrollAreas.bottom)) {
            await scrollX.call(this, frameTime, 1);
        }
    }

    requestAnimationFrame(this.updateDragHandler);
}

