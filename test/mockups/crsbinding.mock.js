import {DocumentMock} from "./dom-mock.js";

export async function loadBinding() {
    globalThis.HTMLElement = (await import("./element.mock.js")).ElementMock;
    globalThis.customElements = {
        define: () => {return null}
    }
    globalThis.document = new DocumentMock();
    await import("./../../node_modules/crs-binding/crs-binding.js");
}

