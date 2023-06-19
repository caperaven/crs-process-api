export default class MobileViewModel extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async preLoad() {
        this.setProperty("isMobile", await crs.call("system", "is_mobile"));
    }
}