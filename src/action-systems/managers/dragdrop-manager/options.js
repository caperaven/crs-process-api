export function ensureOptions(options) {
    options.dragQuery = options.dragQuery || "[draggable='true']";
    options.rotation = options.rotate || 0;
    options.dropEffect = options.dropEffect || "move";
    options.insertBetween = options.insertBetween || true;

    options.drag = ensureDragOptions(options.drag);
    return options;
}

function ensureDragOptions(drag) {
    drag = drag || {};
    drag.placeholderType = drag.placeholderType || "standard";
    drag.dragClone = drag.dragClone || "element";
    return drag;
}