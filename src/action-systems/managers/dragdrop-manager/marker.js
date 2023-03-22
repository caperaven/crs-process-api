export async function updateMarker(event) {
    if (this.updateMarkerHandler == null) return;

    // update the marker here
    console.log(event);

    requestAnimationFrame(this.updateMarkerHandler);
}