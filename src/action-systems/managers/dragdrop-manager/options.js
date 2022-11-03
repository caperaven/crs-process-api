/**
 * Ensure that the options have logical defaults
 * @param options
 * @returns {*}
 */
export function ensureOptions(options) {
    options.dragQuery = options.dragQuery || "[draggable='true']";
    options.rotation = options.rotate || 0;
    options.insertBetween = options.insertBetween || true;

    options.drag = ensureDragOptions(options.drag);
    options.drop = ensureDropOptions(options.drop);
    return options;
}

/**
 * Make sure that the drag options are set to logcial defaults if missing
 * @param drag
 * @returns {{dragClone}}
 */
function ensureDragOptions(drag) {
    drag = drag || {};
    drag.placeholderType = drag.placeholderType || "standard";
    drag.clone = drag.clone || "element";
    return drag;
}

function ensureDropOptions(drop) {
    drop ||= {};

    drop.allowDrop ||= "[aria-dropeffect]";
    drop.action ||= "move";

    return drop;
}