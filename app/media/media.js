import "./../../src/action-systems/media-actions.js";

export default class Media extends crsbinding.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();

        const element = this.shadowRoot.querySelector("video");
        crs.call("media", "render_camera", {element: element});
    }

    async capture() {
        crs.call("media", "capture_image", {
            target: this.shadowRoot.querySelector("canvas"),
            source: this.shadowRoot.querySelector("video")
        })
    }

    async download() {
        crs.call("files", "save_canvas", {
            source: this.shadowRoot.querySelector("canvas")
        })
    }
}

