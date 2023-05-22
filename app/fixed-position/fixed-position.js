export default class FixedPositionVM extends crs.binding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        for (const position of ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]) {
            const element = document.querySelector(`[data-position="${position}"]`);
            await crs.call("fixed_position", "set", { element: element, position: position, margin: 10});
        }
    }
}