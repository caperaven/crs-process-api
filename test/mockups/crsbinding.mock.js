import {DocumentMock} from "./dom-mock.js";

export async function loadBinding() {
    const elementMock = (await import("./element.mock.js")).ElementMock;
    globalThis.HTMLElement = elementMock;
    globalThis.DocumentFragment = elementMock;

    globalThis.customElements = {
        define: () => {return null}
    }
    globalThis.document = new DocumentMock();
    await import("./../../node_modules/crs-binding/crs-binding.js");
}

