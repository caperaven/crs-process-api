/**
 * @function startMarker - create the marker and add it to the animation layer
 * This is the first step in the drag and drop process
 * @param dragElement
 * @returns {Promise<HTMLDivElement>}
 */
export async function startMarker(dragElement) {
    ensureBounds.call(this, dragElement);

    const marker = await crs.call("dom", "create_element", {
        tag_name: "div",
        styles: {
            position: "absolute",
            left: "0",
            top: "0",
            willChange: "transform",
            translate: `${dragElement._bounds.x}px ${dragElement._bounds.y}px`,
            width: `${dragElement._bounds.width}px`
        },
        classes: ["drag-marker"]
    })

    const layer = await crs.call("dom_interactive", "get_animation_layer");
    layer.appendChild(marker);

    return marker;
}

/**
 * @function updateMarker - update the marker to the current target
 * This does not do the actual work but is the timer that calls the actual work
 * @param now
 * @returns {Promise<void>}
 */
export async function updateMarker(now) {
    if (this.updateMarkerHandler == null) return;

    const duration = Math.abs(now - (this._lastTime || 0));

    if (duration >= 16) {
        this._lastTime = now;
        performUpdateMarker.call(this).catch(error => console.error(error));
    }

    requestAnimationFrame(this.updateMarkerHandler);
}

/**
 * @function performUpdateMarker - update the marker to the current target
 * There are some conditions to this such as.
 * - The target must be a valid drop target
 * - The target must be different from the last target
 * @returns {Promise<void>}
 */
async function performUpdateMarker() {
    const dropIntent = await this.validateDropTarget(this.target);
    const dropTarget = dropIntent?.target;

    if (dropTarget == null) return;

    if (dropTarget === this.lastTarget) return;
    this.lastTarget = dropTarget;

    if (dropTarget === this.element || dropIntent.position === "append") {
        return addMarkerToContainer.call(this, dropIntent.target);
    }

    ensureBounds.call(this, dropTarget);

    this.marker.style.translate = `${dropTarget._bounds.x}px ${dropTarget._bounds.y}px`;
}

/**
 * @function addMarkerToContainer - add the marker to the container by showing it below the last child
 */
function addMarkerToContainer(target) {
    const container = (target || this.element);
    const lastChild = container.lastElementChild;
    let property = "bottom";
    let newTarget = lastChild;

    if (lastChild == null) {
        property = "top";
        newTarget = container;
    }

    ensureBounds.call(this, newTarget);

    this.marker.style.translate = `${newTarget._bounds.x}px ${newTarget._bounds[property]}px`;
}

/**
 * @function ensureBounds - check if the bounds have been calculated.
 * If it has not, calculate it and add it to the cache.
 * @param element
 */
function ensureBounds(element) {
    if (element._bounds == null) {
        element._bounds = element.getBoundingClientRect();
        this.boundsCache.push(element);
    }
}