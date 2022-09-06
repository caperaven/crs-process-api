export async function startDrag(dragElement) {
    const layer = await crs.call("dom_interactive", "get_animation_layer");
    dragElement.style.translate = `${dragElement._bounds.x}px ${dragElement._bounds.y}px`;
    layer.appendChild(dragElement);
}

export async function updateDrag() {
    if (this._updateDragHandler == null) return;

    const x = this._dragElement._bounds.x + (this._movePoint.x - this._startPoint.x);
    const y = this._dragElement._bounds.y + (this._movePoint.y - this._startPoint.y);

    this._dragElement.style.translate = `${x}px ${y}px`;
    requestAnimationFrame(this._updateDragHandler);
}