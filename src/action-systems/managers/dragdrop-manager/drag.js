/**
 * Start the drag operation by creating the animation layer and adding the drag element too it.
 * @param dragElement
 * @returns {Promise<void>}
 */
export async function startDrag(dragElement) {
    const layer = await crs.call("dom_interactive", "get_animation_layer");
    dragElement.style.translate = `${dragElement._bounds.x}px ${dragElement._bounds.y}px`;
    dragElement.style.filter = "drop-shadow(0 0 5px #00000080)";
    layer.appendChild(dragElement);
}

/**
 * The main update loop for the drag operation.
 * This is called from the drag manager as the drag manager.
 * "this" is the drag manager.
 * @returns {Promise<void>}
 */
export async function updateDrag() {
    if (this._updateDragHandler == null) return;

    const x = this._dragElement._bounds.x + (this._movePoint.x - this._startPoint.x);
    const y = this._dragElement._bounds.y + (this._movePoint.y - this._startPoint.y);

    this._dragElement.style.translate = `${x}px ${y}px`;
    requestAnimationFrame(this._updateDragHandler);
}