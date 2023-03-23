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
            translate: `${dragElement.__bounds.x}px ${dragElement.__bounds.y}px`,
            width: `${dragElement.__bounds.width}px`
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
    const dropTarget = await this.validateDropTarget(this.target);
    if (dropTarget == null) return;

    if (dropTarget === this.lastTarget) return;
    this.lastTarget = dropTarget;

    if (dropTarget === this.element) {
        return addMarkerToContainer.call(this);
    }

    ensureBounds.call(this, dropTarget);

    this.marker.style.translate = `${dropTarget.__bounds.x}px ${dropTarget.__bounds.y}px`;
}

/**
 * @function addMarkerToContainer - add the marker to the container by showing it below the last child
 */
function addMarkerToContainer() {
    const lastChild = this.element.lastElementChild;

    ensureBounds.call(this, lastChild);

    this.marker.style.translate = `${lastChild.__bounds.x}px ${lastChild.__bounds.bottom}px`;
    console.log(this.marker.style.translate);
}

/**
 * @function ensureBounds - check if the bounds have been calculated.
 * If it has not, calculate it and add it to the cache.
 * @param element
 */
function ensureBounds(element) {
    if (element.__bounds == null) {
        element.__bounds = element.getBoundingClientRect();
        this.boundsCache.push(element);
    }
}