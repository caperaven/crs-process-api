export class DragDropManager {
    constructor(element, options) {
        this._element = element;
        this._options = options;
        this._options.rotation = this._options.rotate || 0;

        this._mouseDownHandler = this.mouseDown.bind(this);
        this._mouseMoveHandler = this.mouseMove.bind(this);
        this._mouseUpHandler = this.mouseUp.bind(this);
        this._element.addEventListener("mousedown", this._mouseDownHandler);

        element.__dragDropManager = this;
    }

    dispose() {
        this._element.removeEventListener("mousedown", this._mouseDownHandler);

        this._mouseDownHandler = null;
        this._mouseMoveHandler = null;
        this._mouseUpHandler = null;

        delete this._element.__dragDropManager;
        delete this._element;
    }

    async mouseDown(event) {
        if (event.target.getAttribute("draggable") == "true") {
            this._dragElement = event.target;
        }
        else if (event.target.parentElement.getAttribute("draggable") == "true") {
            this._dragElement = event.target.parentElement;
        }

        if (this._dragElement) {
            this.bounds = this._dragElement.getBoundingClientRect();

            this._start = {x: event.clientX, y: event.clientY};
            this._dragElement.setAttribute("aria-grabbed", "true");
            this._placeholder = await createPlaceholder(this._dragElement, this.bounds);

            const animationLayer = await crs.call("dom_interactive", "get_animation_layer");
            animationLayer.appendChild(this._dragElement);

            await crs.call("dom", "set_styles", {
                element: this._dragElement,
                styles: {
                    transform: `translate(${this.bounds.x}px, ${this.bounds.y}px) rotate(${this._options.rotate}deg)`,
                    width: `${this.bounds.width}px`,
                    height: `${this.bounds.height}px`
                }
            })

            document.addEventListener("mousemove", this._mouseMoveHandler);
            document.addEventListener("mouseup", this._mouseUpHandler);
        }

        event.preventDefault();
    }

    async mouseMove(event) {
        const offsetX = event.clientX - this._start.x;
        const offsetY = event.clientY - this._start.y;

        this._dragElement.style.transform = `translate(${this.bounds.x + offsetX}px, ${this.bounds.y + offsetY}px) rotate(${this._options.rotate}deg)`
    }

    async mouseUp(event) {
        this._dragElement?.removeAttribute("aria-grabbed");

        document.removeEventListener("mousemove", this._mouseMoveHandler);
        document.removeEventListener("mouseup", this._mouseUpHandler);
        delete this._dragElement;
        delete this._placeholder;
        delete this._start;

        await crs.call("dom_interactive", "remove_animation_layer");
    }
}

async function createPlaceholder(element, bounds) {
    const placeholder = await crs.call("dom", "create_element", {
        classes: ["placeholder"],
        styles: {
            "width": `${bounds.width}px`,
            "height": `${bounds.height}px`
        }
    })

    element.parentElement.replaceChild(placeholder, element);
    return placeholder;
}