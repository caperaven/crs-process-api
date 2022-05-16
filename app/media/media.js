import "./../../src/action-systems/media-actions.js";

export default class Media extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        const element = document.querySelector("video");
        crs.call("media", "render_camera", {element: element});
    }

    async capture() {
        crs.call("media", "capture_image", {
            target: this.element.querySelector("canvas"),
            source: this.element.querySelector("video")
        })
    }

    async download() {
        crs.call("files", "save_canvas", {
            source: this.element.querySelector("canvas")
        })
    }
}

