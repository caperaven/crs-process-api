export async function getMouseInputMap() {
    const map = {
        "mousedown": "mousedown",
        "mousemove": "mousemove",
        "mouseup": "mouseup"
    }

    const isMobile = await crs.call("system", "is_mobile");
    if (isMobile) {
        map["mousedown"] = "touchstart";
        map["mousemove"] = "touchmove";
        map["mouseup"] = "touchend";
    }

    return map;
}