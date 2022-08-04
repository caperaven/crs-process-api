/**
 * This deals with resizing of elements, moving it, interactive functions
 */

export class DomInteractiveActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

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

    static async clear_animation_layer(step, context, process, item) {
        const element = document.querySelector("#animation-layer");
        if (element != null) {
            element.innerHTML = "";
        }
    }

    static async remove_animation_layer(step, context, process, item) {
        const element = document.querySelector("#animation-layer");
        element?.parentElement?.removeChild(element);
    }

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

    static async enable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const resizeQuery = await crs.process.getValue(step.args.resize_query, context, process, item);
        const options = await crs.process.getValue(step.args.options, context, process, item);

        new ResizeElementManager(element, resizeQuery, options);
    }

    static async disable_resize(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        element.__resizeManager?.dispose();
    }
}

class ResizeElementManager {
    constructor(element, resizeQuery, options) {
        this._element = element;
        this._resizeQuery = resizeQuery;
        this._options = options;

        this._mouseDownHandler = this.mouseDown.bind(this);
        this._mouseMoveHandler = this.mouseMove.bind(this);
        this._mouseUpHandler = this.mouseUp.bind(this);

        this._element.addEventListener("mousedown", this._mouseDownHandler);
        element.__resizeManager = this;
    }

    dispose() {
        this._element.removeEventListener("mousedown", this._mouseDownHandler);
        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;

        delete this._element.__resizeManager;
        delete this._element;
        delete this._resizeQuery;
        delete this._options;
    }

    mouseDown(event) {
        if (event.target.matches(this._resizeQuery)) {
            this._targetElement = event.target.parentElement;
            this._bounds = this._targetElement.getBoundingClientRect();
            this._startPos = {x: event.clientX, y: event.clientY};

            this._options.min = this._options.min || {};
            this._options.min.width = this._options.min.width || this._bounds.width;
            this._options.min.height = this._options.min.height || this._bounds.height;

            this._options.max = this._options.max || {};
            this._options.max.width = this._options.max.width || Number.MAX_VALUE;
            this._options.max.height = this._options.max.height || Number.MAX_VALUE;

            document.addEventListener("mousemove", this._mouseMoveHandler);
            document.addEventListener("mouseup", this._mouseUpHandler);
        }
    }

    mouseMove(event) {
        let offsetX = event.clientX - this._startPos.x;
        let offsetY = event.clientY - this._startPos.y;

        if (this._options.lock_axis == "x") {
            offsetY = 0;
        }

        if (this._options.lock_axis == "y") {
            offsetX = 0;
        }

        let width = this._bounds.width + offsetX;
        let height = this._bounds.height + offsetY;

        width = width < this._options.min.width ? this._options.min.width : width > this._options.max.width ? this._options.max.width : width;
        height = height < this._options.min.height ? this._options.min.height : height > this._options.max.height ? this._options.max.height : height;

        this._targetElement.style.width = `${width}px`;
        this._targetElement.style.height = `${height}px`;
    }

    mouseUp(event) {
        document.removeEventListener("mousemove", this._mouseMoveHandler);
        document.removeEventListener("mouseup", this._mouseUpHandler);

        delete this._targetElement;
        this._bounds = null;
        this._startPos = null;
    }
}

crs.intent.dom_interactive = DomInteractiveActions;