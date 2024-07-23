/**
 * @class DomInteractiveActions - This deals with resizing of elements, moving it, interactive functions.
 *
 * Features:
 * -get_animation_layer - get the animation layer
 * -clear_animation_layer - clear the animation layer
 * -remove_animation_layer - remove the animation layer
 * -highlight - highlight an element
 * -clone_for_movement - clone an element for movement
 * -enable_resize - enable resizing of an element
 * -disable_resize - disable resizing of an element
 * -enable_dragdrop - enable drag and drop of an element
 * -disable_dragdrop - disable drag and drop of an element
 * -enable_move - enable moving of an element
 * -disable_move - disable moving of an element
 */

export class DomInteractiveActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * @method get_animation_layer - Create an animation layer for elements to move and animate on.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.target {String} - The id of the target element.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "get_animation_layer", {
     *  target: "my-list"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "get_animation_layer",
     *  "args": {
     *    "target": "my-list"
     *  }
     * }
     *
     * @returns {Promise<void>}
     */
    static async get_animation_layer(step, context, process, item) {
        const layer = document.querySelector("#animation-layer");
        if (layer != null) {
            return layer;
        }

        const element = await crs.call("dom", "create_element", {
            parent: document.body,
            tag_name: "div",
            id: "animation-layer",
            dataset: {
                layer: "animation"
            },
            styles: {
                position: "fixed",
                inset: 0,
                zIndex: 9999999999,
                background: "transparent",
                pointerEvents: "none"
            }
        }, context, process, item)

        if (step?.args?.target != null) {
            await crs.process.setValue(step.args.target, element, context, process, item);
        }

        return element;
    }

    /**
     * @method clear_animation_layer - Remove all elements from the animation layer.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "clear_animation_layer");
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "clear_animation_layer"
     * }
     *
     * @returns {Promise<void>}
     */
    static async clear_animation_layer(step, context, process, item) {
        const element = document.querySelector("#animation-layer");
        if (element != null) {
            element.innerHTML = "";
        }
    }

    /**
     * @method remove_animation_layer - Remove the animation layer from the dom
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "remove_animation_layer");
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "remove_animation_layer"
     * }
     *
     * @returns {Promise<void>}
     */
    static async remove_animation_layer(step, context, process, item) {
        const element = document.querySelector("#animation-layer");
        element?.parentElement?.removeChild(element);
    }

    /**
     * @method highlight - Create a highlight graphic around a given element
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.target {String} - The id of the target element.
     * @param step.args.classes {String} - The classes to apply to the highlight element.
     * @param step.args.duration {Number} - The duration of the highlight animation.
     * @param step.args.template {String} - The template to use for the highlight element.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "highlight", {
     *   target: "my-list",
     *   classes: "highlight",
     *   duration: 1000,
     *   template: "<div class='highlight'></div>"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "highlight",
     *  "args": {
     *    "target": "my-list",
     *    "classes": "highlight",
     *    "duration": 1000,
     *    "template": "<div class='highlight'></div>"
     *  }
     * }
     */
    static async highlight(step, context, process, item) {
        const animationLayer = await this.get_animation_layer();
        const target = await crs.dom.get_element(step.args.target, context, process, item);
        const bounds = target.getBoundingClientRect();
        const classes = await crs.process.getValue(step.args.classes, context, process, item);
        const duration = (await crs.process.getValue(step.args.duration, context, process, item)) || 0;
        const template = await crs.process.getValue(step.args.template, context, process, item);

        let highlight;

        const styles = {
            position: "fixed",
            left: `${bounds.left}px`,
            top: `${bounds.top}px`,
            width: `${bounds.width}px`,
            height: `${bounds.height}px`
        }

        if (template != null) {
            highlight = template.content.cloneNode(true).children[0];
            await crs.call("dom", "set_styles", {
                element: highlight,
                styles: styles
            })

            if (classes != null) {
                highlight.classList.add(...classes);
            }

            animationLayer.appendChild(highlight);
        }
        else {
            highlight = await crs.call("dom", "create_element", {
                parent: animationLayer,
                tag_name: "div",
                styles: styles,
                classes: classes
            })
        }

        if (duration > 0) {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                highlight?.parentElement?.removeChild(highlight);
            }, duration)
        }
    }

    /**
     * @method clone_for_movement - Clone an element for the purpose of drag and drop
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to clone.
     * @param step.args.parent {String} - The id of the parent element to append the clone to.
     * @param step.args.position {Object} - The position of the clone.
     * @param step.args.attributes {Object} - The attributes to apply to the clone.
     * @param step.args.styles {Object} - The styles to apply to the clone.
     * @param step.args.classes {[String]} - The classes to apply to the clone.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "clone_for_movement", {
     *  element: "my-list",
     *  parent: "my-list",
     *  position: {x: 0, y: 0},
     *    attributes: {
     *    "id": "my-list-clone"
     *   },
     *  styles: {
     *    "position": "absolute"
     *   },
     *  classes: ["my-list-clone"]
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "clone_for_movement",
     *  "args": {
     *    "element": "my-list",
     *    "parent": "my-list",
     *    "position": {x: 0, y: 0},
     *    "attributes": {
     *      "id": "my-list-clone"
     *    },
     *    "styles": {
     *      "position": "absolute"
     *    },
     *    "classes": ["my-list-clone"]
     *   }
     * }
     *
     * @returns {Promise} - A promise that resolves with the clone.
     */
    static async clone_for_movement(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parent = await crs.dom.get_element(step.args.parent, context, process, item);

        const position = await crs.process.getValue(step.args.position || {x: 0, y: 0}, context, process, item);

        const result = element.cloneNode(true);

        const attributes = Object.keys(step.args.attributes || {});
        const styles = Object.keys(step.args.styles || {});
        const classes = step.args.classes || [];

        for (let attr of attributes) {
            result.setAttribute(attr, await crs.process.getValue(step.args.attributes[attr], context, process, item));
        }

        for (let style of styles) {
            result.style[style] = await crs.process.getValue(step.args.styles[style], context, process, item);
        }

        for (let cls of classes) {
            result.classList.add(cls);
        }

        if (parent != null) {
            parent.appendChild(result);
            result.style.position = "absolute";
            result.style.transform = `translate(${position.x}px, ${position.y}px)`;
        }

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method enable_resize - Enable resize functionality on a element so that interactions will perform resize operations.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to enable resize on.
     * @param step.args.resize_query {String} - The query to use to find the resize handles.
     * @param [step.args.options] {Object} - The options to pass to the resize manager.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "enable_resize", {
     *  element: "my-list",
     *  resize_query: ".resize-handle",
     *  options: {}
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "enable_resize",
     *  "args": {
     *    "element": "my-list",
     *    "resize_query": ".resize-handle",
     *    "options": {}
     * }
     * }
     *
     * @returns {Promise} - A promise that resolves when the resize functionality is enabled.
     */
    static async enable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const resizeQuery = await crs.process.getValue(step.args.resize_query, context, process, item);
        const options = await crs.process.getValue(step.args.options, context, process, item);

        const file = import.meta.url.replace("dom-interactive-actions.js", "managers/resize-element-manager.js");
        const module = await import(file);

        new module.ResizeElementManager(element, resizeQuery, options);
    }

    /**
     * @method disable_resize - Resize features are no longer required on an element so remove the resize ability on that element.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to disable resize on.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "disable_resize", {
     *   element: "my-list"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "disable_resize",
     *  "args": {
     *    "element": "my-list"
     *  }
     * }
     *
     * @returns {Promise} - A promise that resolves when the resize functionality is disabled.
     */
    static async disable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__resizeManager?.dispose();
    }

    /**
     * @method enable_dragdrop - Enable drag and drop behaviour on a parent element who's children can be dragged.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to enable drag and drop on.
     * @param [step.args.options] {Object} - The options to pass to the drag and drop manager.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "enable_dragdrop", {
     *   element: "my-list",
     *   options: {}
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "enable_dragdrop",
     *  "args": {
     *    "element": "my-list",
     *    "options": {}
     *   }
     * }
     *
     * @returns {Promise} - A promise that resolves when the drag and drop functionality is enabled.
     */
    static async enable_dragdrop(step, context, process, item) {
        const options = await crs.process.getValue(step.args.options, context, process, item);
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        const file = import.meta.url.replace("dom-interactive-actions.js", "managers/dragdrop-manager.js");
        const module = await import(file);
        new module.DragDropManager(element, options);
    }

    /**
     * @method disable_dragdrop - Drag and drop operations are no longer required so you can remove the feature from the element
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to disable drag and drop on.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "disable_dragdrop", {
     *  element: "my-list"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "disable_dragdrop",
     *  "args": {
     *   "element": "my-list"
     *   }
     * }
     */
    static async disable_dragdrop(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__dragDropManager?.dispose();
        delete element.__dragDropManager;
    }

    /**
     * @method enable_move - Enable the movement of fixed position items.
     * This is used for things like floating menu items that are at a fixed position.
     * Note that your element's position must be fixed, the top set to 0 and the left set to 0;
     * Use translate to position the element on the screen.
     * The element you define will be the item you move.
     * If a child is responsible for starting the move process, set the move_query to match that of the child.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to enable move on.
     * @param step.args.move_query {String} - The query to use to find the element that starts the move process.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "enable_move", {
     *  element: "my-list",
     *  move_query: ".move"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "enable_move",
     *  "args": {
     *    "element": "my-list",
     *    "move_query": ".move"
     *   }
     * }
     *
     * @returns {Promise} - A promise that resolves when the move functionality is enabled.
     */
    static async enable_move(step, context, process, item) {
        const moveQuery = await crs.process.getValue(step.args.move_query, context, process, item);
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const callback = await crs.process.getValue(step.args.callback, context, process, item);

        const file = import.meta.url.replace("dom-interactive-actions.js", "managers/move-manager.js");
        const module = await import(file);
        new module.MoveManager(element, moveQuery, callback);
    }

    /**
     * @method disable_move - Disable the movement of fixed position items.
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object that is being executed.
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.element {String} - The id of the element to disable move on.
     *
     * @example <caption>javascript</caption>
     * await crs.call("dom-interactive", "disable_move", {
     *   element: "my-list"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "type": "dom-interactive",
     *  "action": "disable_move",
     *  "args": {
     *     "element": "my-list"
     *   }
     * }
     *
     * @returns {Promise} - A promise that resolves when the move functionality is disabled.
     */
    static async disable_move(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__moveManager?.dispose();
        delete element.__moveManager;
    }
}

crs.intent.dom_interactive = DomInteractiveActions;