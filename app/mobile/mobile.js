export default class MobileViewModel extends crsbinding.classes.ViewBase {
    async preLoad() {
        this.setProperty("isMobile", await crs.call("system", "is_mobile"));
    }
}