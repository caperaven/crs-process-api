/**
 * @function getMouseInputMap - this function gives you back a object you can use to map input events based on mobile status.
 * If not mobile mouse events are as they always are, but if not it uses the touch events.
 * This way you can still use the normal mouse events but on touch it would under the hood use the right map
 * @returns {Promise<{mouseup: string, mousemove: string, mousedown: string}>}
 */
export function getMouseInputMap() {
    const map = {
        "mousedown": "mousedown",
        "mousemove": "mousemove",
        "mouseup": "mouseup"
    }

    if (globalThis.isMobile) {
        map["mousedown"] = "touchstart";
        map["mousemove"] = "touchmove";
        map["mouseup"] = "touchend";
    }

    return map;
}

export function clientX(event) {
    let x = event.clientX;

    if (x == null) {
        x = event.touches?.[0]?.pageX;
    }

    if (x == null) {
        x = event.changedTouches?.[0]?.pageX;
    }

    return x;
}

export function clientY(event) {
    let y = event.clientY;

    if (y == null) {
        y = event.touches?.[0]?.pageY;
    }

    if (y == null) {
        y = event.changedTouches?.[0]?.pageY;
    }

    return y;
}