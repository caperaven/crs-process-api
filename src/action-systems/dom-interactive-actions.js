/**
 * This deals with resizing of elements, moving it, interactive functions
 */

export class DomInteractiveActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Create a animation layer for elements to move and animate on.
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
     * Remove all elements from the animation layer.
     */
    static async clear_animation_layer(step, context, process, item) {
        const element = document.querySelector("#animation-layer");
        if (element != null) {
            element.innerHTML = "";
        }
    }

    /**
     * Remove the animation layer from the dom
     */
    static async remove_animation_layer(step, context, process, item) {
        const element = document.querySelector("#animation-layer");
        element?.parentElement?.removeChild(element);
    }

    /**
     * Create a highlight graphic around a given element
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
     * Clone a element for the purpose of drag and drop
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

        return result;
    }

    /**
     * Enable resize functionality on a element so that interactions will perform resize operations.
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
     * Resize features are no longer required on an element so remove the resize ability on that element.
     */
    static async disable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__resizeManager?.dispose();
    }

    /**
     * Enable drag and drop behaviour on a parent element who's children can be dragged.
     */
    static async enable_dragdrop(step, context, process, item) {
        const options = await crs.process.getValue(step.args.options, context, process, item);
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        const file = import.meta.url.replace("dom-interactive-actions.js", "managers/dragdrop-manager.js");
        const module = await import(file);
        new module.DragDropManager(element, options);
    }

    /**
     * Drag and drop operations are no longer required so you can remove the feature from the element
     */
    static async disable_dragdrop(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__dragDropManager?.dispose();
        delete element.__dragDropManager;
    }

    static async enable_move(step, context, process, item) {
        const moveQuery = await crs.process.getValue(step.args.move_query, context, process, item);
        const element = await crs.dom.get_element(step.args.element, context, process, item);

        const file = import.meta.url.replace("dom-interactive-actions.js", "managers/move-manager.js");
        const module = await import(file);
        new module.MoveManager(element, moveQuery);
    }

    static async disable_move(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__moveManager?.dispose();
        delete element.__moveManager;
    }
}

crs.intent.dom_interactive = DomInteractiveActions;