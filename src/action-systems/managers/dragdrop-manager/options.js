/**
 * Ensure that the options have logical defaults
 * - dragQuery - default("[draggable='true']"): the query selector to use to find draggable elements
 * - drag.placeholderType - default("standard"): the type of placeholder to use
 * - drag.clone - default("element"): the type of clone to use
 * - drop.allowDrop - default("[aria-dropeffect]"): the query selector to use to find elements that can be dropped on
 * - drop.action - default("move"): the action to take when dropping an element
 * @param options
 * @returns {*}
 */
export function ensureOptions(options) {
    options = options || {
        drag: {}
    };
    options.drag = ensureDragOptions(options.drag);
    options.drop = ensureDropOptions(options.drop);
    return options;
}

/**
 * @function ensureDragOptions - Make sure that the drag options are set to logical defaults if missing
 * @param drag
 * @returns {{dragClone}}
 */
function ensureDragOptions(drag) {
    drag = drag || {};
    drag.query = "[draggable='true']";
    drag.placeholderType = drag.placeholderType || "standard";
    drag.clone = drag.clone || "element";
    return drag;
}

/**
 * @function ensureDropOptions - Make sure that the drop options are set to logical defaults if missing
 * @param drop
 * @returns {*|{}}
 */
function ensureDropOptions(drop) {
    drop ||= {};

    drop.allowDrop ||= "[aria-dropeffect]";
    drop.action ||= "move";

    return drop;
}