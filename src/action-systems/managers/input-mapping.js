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
    return event.clientX || event.touches?.[0].pageX;
}

export function clientY(event) {
    return event.clientY || event.touches?.[0].pageY;
}