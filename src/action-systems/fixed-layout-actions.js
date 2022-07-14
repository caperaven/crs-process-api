export class FixedLayoutActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    static async show_element_relative_to(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parentElement = await crs.dom.get_element(step.args.target, context, process, item);
        const location = await crs.process.getValue(step.args.location, context, process, item);
        const padding = (await crs.process.getValue(step.args.padding, context, process, item) || 0);
        const screenPadding = (await crs.process.getValue(step.args.screen_padding, context, process, item) || 0);

        switch(location) {
            case "left": await crs.call("fixed_layout", "place_left", step.args, context, process, item); break;
            case "right": await crs.call("fixed_layout", "place_right", step.args, context, process, item); break;
            case "top": await crs.call("fixed_layout", "place_top", step.args, context, process, item); break;
            case "bottom": await crs.call("fixed_layout", "place_bottom", step.args, context, process, item); break;
        }

        await crs.call("fixed_layout", "ensure_on_screen", {element: element}, context, process, item);
    }

    static async set_fixed_position(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const left = await crs.dom.get_element(step.args.left, context, process, item);
        const top = await crs.dom.get_element(step.args.top, context, process, item);

        setFixedPosition(element, left, top);
        await crs.call("fixed_layout", "ensure_on_screen", step, context, process, item);
    }

    static async place_left(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parentElement = await crs.dom.get_element(step.args.target, context, process, item);
        const parentRect = await crs.call("dom", "get_element_bounds", {element: parentElement}, context, process, item);
        const rect = await crs.call("dom", "get_element_bounds", {element: element}, context, process, item);
        const padding = await crs.process.getValue(step.args.padding || 0, context, process, item);
        const parentStyles = getComputedStyle(parentElement);
        const styles = getComputedStyle(element);

        const left = parentRect.left - rect.width - padding - getPixels(parentStyles.marginLeft) - getPixels(styles.marginRight);
        const top = parentRect.top;
        await setFixedPosition(element, left, top);
    }

    static async place_right(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parentElement = await crs.dom.get_element(step.args.target, context, process, item);
        const parentRect = await crs.call("dom", "get_element_bounds", {element: parentElement}, context, process, item);
        const rect = await crs.call("dom", "get_element_bounds", {element: element}, context, process, item);
        const padding = await crs.process.getValue(step.args.padding || 0, context, process, item);
        const parentStyles = getComputedStyle(parentElement);
        const styles = getComputedStyle(element);

        const left = parentRect.left + parentRect.width + padding + getPixels(parentStyles.marginRight) + getPixels(styles.marginLeft);
        const top = parentRect.top;
        await setFixedPosition(element, left, top);
    }

    static async place_top(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parentElement = await crs.dom.get_element(step.args.target, context, process, item);
        const parentRect = await crs.call("dom", "get_element_bounds", {element: parentElement}, context, process, item);
        const rect = await crs.call("dom", "get_element_bounds", {element: element}, context, process, item);
        const padding = await crs.process.getValue(step.args.padding || 0, context, process, item);
        const parentStyles = getComputedStyle(parentElement);
        const styles = getComputedStyle(element);

        const left = parentRect.left;
        const top = parentRect.top - rect.height - padding - getPixels(parentStyles.marginTop) - getPixels(styles.marginBottom);
        await setFixedPosition(element, left, top);
    }

    static async place_bottom(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const parentElement = await crs.dom.get_element(step.args.target, context, process, item);
        const parentRect = await crs.call("dom", "get_element_bounds", {element: parentElement}, context, process, item);
        const rect = await crs.call("dom", "get_element_bounds", {element: element}, context, process, item);
        const padding = await crs.process.getValue(step.args.padding || 0, context, process, item);
        const parentStyles = getComputedStyle(parentElement);
        const styles = getComputedStyle(element);

        const left = parentRect.left;
        const top = parentRect.top + parentRect.height + padding + getPixels(parentStyles.marginBottom) + getPixels(styles.marginTop);
        await setFixedPosition(element, left, top);
    }

    static async ensure_on_screen(step, context, process, item) {
        const element = await crs.dom.get_element(step.args.element, context, process, item);
        const rect = await crs.call("dom", "get_element_bounds", {element: element}, context, process, item);
        const elementBounds = {left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height};

        const bodyBounds = await crs.call("dom", "get_element_bounds", {element: document.body}, context, process, item);

        // check left side
        if (elementBounds.left < 0) {
            elementBounds.left = screenPadding;
        }

        // check right side
        if (elementBounds.left + elementBounds.width >  bodyBounds.left + bodyBounds.width) {
            elementBounds.left = bodyBounds.left + bodyBounds.width - elementBounds.width - screenPadding;
        }

        // check top side
        if (elementBounds.top < 0) {
            elementBounds.top = screenPadding;
        }

        // check bottom side
        if (elementBounds.top + elementBounds.height > bodyBounds.top + bodyBounds.height) {
            elementBounds.top = bodyBounds.top + bodyBounds.height - elementBounds.height - screenPadding;
        }

        await setFixedPosition(element, elementBounds.left, elementBounds.top);
    }

}

function setFixedPosition(element, left, top) {
    element.style.position = "fixed";
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
}

function getPixels(str) {
    return Number(str.replace("px", ""));
}

crs.intent.fixed_layout = FixedLayoutActions;