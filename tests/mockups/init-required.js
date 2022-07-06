import {ElementMock} from "./element.mock.js"
import {DocumentMock} from "./dom-mock.js";


export async function initRequired() {
    globalThis.HTMLElement = ElementMock;
    globalThis.DocumentFragment = ElementMock;

    globalThis.customElements = {
        define: () => {return null}
    }

    globalThis.document = new DocumentMock();
    globalThis.document.body = {
        dataset: {}
    }

    await import("./../../node_modules/crs-binding/crs-binding.js");
    await import("./../../node_modules/crs-modules/crs-modules.js");

    const module = await import("./../../src/index.js");
    await module.initialize("./../../src").catch(error => {
        console.error(error);
    });
}