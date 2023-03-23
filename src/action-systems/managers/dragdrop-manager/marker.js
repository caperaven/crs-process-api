export async function startMarker(dragElement) {
    ensureBounds.call(this, dragElement);

    const marker = document.createElement("div");
    marker.style.position = "absolute";
    marker.style.left = "0";
    marker.style.top = "0";
    marker.style.willChange = "transform";
    marker.style.translate = `${dragElement.__bounds.x}px ${dragElement.__bounds.y}px`;
    marker.style.width = `${dragElement.__bounds.width}px`;
    marker.classList.add("drag-marker");

    const layer = await crs.call("dom_interactive", "get_animation_layer");
    layer.appendChild(marker);

    return marker;
}

export async function updateMarker(now) {
    if (this.updateMarkerHandler == null) return;

    const duration = Math.abs(now - (this._lastTime || 0));

    if (duration >= 16) {
        this._lastTime = now;
        performUpdateMarker.call(this).catch(error => console.error(error));
    }

    requestAnimationFrame(this.updateMarkerHandler);
}

async function performUpdateMarker() {
    const dropTarget = await this.validateDropTarget(this.target);
    if (dropTarget == null) return;

    if (dropTarget === this.lastTarget) return;
    this.lastTarget = dropTarget;

    if (dropTarget === this.element) {
        return addMarkerToContainer.call(this);
    }

    ensureBounds.call(this, dropTarget);

    this.marker.style.translate = `${this.target.__bounds.x}px ${this.target.__bounds.y}px`;

    console.log(this.marker.style.translate);
}

function addMarkerToContainer() {
    const lastChild = this.element.lastElementChild;

    ensureBounds.call(this, lastChild);

    this.marker.style.translate = `${lastChild.__bounds.x}px ${lastChild.__bounds.bottom}px`;
    console.log(this.marker.style.translate);
}

function ensureBounds(element) {
    if (element.__bounds == null) {
        element.__bounds = element.getBoundingClientRect();
        this.boundsCache.push(element);
    }
}