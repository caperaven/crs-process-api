export default class Welcome extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        await crs.call("compile", "if-value", {exp: "value == 10 ? true : false"})
    }
}